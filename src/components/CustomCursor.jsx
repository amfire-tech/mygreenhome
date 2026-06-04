import { useEffect, useRef } from 'react';
import { lerp } from '../utils/math';

// Soft gold ring + dot that trails the pointer, grows over interactive
// elements, and gently pulls [data-magnetic] elements toward the cursor.
// Desktop pointer devices only; no-ops on touch.
export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.documentElement.classList.add('has-custom-cursor');

    const ring = ringRef.current;
    const dot = dotRef.current;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let magnetEl = null;
    let raf = null;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot) dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

      // Magnetic pull
      const m = e.target.closest?.('[data-magnetic]');
      if (m !== magnetEl) {
        if (magnetEl) magnetEl.style.transform = '';
        magnetEl = m;
      }
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        magnetEl.style.transform = `translate(${mx * 0.28}px, ${my * 0.28}px)`;
      }
    };

    const onOver = (e) => {
      if (e.target.closest?.('a, button, [data-cursor], [data-magnetic]')) {
        ring?.classList.add('is-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest?.('a, button, [data-cursor], [data-magnetic]')) {
        ring?.classList.remove('is-hover');
      }
    };

    const tick = () => {
      ringPos.x = lerp(ringPos.x, target.x, reduced ? 1 : 0.18);
      ringPos.y = lerp(ringPos.y, target.y, reduced ? 1 : 0.18);
      if (ring) ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      if (raf) cancelAnimationFrame(raf);
      if (magnetEl) magnetEl.style.transform = '';
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="mgh-cursor mgh-cursor__ring" aria-hidden="true" />
      <div ref={dotRef} className="mgh-cursor mgh-cursor__dot" aria-hidden="true" />
    </>
  );
}
