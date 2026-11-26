import type { MeetingInput } from "./validation";

export class EmailConfigError extends Error {}
export class EmailSendError extends Error {}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmail(data: MeetingInput) {
  const subject = `New meeting request — ${data.businessName}`.replace(
    /[\r\n]+/g,
    " ",
  );

  const rows: [string, string][] = [
    ["Business name", data.businessName],
    ["Website", data.website],
    ["Contact name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "Not provided"],
    ["Goals / message", data.message || "Not provided"],
  ];

  const text =
    `New meeting request\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nReply to this email to respond directly to ${data.name}.`;

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#0b1230;max-width:600px">` +
    `<h2 style="margin:0 0 16px">New meeting request</h2>` +
    `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="border-bottom:1px solid #e5e5e5;font-weight:bold;vertical-align:top;width:160px">${escapeHtml(k)}</td>` +
          `<td style="border-bottom:1px solid #e5e5e5;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table><p style="color:#555">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p></div>`;

  return { subject, text, html };
}

/**
 * Sends the notification through Resend. Resolves only when Resend has
 * accepted the message (HTTP 2xx).
 */
export async function sendMeetingEmail(
  data: MeetingInput,
  idempotencyKey: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_EMAIL;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !to || !from) {
    throw new EmailConfigError(
      "Missing RESEND_API_KEY, LEADS_EMAIL or EMAIL_FROM.",
    );
  }

  const base = process.env.RESEND_API_BASE || "https://api.resend.com";
  const { subject, text, html } = buildEmail(data);

  let res: Response;
  try {
    res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `meeting-${idempotencyKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new EmailSendError("Could not reach the email provider.");
  }

  if (!res.ok) {
    // Log status only; never log the key or visitor details.
    console.error(`[meeting] email provider rejected message: ${res.status}`);
    throw new EmailSendError(`Email provider returned ${res.status}.`);
  }
}
