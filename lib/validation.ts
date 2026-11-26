export type MeetingInput = {
  businessName: string;
  name: string;
  email: string;
  website: string;
  phone: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof MeetingInput, string>>;

export const LIMITS = {
  businessName: 120,
  name: 100,
  email: 254,
  website: 253,
  phone: 40,
  message: 2000,
} as const;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const HOST_RE =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

/** Removes control characters, which also blocks header injection. */
function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  const pattern = multiline
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, " ").trim().slice(0, max + 1);
}

/**
 * Accepts "example.com" or "https://example.com/path" and returns a
 * normalized https/http URL, or null if it is not a plausible website.
 */
export function normalizeWebsite(raw: string): string | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;
  if (!HOST_RE.test(url.hostname)) return null;
  return url.toString();
}

export function validateMeeting(
  body: unknown,
): { ok: true; data: MeetingInput } | { ok: false; errors: FieldErrors } {
  const src = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  const errors: FieldErrors = {};

  const businessName = clean(src.businessName, LIMITS.businessName);
  const name = clean(src.name, LIMITS.name);
  const email = clean(src.email, LIMITS.email).toLowerCase();
  const websiteRaw = clean(src.website, LIMITS.website);
  const phone = clean(src.phone, LIMITS.phone);
  const message = clean(src.message, LIMITS.message, true);

  if (!businessName) errors.businessName = "Please enter your business name.";
  else if (businessName.length > LIMITS.businessName)
    errors.businessName = "Business name is too long.";

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = "Name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address, like name@example.com.";

  let website = "";
  if (!websiteRaw) errors.website = "Please enter your business website.";
  else {
    const normalized = normalizeWebsite(websiteRaw);
    if (!normalized)
      errors.website =
        "Please enter a valid website, like example.com or https://example.com.";
    else website = normalized;
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (
      phone.length > LIMITS.phone ||
      !/^[+()\d\s.\-x#]+$/i.test(phone) ||
      digits.length < 7 ||
      digits.length > 15
    )
      errors.phone = "Please enter a valid phone number, or leave it blank.";
  }

  if (message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { businessName, name, email, website, phone, message },
  };
}

/** Very small link-spam heuristic for the free-text message. */
export function looksLikeSpam(message: string): boolean {
  const links = message.match(/https?:\/\/|www\./gi) ?? [];
  return links.length > 2;
}
