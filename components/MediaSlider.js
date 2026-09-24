"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSwipe from "@/components/useSwipe";

const DEFAULT_MS = 5000;

export default function MediaSlider({
  slides = [],
  alt = "",
  interval = DEFAULT_MS,
  fit = "cover",
  className = "",
  showDots = true,
}) {
  const items = slides.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + items.length) % items.length);
  }, [items.length]);

  const swipe = useSwipe({
    onNext: goNext,
    onPrev: goPrev,
    enabled: items.length > 1,
  });

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const timer = window.setInterval(goNext, interval);
    return () => window.clearInterval(timer);
  }, [paused, items.length, interval, goNext]);

  if (!items.length) return null;

  return (
    <div
      className={`relative touch-pan-y overflow-hidden bg-ivory select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        swipe.onMouseLeave();
      }}
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
      onTouchCancel={swipe.onTouchCancel}
      onMouseDown={swipe.onMouseDown}
      onMouseUp={swipe.onMouseUp}
      aria-roledescription="carousel"
      style={{ touchAction: "pan-y" }}
    >
      {items.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt={i === index ? alt : ""}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            priority={i === 0}
            draggable={false}
            className={
              fit === "contain"
                ? "pointer-events-none object-contain"
                : "pointer-events-none object-contain object-center sm:object-cover sm:object-center"
            }
          />
        </div>
      ))}

      {showDots && items.length > 1 ? (
        <div
          className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
          role="tablist"
          aria-label="Image slides"
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === index
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-ivory/55 hover:bg-ivory/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
