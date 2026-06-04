import { useEffect, useRef, useState } from 'react';

// Counts from 0 → target over `duration` ms once `start` becomes true.
// Respects prefers-reduced-motion (snaps to target).
export function useCountUp(target, start, duration = 1600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(target * ease(p));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, start, duration]);

  return value;
}
