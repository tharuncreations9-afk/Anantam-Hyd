"use client";

import { useCallback, useRef } from "react";

const SWIPE_MIN = 40;

/**
 * Touch + mouse drag swipe handlers for carousels.
 * Swipe left → next, swipe right → previous.
 */
export default function useSwipe({ onNext, onPrev, enabled = true }) {
  const startX = useRef(null);
  const startY = useRef(null);
  const tracking = useRef(false);

  const begin = useCallback(
    (clientX, clientY) => {
      if (!enabled) return;
      startX.current = clientX;
      startY.current = clientY;
      tracking.current = true;
    },
    [enabled],
  );

  const finish = useCallback(
    (clientX, clientY) => {
      if (!tracking.current || startX.current == null) return;
      const dx = clientX - startX.current;
      const dy = clientY - (startY.current ?? clientY);
      tracking.current = false;
      startX.current = null;
      startY.current = null;

      // Prefer horizontal swipes; ignore mostly-vertical scrolls
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onNext?.();
      else onPrev?.();
    },
    [onNext, onPrev],
  );

  const cancel = useCallback(() => {
    tracking.current = false;
    startX.current = null;
    startY.current = null;
  }, []);

  return {
    onTouchStart: (event) => {
      const touch = event.touches[0];
      if (touch) begin(touch.clientX, touch.clientY);
    },
    onTouchEnd: (event) => {
      const touch = event.changedTouches[0];
      if (touch) finish(touch.clientX, touch.clientY);
    },
    onTouchCancel: cancel,
    onMouseDown: (event) => {
      if (event.button !== 0) return;
      begin(event.clientX, event.clientY);
    },
    onMouseUp: (event) => finish(event.clientX, event.clientY),
    onMouseLeave: cancel,
  };
}
