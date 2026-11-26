import { NextResponse } from "next/server";
import { EmailConfigError, sendMeetingEmail } from "@/lib/email";
import { once, rateLimited } from "@/lib/guard";
import { looksLikeSpam, validateMeeting } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500; // humans need more than ~2.5s to fill the form
const MAX_BODY_BYTES = 20_000;
const ID_RE = /^[A-Za-z0-9-]{16,64}$/;

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  // Same-origin only (blocks cross-site form posts).
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("host");
    try {
      if (new URL(origin).host !== host)
        return json({ ok: false, error: "forbidden" }, 403);
    } catch {
      return json({ ok: false, error: "forbidden" }, 403);
    }
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES)
    return json({ ok: false, error: "too_large" }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend success.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return json({ ok: true }, 200);
  }

  // Timing check: bots submit instantly.
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ ok: false, error: "too_fast" }, 429);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  const result = validateMeeting(body);
  if (!result.ok)
    return json({ ok: false, error: "validation", fields: result.errors }, 422);
  if (looksLikeSpam(result.data.message))
    return json({ ok: false, error: "rejected" }, 422);

  const submissionId =
    typeof body.submissionId === "string" && ID_RE.test(body.submissionId)
      ? body.submissionId
      : null;
  if (!submissionId) return json({ ok: false, error: "bad_request" }, 400);

  try {
    await once(submissionId, () => sendMeetingEmail(result.data, submissionId));
    return json({ ok: true }, 200);
  } catch (err) {
    if (err instanceof EmailConfigError) {
      console.error("[meeting] email is not configured on the server.");
      return json({ ok: false, error: "not_configured" }, 503);
    }
    return json({ ok: false, error: "send_failed" }, 502);
  }
}
