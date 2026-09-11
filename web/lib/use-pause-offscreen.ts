'use client';

import { type RefObject, useEffect, useRef } from 'react';

/**
 * Pauses the endless CSS loops (`animate-drift`, `animate-turn`, … in
 * globals.css) inside an element while it is off screen.
 *
 * Returns a ref for the element. While that element is out of view it carries
 * `data-offscreen`, and globals.css sets `animation-play-state: paused` on it
 * and on everything inside it. The attribute is written straight to the DOM
 * rather than kept in state, so scrolling past a section never re-renders it.
 *
 * These loops used to be Motion `repeat: Infinity` animations, which kept
 * running on blurred layers the visitor had long scrolled past.
 */
export function usePauseOffscreen<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute('data-offscreen', !entry.isIntersecting);
    });
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return ref;
}
