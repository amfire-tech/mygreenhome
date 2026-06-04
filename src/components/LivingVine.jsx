import { useEffect, useRef, useState } from 'react';

// A vine that "grows" down the left edge as you scroll (fill via the
// --page-progress CSS var set by App). Leaf nodes mark the journey's chapters
// and the Act II sections; click a leaf to travel there. Desktop only.
const NODES = [
  { label: 'Home', kind: 'stage', frac: 0 },
  { label: 'Outdoor', kind: 'stage', frac: 0.18 },
  { label: 'Indoor', kind: 'stage', frac: 0.36 },
  { label: 'Balcony', kind: 'stage', frac: 0.54 },
  { label: 'Terrace', kind: 'stage', frac: 0.7 },
  { label: 'Smart', kind: 'stage', frac: 0.88 },
  { label: 'Why', kind: 'id', id: 'why' },
  { label: 'Spaces', kind: 'id', id: 'spaces' },
  { label: 'Plants', kind: 'id', id: 'plants' },
  { label: 'Plans', kind: 'id', id: 'pricing' },
  { label: 'Contact', kind: 'id', id: 'contact' },
];

export default function LivingVine({ lenisRef }) {
  const [positions, setPositions] = useState(() => NODES.map((_, i) => i / (NODES.length - 1)));
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Measure each node's position as a fraction of total page scroll.
  useEffect(() => {
    const measure = () => {
      const stage = document.querySelector('.scroll-stage');
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const stageMax = stage ? stage.offsetHeight - window.innerHeight : 0;
      const next = NODES.map((n) => {
        let y = 0;
        if (n.kind === 'stage') y = n.frac * stageMax;
        else {
          const el = document.getElementById(n.id);
          // Absolute document position (offsetTop is unreliable under positioned ancestors).
          y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        }
        return Math.max(0, Math.min(1, y / totalScroll));
      });
      setPositions(next);
    };
    measure();
    const t = setTimeout(measure, 600);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Track active node from live scroll progress.
  useEffect(() => {
    let raf = null;
    const tick = () => {
      const lenis = lenisRef?.current;
      const p = lenis && lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
      let idx = 0;
      for (let i = 0; i < positions.length; i++) {
        if (p >= positions[i] - 0.02) idx = i;
      }
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [positions, lenisRef]);

  const go = (node) => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    if (node.kind === 'id') {
      lenis.scrollTo(`#${node.id}`, { duration: 1.6 });
    } else {
      const stage = document.querySelector('.scroll-stage');
      const stageMax = stage ? stage.offsetHeight - window.innerHeight : 0;
      lenis.scrollTo(node.frac * stageMax, { duration: 1.6 });
    }
  };

  return (
    <div className="vine" aria-hidden="false">
      <span className="vine__track" />
      <span className="vine__grow" />
      {NODES.map((n, i) => (
        <button
          key={n.label}
          type="button"
          className={`vine__node${i === active ? ' is-active' : ''}`}
          style={{ top: `calc(12vh + ${positions[i]} * 76vh)` }}
          onClick={() => go(n)}
          aria-label={`Go to ${n.label}`}
        >
          <span className="vine__leaf" />
          <span className="vine__label">{n.label}</span>
        </button>
      ))}
    </div>
  );
}
