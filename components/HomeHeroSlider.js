"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useSwipe from "@/components/useSwipe";

const SLIDE_MS = 6500;

const slides = [
  {
    id: "arrival",
    src: "https://storage.fotoowl.ai/events/361477/LvyLXdFazKTM62dC2bETKc0BUA83/high/v2/3635810d-01ff-4eca-93e0-7ca105bc155d/AMC08565.webp?last=1789642070",
    alt: "Stone pavilion entrance at Anantam Resort",
    eyebrow: "Arrival",
    lines: ["Where the city", "falls away."],
    support:
      "A grand entrance framed by stone, palms and open sky — your first breath of Anantam.",
  },
  {
    id: "escape",
    src: "https://storage.fotoowl.ai/events/361477/LvyLXdFazKTM62dC2bETKc0BUA83/high/v2/822041f4-c13a-450a-ab75-71f57b37af30/AMC08602.webp?last=1789642923",
    alt: "Garden fountain and tropical grounds at Anantam",
    eyebrow: "Shamshabad · Hyderabad",
    lines: ["A quiet escape,", "just beyond the city."],
    support: null,
  },
  {
    id: "reception",
    src: "https://storage.fotoowl.ai/events/361477/LvyLXdFazKTM62dC2bETKc0BUA83/high/v2/d8b794f8-2728-4b54-90c7-3c64208fbd85/AMC08943.webp?last=1789642771",
    alt: "Warmly lit reception lounge at Anantam by night",
    eyebrow: "Reception",
    lines: ["A warm welcome,", "when the lights come on."],
    support:
      "Lantern glow, carved wood and quiet hospitality — reception that feels like coming home.",
  },
];

export default function HomeHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + slides.length) % slides.length);
  }, []);

  const swipe = useSwipe({ onNext: goNext, onPrev: goPrev });

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(goNext, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [paused, goNext]);

  const active = slides[index];

  return (
    <section
      className="relative bg-forest-deep sm:flex sm:min-h-[100svh] sm:items-end sm:overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Anantam resort highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        swipe.onMouseLeave();
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {/* Image — full landscape on mobile, no text on top of it */}
      <div
        className="relative aspect-[3/2] w-full touch-pan-y select-none sm:absolute sm:inset-0 sm:aspect-auto"
        style={{ touchAction: "pan-y" }}
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
        onTouchCancel={swipe.onTouchCancel}
        onMouseDown={swipe.onMouseDown}
        onMouseUp={swipe.onMouseUp}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              quality={90}
              sizes="100vw"
              draggable={false}
              className="pointer-events-none object-contain object-center sm:object-cover"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-forest-deep/60 via-forest-deep/20 to-forest-deep/30 sm:block" />

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 sm:bottom-8">
          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}: ${slide.eyebrow}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-8 bg-gold"
                    : "w-1.5 bg-ivory/50 hover:bg-ivory/80 sm:bg-ivory/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Copy — below image on mobile (clears logo), overlay on desktop */}
      <div className="relative z-10 container-luxury section-pad w-full py-8 sm:absolute sm:inset-x-0 sm:bottom-0 sm:pb-28 sm:pt-32 lg:pb-32">
        <div key={active.id} className="max-w-4xl">
          <p className="label-caps animate-[fade-up_0.7s_ease_both] text-ivory/70">
            {active.eyebrow}
          </p>
          <h1 className="editorial-heading mt-3 animate-[fade-up_0.8s_ease_0.08s_both] text-balance sm:mt-5">
            {active.lines.join(" ")}
          </h1>
          {active.support ? (
            <p className="mt-3 max-w-lg animate-[fade-up_0.8s_ease_0.16s_both] text-sm leading-relaxed text-ivory/75 sm:mt-6 sm:text-base lg:text-lg">
              {active.support}
            </p>
          ) : null}
        </div>

        <div className="mt-8 hidden flex-col items-center gap-2 text-ivory/70 sm:mt-10 sm:flex">
          <span className="label-caps text-[0.58rem]">Scroll</span>
          <span className="h-8 w-px bg-ivory/50" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
