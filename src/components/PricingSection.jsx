import { useState } from 'react';
import { PRICING_PLANS } from '../constants/pricing';
import { useInView } from '../hooks/useInView';
import PricingCard from './PricingCard';

export default function PricingSection() {
  const [ref, inView] = useInView(0.08);
  const [tier, setTier] = useState('lite');

  const reveal = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.7s var(--ease-smooth), transform 0.7s var(--ease-smooth)',
    transitionDelay: `${delay}s`,
  });

  return (
    <section
      id="pricing"
      ref={ref}
      style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(80px,12vh,130px) 40px 130px' }}
    >
      {/* Header */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 56 }}>
        <p
          className="font-body uppercase"
          style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--c-gold-light)', ...reveal(0) }}
        >
          Our Green Series
        </p>
        <h2 className="font-display" style={{ fontWeight: 700, lineHeight: 1.05, marginTop: 14, ...reveal(0.08) }}>
          <span className="block" style={{ fontSize: 'clamp(34px, 4.6vw, 64px)', color: '#f5f0e8' }}>
            Choose Your Green
          </span>
          <span
            className="font-script block"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--c-gold-light)', lineHeight: 1.1 }}
          >
            Living Experience
          </span>
        </h2>
        <p
          className="font-body"
          style={{
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(245,240,232,0.6)',
            maxWidth: 520,
            margin: '18px auto 0',
            ...reveal(0.16),
          }}
        >
          Three curated series for every home and space — each powered by Neobot smart technology,
          expert care, and nature's finest.
        </p>

        {/* Lite / Elite toggle */}
        <div
          className="inline-flex"
          style={{
            marginTop: 28,
            padding: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(245,240,232,0.15)',
            ...reveal(0.24),
          }}
        >
          {['lite', 'elite'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className="font-body uppercase"
              style={{
                padding: '9px 22px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: tier === t ? '#0a160e' : 'rgba(245,240,232,0.6)',
                background: tier === t ? 'var(--c-gold-light)' : 'transparent',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 26,
          justifyContent: 'center',
          alignItems: 'flex-end',
          maxWidth: 1080,
          margin: '0 auto',
        }}
      >
        {PRICING_PLANS.map((plan, i) => (
          <PricingCard key={plan.id} plan={plan} index={i} inView={inView} tier={tier} />
        ))}
      </div>

      <p
        className="font-body"
        style={{
          position: 'relative',
          textAlign: 'center',
          fontSize: 12.5,
          fontWeight: 300,
          color: 'rgba(245,240,232,0.45)',
          marginTop: 56,
          ...reveal(0.5),
        }}
      >
        All plans include Neobot smart technology, expert setup &amp; regular maintenance.
      </p>
    </section>
  );
}
