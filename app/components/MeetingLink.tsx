"use client";

import type { ReactNode } from "react";

/**
 * A link to the inquiry form. Scrolls there (respecting reduced motion)
 * and moves keyboard/screen-reader focus to the form heading.
 */
export function MeetingLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#meeting"
      className={className}
      onClick={(e) => {
        const target = document.getElementById("meeting");
        if (!target) return;
        e.preventDefault();
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        history.replaceState(null, "", "#meeting");
        document
          .getElementById("meeting-heading")
          ?.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
