"use client";

import { useEffect, useState } from "react";
import { MeetingLink } from "./MeetingLink";

/** Mobile-only bottom bar that keeps the form one tap away. */
export function StickyCta() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero-actions");
    const form = document.getElementById("meeting");
    if (!hero || !form || !("IntersectionObserver" in window)) return;
    let heroVisible = true;
    let formVisible = false;
    const update = () => setHidden(heroVisible || formVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === form) formVisible = e.isIntersecting;
      }
      update();
    });
    io.observe(hero);
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-cta${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <MeetingLink className="btn btn-lime btn-block">Request a Meeting</MeetingLink>
    </div>
  );
}
