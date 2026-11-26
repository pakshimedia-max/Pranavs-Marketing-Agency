"use client";

import { useEffect, useRef, useState } from "react";
import {
  LIMITS,
  validateMeeting,
  type FieldErrors,
  type MeetingInput,
} from "@/lib/validation";

type Status = "idle" | "sending" | "success" | "error";

const FALLBACK =
  "You can also call 562-441-1972 or email pranavsairam2005@gmail.com.";

const ERROR_COPY: Record<string, string> = {
  too_fast: "That was a little quick. Please wait a moment and press send again.",
  rate_limited: "Too many requests from this connection. Please try again in a few minutes.",
  forbidden: "We couldn't send your request. Please refresh the page and try again.",
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return Array.from({ length: 4 }, () =>
    Math.random().toString(16).slice(2, 10).padEnd(8, "0"),
  ).join("-");
}

const FIELD_ORDER: (keyof MeetingInput)[] = [
  "businessName",
  "name",
  "email",
  "website",
  "phone",
  "message",
];

export function MeetingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  // One id per attempt-set: reused on retry so a request that actually went
  // through can never produce a second email. Replaced after success.
  const submissionId = useRef("");
  const sendingLock = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = newId();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingLock.current) return; // ignore repeated clicks / Enter presses
    const form = e.currentTarget;
    const fd = new FormData(form);
    const values = Object.fromEntries(
      FIELD_ORDER.map((k) => [k, String(fd.get(k) ?? "")]),
    );

    const check = validateMeeting(values);
    if (!check.ok) {
      setErrors(check.errors);
      setFormError("");
      setStatus("idle");
      const first = FIELD_ORDER.find((k) => check.errors[k]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    sendingLock.current = true;
    setErrors({});
    setFormError("");
    setStatus("sending");

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company_url: String(fd.get("company_url") ?? ""),
          startedAt: startedAt.current,
          submissionId: submissionId.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: FieldErrors;
      };

      if (res.ok && data.ok) {
        form.reset();
        submissionId.current = newId();
        setStatus("success");
        return;
      }
      if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        setStatus("idle");
        const first = FIELD_ORDER.find((k) => data.fields?.[k]);
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }
      setFormError(
        (data.error && ERROR_COPY[data.error]) ||
          `Sorry, we couldn't send your request just now. Your details are still here, so please try again. ${FALLBACK}`,
      );
      setStatus("error");
    } catch {
      setFormError(
        `We couldn't reach the server. Check your connection and try again. Your details are still here. ${FALLBACK}`,
      );
      setStatus("error");
    } finally {
      sendingLock.current = false;
    }
  }

  const sending = status === "sending";

  if (status === "success") {
    return (
      <div className="form-card success" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className="success-tick" aria-hidden="true">✓</span>
        <p className="success-text">
          Thanks for reaching out! I’ll be in touch to set up a meeting. — Pranav
        </p>
      </div>
    );
  }

  const field = (k: keyof MeetingInput) => ({
    id: k,
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
    disabled: sending,
  });
  const err = (k: keyof MeetingInput) =>
    errors[k] ? (
      <span className="field-error" id={`${k}-error`}>
        {errors[k]}
      </span>
    ) : null;

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate ref={formRef} aria-busy={sending}>
      <div className="field">
        <label htmlFor="businessName">
          Business name <span className="req" aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <input {...field("businessName")} type="text" autoComplete="organization" required maxLength={LIMITS.businessName} />
        {err("businessName")}
      </div>

      <div className="field">
        <label htmlFor="name">
          Your name <span className="req" aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <input {...field("name")} type="text" autoComplete="name" required maxLength={LIMITS.name} />
        {err("name")}
      </div>

      <div className="field">
        <label htmlFor="email">
          Email address <span className="req" aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <input {...field("email")} type="email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} />
        {err("email")}
      </div>

      <div className="field">
        <label htmlFor="website">
          Business website <span className="req" aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <input
          {...field("website")}
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="example.com"
          required
          maxLength={LIMITS.website}
        />
        {err("website")}
      </div>

      <div className="field">
        <label htmlFor="phone">
          Phone number <span className="opt">(optional)</span>
        </label>
        <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} />
        {err("phone")}
      </div>

      <div className="field">
        <label htmlFor="message">
          What would you like your ads to achieve? <span className="opt">(optional)</span>
        </label>
        <textarea {...field("message")} rows={4} maxLength={LIMITS.message} />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_url">Leave this field empty</label>
        <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="btn btn-lime btn-lg btn-block" disabled={sending}>
        {sending ? "Sending…" : status === "error" ? "Try Again" : "Send Meeting Request"}
      </button>
      <p className="form-note">
        By submitting, you’re asking Pranav to contact you about your business.
      </p>
    </form>
  );
}
