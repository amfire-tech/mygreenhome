import { useEffect, useRef, useState } from 'react';
import { Play, ArrowRight, Leaf, Users, ShieldCheck, Sprout } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

const STATS = [
  { icon: Leaf, value: '100+', label: 'Plants Curated' },
  { icon: Users, value: '50+', label: 'Happy Clients' },
  { icon: ShieldCheck, value: '', label: 'Years of Trust' },
  { icon: Sprout, value: '100%', label: 'Sustainable' },
];

export default function HeroIntro({ onTour, mouseRef }) {
  const sectionRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  // Feed smoothed mouse position into CSS vars for the slow background parallax.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = null;
    const tick = () => {
      const el = sectionRef.current;
      const m = mouseRef?.current;
      if (el && m) {
        el.style.setProperty('--hx', m.x.toFixed(3));
        el.style.setProperty('--hy', m.y.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);

  const reveal = (d) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(26px)',
    transition: 'opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth)',
    transitionDelay: `${d}ms`,
  });

  return (
    <section id="hero" ref={sectionRef} className="hero-intro">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-scrim" aria-hidden="true" />
      <ParticleCanvas mouseRef={mouseRef} bright />

      <div className="hero-content">
        <h1 className="font-display text-cream" style={{ fontWeight: 700, lineHeight: 1.0 }}>
          <span className="block" style={{ fontSize: 'clamp(38px, 5.2vw, 78px)', ...reveal(220) }}>
            Don't Just Add Plants.
          </span>
          <span className="block" style={{ fontSize: 'clamp(38px, 5.2vw, 78px)', color: '#7ec24f', ...reveal(380) }}>
            Transform Your Lifestyle.
          </span>
        </h1>

        <p
          className="font-body"
          style={{ fontWeight: 300, fontSize: 'clamp(15px,1.4vw,17px)', color: 'rgba(245,240,232,0.78)', marginTop: 24, maxWidth: 440, lineHeight: 1.75, ...reveal(660) }}
        >
          We design and maintain smart green spaces that purify your air, elevate wellbeing, and add
          lasting value to your home.
        </p>

        <div className="flex flex-wrap items-center" style={{ gap: 20, marginTop: 36, ...reveal(800) }}>
          <button
            type="button"
            data-magnetic
            onClick={onTour}
            className="font-body uppercase flex items-center"
            style={{ gap: 10, padding: '16px 30px', borderRadius: 50, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', color: '#fff', background: 'var(--c-green-forest)', boxShadow: '0 18px 38px rgba(20,54,31,0.4)' }}
          >
            Explore Solutions <ArrowRight size={16} />
          </button>
          <button
            type="button"
            data-magnetic
            onClick={onTour}
            className="font-body flex items-center text-cream"
            style={{ gap: 12, fontSize: 14, fontWeight: 500 }}
          >
            <span style={{ width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(245,240,232,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={15} fill="currentColor" />
            </span>
            Watch the Home Tour
          </button>
        </div>

        <div className="hero-stats" style={reveal(960)}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="hero-stat">
              <span className="hero-stat__icon">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <span>
                {value && (
                  <span className="font-display block text-cream" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                    {value}
                  </span>
                )}
                <span className="font-body block" style={{ fontSize: 12, color: 'rgba(245,240,232,0.62)', marginTop: value ? 3 : 0 }}>
                  {label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
