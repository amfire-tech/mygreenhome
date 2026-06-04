// Tracks the pointer position normalized to [-1, 1] on each axis.
//
// `targetRef`  = raw normalized pointer position (updated on pointermove).
// `smoothRef`  = lerped value — App.jsx's rAF loop eases smoothRef toward
//                targetRef so every parallax layer reads one smoothed value.
//
// Touch devices have no hover pointer, so parallax simply stays centered (0,0).

import { useEffect, useRef } from 'react';

export function useMouseParallax() {
  const targetRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return { targetRef, smoothRef };
}
