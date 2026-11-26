import { describe, expect, it } from "vitest";
import { normalizeWebsite, validateMeeting } from "@/lib/validation";

const good = {
  businessName: "Juniper Lane Coffee",
  name: "Sam Lee",
  email: "Sam@Example.com",
  website: "example.com",
  phone: "",
  message: "",
};

describe("normalizeWebsite", () => {
  it("accepts bare domains and full URLs", () => {
    expect(normalizeWebsite("example.com")).toBe("https://example.com/");
    expect(normalizeWebsite("https://example.com")).toBe("https://example.com/");
    expect(normalizeWebsite("www.example.co.uk/menu")).toBe("https://www.example.co.uk/menu");
  });
  it("rejects junk and dangerous schemes", () => {
    for (const bad of ["", "notasite", "javascript:alert(1)", "ftp://example.com", "exa mple.com", "http://localhost", "https://user:pw@example.com"])
      expect(normalizeWebsite(bad)).toBeNull();
  });
});

describe("validateMeeting", () => {
  it("accepts a valid inquiry and normalizes it", () => {
    const r = validateMeeting(good);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.email).toBe("sam@example.com");
      expect(r.data.website).toBe("https://example.com/");
    }
  });
  it("requires business name, name, email and website", () => {
    const r = validateMeeting({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["businessName", "email", "name", "website"]);
  });
  it("rejects bad email and phone but allows blank phone", () => {
    const r = validateMeeting({ ...good, email: "nope", phone: "abc" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "phone"]);
  });
  it("strips line breaks that could inject headers", () => {
    const r = validateMeeting({ ...good, businessName: "Acme\r\nBcc: x@y.com" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.businessName).not.toMatch(/[\r\n]/);
  });
});
