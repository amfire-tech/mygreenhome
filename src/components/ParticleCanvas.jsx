import { useEffect, useRef } from 'react';
import { rand } from '../utils/math';

const COUNT = 18;

// Floating leaf/pollen particles drifting up.
// Runs its own lightweight rAF loop (independent of App's main loop).
// `mouseRef` (optional) = smoothed mouse parallax ref { current: {x, y} }.
// `bright`  = sunlit pollen palette for the light hero (vs leaves on dark).
export default function ParticleCanvas({ mouseRef, bright = false }) {
  const COLORS = bright ? ['#ffffff', '#e8c98e', '#bfe3a0'] : ['#4a7c59', '#c8a96e'];
  const OPACITY = bright ? [0.18, 0.6] : [0.07, 0.35];
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // On phones/touch the per-frame canvas redraw isn't worth the CPU (especially
    // layered over the scroll-scrubbed video) — render a static scatter instead.
    const lite = reduced || window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const makeParticle = (atBottom = false) => ({
      x: rand(0, w),
      y: atBottom ? h + rand(0, 60) : rand(0, h),
      speedX: rand(-0.4, 0.4),
      speedY: rand(-0.8, -0.3),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.015, 0.015),
      size: rand(4, 14),
      opacity: rand(OPACITY[0], OPACITY[1]),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const particles = Array.from({ length: COUNT }, () => makeParticle(false));

    const drawLeaf = (p) => {
      const { size } = p;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.4, size * 0.7, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size * 0.7, size * 0.4, -size * 0.7, -size * 0.4, 0, -size);
      ctx.fill();
    };

    let raf = null;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      const rx = mouseRef?.current?.x ?? 0;

      for (const p of particles) {
        p.x += p.speedX + rx * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -20) Object.assign(p, makeParticle(true));
        if (p.x < -30) p.x = w + 20;
        else if (p.x > w + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        drawLeaf(p);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    if (lite) {
      // Static, very subtle scatter — no motion (reduced-motion or mobile).
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity * 0.6;
        ctx.fillStyle = p.color;
        drawLeaf(p);
        ctx.restore();
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />
  );
}
