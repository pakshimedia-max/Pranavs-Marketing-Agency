# Pranavs Marketing Agency

One-page marketing site (Next.js + TypeScript) with a server-side meeting-request form that emails each inquiry via [Resend](https://resend.com).

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | What to enter |
| --- | --- |
| `LEADS_EMAIL` | Where requests are delivered. Already set to `pranavsairam2005@gmail.com`. |
| `EMAIL_FROM` | A sender on a domain you verified in Resend, e.g. `Pranavs Marketing Agency <meetings@yourdomain.com>`. |
| `RESEND_API_KEY` | API key from the Resend dashboard (server-only, never exposed to the browser). |

In production (Vercel, etc.), add the same three variables in the host's environment settings.

## Test a real inquiry

```bash
npm run dev      # or: npm run build && npm start
```

Open http://localhost:3000, fill in the form, and press **Send Meeting Request**. The email arrives at `LEADS_EMAIL` with the subject `New meeting request — [Business Name]`, and Reply-To is the visitor's email. (Submit at least ~3 seconds after the page loads; faster submissions are treated as bots.)

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Notes

- Spam protection: hidden honeypot field, minimum fill time, per-IP rate limit (in-memory), same-origin check, link-count limit.
- Duplicate protection: the button locks while sending, and each submission carries an id used for server-side de-duplication and as the Resend idempotency key.
- Sample ads use original SVG illustrations of a fictional coffee shop.
