"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, X } from "lucide-react";
import EnquiriesViewer from "@/components/EnquiriesViewer";

export default function EnquiryEyeAccess() {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setUnlocked(false);
    setPassword("");
    setError("");
    setChecking(false);
  };

  const onUnlock = async (event) => {
    event.preventDefault();
    setChecking(true);
    setError("");
    try {
      const response = await fetch("/api/enquiries/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Incorrect password.");
      }
      setUnlocked(true);
      setPassword("");
    } catch (err) {
      setError(err.message || "Incorrect password.");
    } finally {
      setChecking(false);
    }
  };

  const panel =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest-deep/55 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-label="Private access"
            onClick={closeAll}
          >
            <div
              className={`relative w-full overflow-hidden bg-ivory shadow-xl ${
                unlocked
                  ? "max-h-[90vh] max-w-5xl overflow-y-auto p-6 sm:p-8"
                  : "max-w-sm p-6 sm:p-8"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeAll}
                className="absolute right-4 top-4 text-muted transition-colors hover:text-forest-deep"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {!unlocked ? (
                <form onSubmit={onUnlock} className="pt-2">
                  <input
                    type="password"
                    name="access"
                    autoComplete="current-password"
                    autoFocus
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="w-full border-b border-forest-deep/20 bg-transparent py-3 text-sm text-charcoal outline-none placeholder:text-muted/60 focus:border-gold"
                  />
                  {error ? (
                    <p className="mt-3 text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={checking || !password}
                    className="mt-8 w-full border border-forest-deep bg-forest-deep px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest disabled:opacity-50"
                  >
                    {checking ? "Checking…" : "Continue"}
                  </button>
                </form>
              ) : (
                <div className="pt-4">
                  <EnquiriesViewer />
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center text-muted/40 transition-colors hover:text-gold"
        aria-label="Open"
      >
        <Eye className="h-4 w-4" strokeWidth={1.5} />
      </button>
      {panel}
    </>
  );
}
