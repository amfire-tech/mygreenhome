import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

const STATS = [
  { target: 100, suffix: '+', label: 'Plants & Climbers' },
  { target: 12, suffix: '+', label: 'Kitchen Garden Essentials' },
  { target: 3, suffix: '', label: 'Curated Green Series' },
  { target: 24, suffix: '/7', label: 'Neobot Smart Care' },
];

function Stat({ target, suffix, label, start, delay }) {
  const value = useCountUp(target, start, 1500);
  return (
    <div
      style={{
        textAlign: 'center',
        opacity: start ? 1 : 0,
        transform: start ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s var(--ease-smooth) ${delay}s, transform 0.7s var(--ease-smooth) ${delay}s`,
      }}
    >
      <div className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(44px,5vw,68px)', lineHeight: 1, color: 'var(--c-gold-light)' }}>
        {Math.round(value)}
        <span style={{ fontSize: '0.6em' }}>{suffix}</span>
      </div>
      <p className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(245,240,232,0.7)', marginTop: 10 }}>
        {label}
      </p>
    </div>
  );
}

export default function ImpactStats() {
  const [ref, inView] = useInView(0.3);
  return (
    <section
      id="impact"
      ref={ref}
      style={{ background: '#060d09', padding: 'clamp(64px,9vh,96px) clamp(24px,5vw,60px)' }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gap: 40,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        {STATS.map((s, i) => (
          <Stat key={s.label} {...s} start={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
