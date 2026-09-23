"use client";

import { useEffect } from "react";

/** Scroll to enquiry form when landing with #enquiry or #enquiry-form */
export default function ContactHashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash !== "enquiry" && hash !== "enquiry-form") return;

    const scrollToForm = () => {
      const target =
        document.getElementById("enquiry") ||
        document.getElementById("enquiry-form");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const timer = window.setTimeout(scrollToForm, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
