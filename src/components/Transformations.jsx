import { useEffect, useRef, useState } from 'react';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Full branded before/after graphics (≈3:2). Shown one at a time as a big
// card; scrolling through the pinned section swaps the active card.
const SLIDES = [
  { src: '/images/LIVING ROOM.png', label: 'Living Room', tag: 'Indoor', alt: 'Indoor living room — before and after transformation' },
  { src: '/images/BALCONY.png', label: 'Balcony', tag: 'Balcony', alt: 'Balcony — before and after transformation' },
  { src: '/images/TERRACE.png', label: 'Terrace', tag: 'Terrace', alt: 'Terrace — before and after transformation' },
  { src: '/images/OPEN.png', label: 'Open Terrace', tag: 'Open Air', alt: 'Open terrace — before and after transformation' },
];

// Decorative swaying leaf for the right rail.
function Leaf({ id, size, top, rotate, dur, delay, opacity }) {
  return (
    <svg
      className="xform__leaf"
      width={size}
      viewBox="0 0 120 170"
      style={{ top, opacity, '--rot': `${rotate}deg`, '--lf-dur': `${dur}s`, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`xl-${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#5fa24a" />
          <stop offset="1" stopColor="#1c4a26" />
        </linearGradient>
      </defs>
      <path d="M60 4 C104 34 116 108 60 166 C4 108 16 34 60 4 Z" fill={`url(#xl-${id})`} />
      <path d="M60 12 L60 158" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    </svg>
  );
}

export default function Transformations() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const span = el.offsetHeight - window.innerHeight;
        const p = clamp(-rect.top / (span || 1), 0, 0.9999);
        const idx = Math.floor(p * SLIDES.length);
        setActive((prev) => (prev === idx ? prev : idx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} id="transformations" className="xform">
      <span className="xform__orb xform__orb--a" aria-hidden="true" />
      <span className="xform__orb xform__orb--b" aria-hidden="true" />

      <div className="xform__sticky">
        <div className="xform__head">
          <span className="xform__eyebrow font-body">Before · After</span>
          <h2 className="xform__title font-display">Real Spaces, Reimagined</h2>
          <p className="xform__subtitle font-body">
            Scroll through four real MyGreenHome makeovers — the same space, reborn in green.
          </p>
        </div>

        {/* Left — animated navigator */}
        <div className="xform__rail xform__rail--left" aria-hidden="true">
          <div className="xform__count font-display">
            <span className="xform__count-now" key={active}>
              {String(active + 1).padStart(2, '0')}
            </span>
            <span className="xform__count-total">/ {String(SLIDES.length).padStart(2, '0')}</span>
          </div>
          <ul className="xform__steps">
            {SLIDES.map((s, i) => (
              <li key={s.src} className={`xform__step font-body${i === active ? ' is-active' : ''}`}>
                <span className="xform__step-dot" />
                <span className="xform__step-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Center — the swapping card */}
        <div className="xform__stage">
          {SLIDES.map((s, i) => (
            <figure
              key={s.src}
              className="xform__card"
              aria-hidden={i !== active}
              style={{
                opacity: i === active ? 1 : 0,
                transform:
                  i === active
                    ? 'translateY(0) scale(1)'
                    : `translateY(${i < active ? -22 : 22}px) scale(0.97)`,
              }}
            >
              <img src={s.src} alt={s.alt} loading="lazy" />
            </figure>
          ))}
        </div>

        {/* Right — decorative foliage rail */}
        <div className="xform__rail xform__rail--right" aria-hidden="true">
          <span className="xform__vert font-body">Before&nbsp;→&nbsp;After</span>
          <div className="xform__foliage">
            <Leaf id="1" size={84} top="6%" rotate={150} dur={7} delay={0} opacity={0.85} />
            <Leaf id="2" size={64} top="40%" rotate={-150} dur={9} delay={-2} opacity={0.6} />
            <Leaf id="3" size={96} top="68%" rotate={168} dur={8} delay={-4} opacity={0.75} />
          </div>
        </div>

        {/* Compact caption + step navigator — fills the tablet/phone layout where
            the side rails are hidden (otherwise it's a lone card in dead space). */}
        <div className="xform__meta">
          <div className="xform__meta-info">
            <span className="xform__meta-tag font-body">{SLIDES[active].tag}</span>
            <span className="xform__meta-label font-display" key={active}>
              {SLIDES[active].label}
            </span>
          </div>
          <span className="xform__meta-count font-display">
            <b key={active}>{String(active + 1).padStart(2, '0')}</b>
            <i>/ {String(SLIDES.length).padStart(2, '0')}</i>
          </span>
        </div>
        <ul className="xform__chips" aria-hidden="true">
          {SLIDES.map((s, i) => (
            <li key={s.src} className={`xform__chip font-body${i === active ? ' is-active' : ''}`}>
              {s.label}
            </li>
          ))}
        </ul>

        <div className="xform__dots" role="tablist" aria-label="Transformation slides">
          {SLIDES.map((s, i) => (
            <span key={s.src} className={`xform__dot${i === active ? ' is-active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
