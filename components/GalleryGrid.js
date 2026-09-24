"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { galleryItems } from "@/data/gallery";
import GalleryLightbox from "@/components/GalleryLightbox";

const PAGE_SIZE = 24;

function blockImageTheft(event) {
  event.preventDefault();
}

export default function GalleryGrid() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const shown = galleryItems.slice(0, visible);
  const hasMore = visible < galleryItems.length;

  const openAt = useCallback((itemId) => {
    const index = galleryItems.findIndex((item) => item.id === itemId);
    if (index >= 0) setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navigateLightbox = useCallback((nextIndex) => setLightboxIndex(nextIndex), []);

  return (
    <div>
      <p className="mb-10 text-sm text-muted">
        Showing {shown.length} of {galleryItems.length} photographs
      </p>

      {/* Neat grid — natural aspect, no crop / no zoom */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {shown.map((item) => (
          <article key={item.id} className="bg-cream">
            <button
              type="button"
              onClick={() => openAt(item.id)}
              onContextMenu={blockImageTheft}
              className="group relative block w-full cursor-zoom-in text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
              aria-label={`View ${item.title}`}
            >
              <Image
                src={item.thumb || item.image}
                alt={item.title}
                width={Math.min(item.width || 1600, 1600)}
                height={Math.round(
                  (Math.min(item.width || 1600, 1600) * (item.height || 1067)) /
                    (item.width || 1600),
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                loading="lazy"
                quality={80}
                draggable={false}
                onContextMenu={blockImageTheft}
                onDragStart={blockImageTheft}
                className="pointer-events-none h-auto w-full select-none object-contain transition-opacity duration-500 group-hover:opacity-90"
                style={{ WebkitUserDrag: "none", userSelect: "none" }}
              />
              {/* Blocks right-click “Open image in new tab” / save */}
              <span
                className="absolute inset-0"
                aria-hidden="true"
                onContextMenu={blockImageTheft}
              />
            </button>
          </article>
        ))}
      </div>

      {hasMore ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
            className="border border-forest-deep/25 px-8 py-3.5 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-forest-deep transition-colors duration-500 hover:border-forest-deep hover:bg-forest-deep hover:text-ivory"
          >
            Load More
          </button>
        </div>
      ) : null}

      <GalleryLightbox
        items={galleryItems}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  );
}
