import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/meeting/route";
import { resetGuards } from "@/lib/guard";

const base = {
  businessName: "Juniper Lane Coffee",
  name: "Sam Lee",
  email: "sam@example.com",
  website: "example.com",
  phone: "562-555-0100",
  message: "More orders <b>please</b>",
  company_url: "",
  startedAt: Date.now() - 10_000,
  submissionId: "11111111-2222-3333-4444-555555555555",
};

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/meeting", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost", "x-forwarded-for": "9.9.9.9", ...headers },
    body: JSON.stringify(body),
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetGuards();
  process.env.RESEND_API_KEY = "re_test";
  process.env.LEADS_EMAIL = "pranavsairam2005@gmail.com";
  process.env.EMAIL_FROM = "Pranavs Marketing Agency <meetings@example.com>";
  fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "abc" }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllGlobals());

describe("POST /api/meeting", () => {
  it("sends one email with the right subject, recipient and Reply-To", async () => {
    const res = await POST(req(base));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const sent = JSON.parse(init.body);
    expect(sent.subject).toBe("New meeting request — Juniper Lane Coffee");
    expect(sent.to).toEqual(["pranavsairam2005@gmail.com"]);
    expect(sent.reply_to).toBe("sam@example.com");
    expect(sent.from).toContain("meetings@example.com");
    expect(sent.text).toContain("https://example.com/");
    expect(sent.text).toContain("562-555-0100");
    expect(sent.html).toContain("&lt;b&gt;please&lt;/b&gt;"); // escaped
    expect(init.headers.Authorization).toBe("Bearer re_test");
  });

  it("returns field errors and sends nothing when invalid", async () => {
    const res = await POST(req({ ...base, email: "bad" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.email).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not report success when the provider fails, and allows retry", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    const fail = await POST(req(base));
    expect(fail.status).toBe(502);
    expect((await fail.json()).ok).toBe(false);
    const retry = await POST(req(base));
    expect(retry.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reports a network failure as a send failure", async () => {
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    expect((await POST(req(base))).status).toBe(502);
  });

  it("returns 503 when email is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(req(base));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends only once for repeated/concurrent submissions with the same id", async () => {
    const [a, b] = await Promise.all([POST(req(base)), POST(req(base))]);
    const c = await POST(req(base));
    expect([a.status, b.status, c.status]).toEqual([200, 200, 200]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("silently drops honeypot submissions without emailing", async () => {
    const res = await POST(req({ ...base, company_url: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects instant (bot-speed) submissions", async () => {
    const res = await POST(req({ ...base, startedAt: Date.now() }));
    expect(res.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate limits a single IP", async () => {
    let last = 200;
    for (let i = 0; i < 10; i++)
      last = (await POST(req({ ...base, submissionId: `aaaaaaaa-bbbb-cccc-dddd-00000000000${i}` }))).status;
    expect(last).toBe(429);
  });

  it("rejects cross-site origins and link-stuffed messages", async () => {
    expect((await POST(req(base, { origin: "https://evil.example" }))).status).toBe(403);
    const spam = await POST(req({ ...base, message: "http://a.co http://b.co http://c.co" }));
    expect(spam.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("strips CR/LF from the subject", async () => {
    await POST(req({ ...base, businessName: "Evil\r\nBcc: a@b.com" }));
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.subject).not.toMatch(/[\r\n]/);
  });
});
