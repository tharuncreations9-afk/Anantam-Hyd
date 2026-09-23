"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "anantam-pwa-dismissed";

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone || dismissed) return;

    const isIos =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      window.navigator.userAgent,
    );

    if (isIos && isSafari) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onPrompt = (event) => {
      event.preventDefault();
      setDeferred(event);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-lg items-start gap-4 border border-forest-deep/15 bg-ivory/95 px-4 py-4 shadow-[0_-8px_40px_rgba(23,35,29,0.12)] backdrop-blur-md sm:px-5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-forest-deep text-ivory">
          <Download className="h-4 w-4" strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-light tracking-wide text-forest-deep">
            Install Anantam
          </p>
          {iosHint ? (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Tap Share, then <span className="text-forest-deep">Add to Home Screen</span>{" "}
              for a one-tap app experience.
            </p>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Add Anantam to your home screen for quick access anytime.
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {!iosHint && deferred ? (
              <button
                type="button"
                onClick={install}
                className="border border-forest-deep bg-forest-deep px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-forest"
              >
                Install
              </button>
            ) : null}
            <button
              type="button"
              onClick={dismiss}
              className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-forest-deep"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-muted transition-colors hover:text-forest-deep"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
