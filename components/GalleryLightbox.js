"use client";

import Image from "next/image";
import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

function blockImageTheft(event) {
  event.preventDefault();
}

function preloadUrl(url) {
  if (!url || typeof window === "undefined") return;
  const img = new window.Image();
  img.decoding = "async";
  img.src = url;
}

function neighborIndexes(index, total) {
  if (total < 2 || index == null) return [];
  const offsets = [-2, -1, 1, 2];
  return offsets
    .map((offset) => (index + offset + total * 10) % total)
    .filter((value, i, arr) => arr.indexOf(value) === i && value !== index);
}

export default function GalleryLightbox({ items, index, onClose, onNavigate }) {
  const item = index != null ? items[index] : null;
  const total = items.length;

  const [visible, setVisible] = useState(item);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);
  const loadToken = useRef(0);

  const goPrev = useCallback(() => {
    if (total < 2) return;
    onNavigate((index - 1 + total) % total);
  }, [index, total, onNavigate]);

  const goNext = useCallback(() => {
    if (total < 2) return;
    onNavigate((index + 1) % total);
  }, [index, total, onNavigate]);

  // Prefetch neighbors so next/prev feel instant
  useEffect(() => {
    if (index == null || !items.length) return;

    neighborIndexes(index, items.length).forEach((i) => {
      const neighbor = items[i];
      if (!neighbor) return;
      preloadUrl(neighbor.thumb || neighbor.image);
      preloadUrl(neighbor.image || neighbor.thumb);
    });
  }, [index, items]);

  // Smooth swap: keep current frame, load next, then crossfade
  useEffect(() => {
    if (!item) {
      setVisible(null);
      return;
    }

    const token = ++loadToken.current;
    const high = item.image || item.thumb;
    const low = item.thumb || item.image;

    // Instant placeholder from thumb (usually already cached from grid)
    setFading(true);
    setReady(false);
    setVisible(item);

    const finish = () => {
      if (loadToken.current !== token) return;
      setReady(true);
      requestAnimationFrame(() => {
        if (loadToken.current === token) setFading(false);
      });
    };

    if (!high) {
      finish();
      return;
    }

    const img = new window.Image();
    img.decoding = "async";
    img.onload = finish;
    img.onerror = finish;
    img.src = high;

    // Also warm the thumb path if different
    if (low && low !== high) preloadUrl(low);

    // If already cached, onload may fire sync — fading cleared in finish
    if (img.complete) finish();
  }, [item]);

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

  if (item == null || visible == null || typeof document === "undefined") {
    return null;
  }

  const showSrc = ready
    ? visible.image || visible.thumb
    : visible.thumb || visible.image;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${visible.title} — gallery viewer`}
      onContextMenu={blockImageTheft}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close gallery viewer"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center text-ivory/80 transition-colors hover:text-ivory sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X className="h-6 w-6" strokeWidth={1.5} />
      </button>

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

      <div
        className="relative z-[5] mx-auto flex max-h-[min(92vh,900px)] w-[min(92vw,1100px)] flex-col items-center px-14 sm:px-20"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={blockImageTheft}
      >
        <div className="relative flex min-h-[40vh] max-h-[min(82vh,820px)] w-full items-center justify-center">
          <Image
            key={`${visible.id}-${ready ? "hi" : "lo"}`}
            src={showSrc}
            alt={visible.title}
            width={visible.width}
            height={visible.height}
            sizes="(max-width: 1100px) 92vw, 1100px"
            priority
            draggable={false}
            onContextMenu={blockImageTheft}
            onDragStart={blockImageTheft}
            className={`pointer-events-none max-h-[min(82vh,820px)] w-auto max-w-full select-none object-contain transition-opacity duration-300 ease-out ${
              fading ? "opacity-40" : "opacity-100"
            }`}
            style={{ WebkitUserDrag: "none", userSelect: "none" }}
          />
          <div
            className="absolute inset-0 z-[1]"
            aria-hidden="true"
            onContextMenu={blockImageTheft}
            onDragStart={blockImageTheft}
          />
          {!ready ? (
            <div
              className="pointer-events-none absolute bottom-3 left-1/2 z-[2] h-1 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-ivory/15"
              aria-hidden="true"
            >
              <div className="h-full w-1/2 animate-pulse bg-ivory/50" />
            </div>
          ) : null}
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
