"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

function blockImageTheft(event) {
  event.preventDefault();
}

export default function GalleryLightbox({ items, index, onClose, onNavigate }) {
  const item = index != null ? items[index] : null;
  const total = items.length;

  const goPrev = useCallback(() => {
    if (total < 2) return;
    onNavigate((index - 1 + total) % total);
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    if (total < 2) return;
    onNavigate((index + 1) % total);
  }, [index, total, onNavigate]);

  useEffect(() => {
    if (item == null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose, goPrev, goNext]);

  if (item == null || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — gallery viewer`}
      onContextMenu={blockImageTheft}
    >
      {/* Dim backdrop — click closes */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close gallery viewer"
        onClick={onClose}
      />

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center text-ivory/80 transition-colors hover:text-ivory sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {/* Prev / next side hit areas */}
      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-0 top-0 z-10 flex h-full w-[22%] max-w-40 items-center justify-start pl-3 text-ivory/70 transition-colors hover:bg-black/15 hover:text-ivory sm:pl-5"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-0 top-0 z-10 flex h-full w-[22%] max-w-40 items-center justify-end pr-3 text-ivory/70 transition-colors hover:bg-black/15 hover:text-ivory sm:pr-5"
            aria-label="Next image"
          >
            <ChevronRight className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
          </button>
        </>
      ) : null}

      {/* Image stage — pointer-events-none on img so right-click can't target CDN URL */}
      <div
        className="relative z-[5] mx-auto flex max-h-[min(92vh,900px)] w-[min(92vw,1100px)] flex-col items-center px-14 sm:px-20"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={blockImageTheft}
      >
        <div className="relative flex max-h-[min(82vh,820px)] w-full items-center justify-center">
          <Image
            key={item.id}
            src={item.image || item.thumb}
            alt={item.title}
            width={item.width}
            height={item.height}
            sizes="(max-width: 1100px) 92vw, 1100px"
            priority
            draggable={false}
            onContextMenu={blockImageTheft}
            onDragStart={blockImageTheft}
            className="pointer-events-none max-h-[min(82vh,820px)] w-auto max-w-full select-none object-contain"
            style={{ WebkitUserDrag: "none", userSelect: "none" }}
          />
          {/* Transparent shield — blocks open-in-new-tab / save-as on the image */}
          <div
            className="absolute inset-0 z-[1]"
            aria-hidden="true"
            onContextMenu={blockImageTheft}
            onDragStart={blockImageTheft}
          />
        </div>

        {total > 1 ? (
          <p className="relative z-[2] mt-4 label-caps text-ivory/45">
            {index + 1} / {total}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
