import { useState } from 'react';
import { Check } from 'lucide-react';
import { WHATSAPP_URL } from '../constants/pricing';

// Ivory editorial pricing card (Act II). `tier` ('lite' | 'elite') switches the
// price for the two BHK series; Saundaryavan stays Custom.
export default function PricingCard({ plan, index, inView, tier }) {
  const [hover, setHover] = useState(false);
  const featured = !!plan.highlighted;
  const isCustom = plan.startingFrom === 'Custom';

  const price = isCustom
    ? 'Custom'
    : tier === 'elite'
    ? plan.elitePriceLabel
    : plan.litePriceLabel;
  const forLabel = isCustom ? plan.target : tier === 'elite' ? plan.eliteFor : plan.liteFor;

  const hoverTransform = hover
    ? featured
      ? 'translateY(-16px)'
      : 'translateY(-12px)'
    : 'translateY(0)';

  return (
    <div
      style={{
        position: 'relative',
        flex: featured ? '0 0 340px' : '0 0 300px',
        maxWidth: '100%',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(56px)',
        transition: 'opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth)',
        transitionDelay: `${index * 0.14}s`,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          borderRadius: 22,
          overflow: 'hidden',
          padding: featured ? '40px 32px' : '32px 28px',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          background: featured
            ? 'linear-gradient(165deg, rgba(62,50,24,0.62) 0%, rgba(20,16,8,0.55) 100%)'
            : 'linear-gradient(152deg, rgba(28,54,38,0.55), rgba(9,18,12,0.5))',
          border: featured
            ? '1px solid rgba(200,169,110,0.6)'
            : '1px solid rgba(245,240,232,0.12)',
          boxShadow: hover
            ? featured
              ? '0 46px 90px rgba(0,0,0,0.55), 0 16px 50px rgba(200,169,110,0.22)'
              : '0 44px 80px rgba(0,0,0,0.5), 0 16px 50px rgba(74,124,89,0.25)'
            : '0 24px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          transform: hoverTransform,
          transition: 'transform 0.45s var(--ease-smooth), box-shadow 0.45s ease',
        }}
      >
        {plan.badge && (
          <div
            className="font-body uppercase"
            style={{
              position: 'absolute',
              top: 22,
              right: 22,
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#fff',
              background: 'linear-gradient(135deg, #b8893f, #d8b56a)',
            }}
          >
            {plan.badge}
          </div>
        )}

        {/* Series name */}
        <h3
          className="font-display"
          style={{ fontWeight: 700, fontSize: featured ? 38 : 33, lineHeight: 1, color: '#f5f0e8' }}
        >
          {plan.name}
        </h3>
        <span className="font-script" style={{ fontSize: 30, color: 'var(--c-gold-light)', lineHeight: 1 }}>
          {plan.series}
        </span>

        {/* Target / tier */}
        <div
          className="font-body uppercase"
          style={{
            display: 'inline-block',
            marginTop: 16,
            padding: '5px 13px',
            borderRadius: 999,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#8fd29a',
            background: 'rgba(74,124,89,0.18)',
            border: '1px solid rgba(74,124,89,0.4)',
          }}
        >
          {forLabel}
        </div>

        <div
          style={{
            height: 1,
            margin: '20px 0',
            background: 'linear-gradient(90deg, transparent, rgba(184,137,63,0.55) 55%, transparent)',
          }}
        />

        {/* Price */}
        <p
          className="font-body uppercase"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.45)' }}
        >
          {isCustom ? 'Pricing' : 'Starting From'}
        </p>
        <p
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: featured ? 44 : 40,
            lineHeight: 1.1,
            color: featured ? 'var(--c-gold-light)' : '#f5f0e8',
          }}
        >
          {price}
        </p>
        <p className="font-body" style={{ fontSize: 11, fontWeight: 300, color: 'rgba(245,240,232,0.45)' }}>
          {plan.priceNote}
        </p>

        {/* Features */}
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: '24px 0 30px', listStyle: 'none' }}>
          {plan.features.map((f) => (
            <li key={f} className="flex items-start" style={{ gap: 11 }}>
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: featured ? 'rgba(184,137,63,0.16)' : 'rgba(74,124,89,0.14)',
                }}
              >
                <Check size={10} color={featured ? '#b8893f' : '#3f7d3a'} strokeWidth={3} />
              </span>
              <span className="font-body" style={{ fontSize: 12.5, color: 'rgba(245,240,232,0.62)', lineHeight: 1.5 }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          data-magnetic
          onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener')}
          className="font-body uppercase"
          style={{
            width: '100%',
            padding: featured ? 15 : 13,
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: featured ? '#1a1206' : '#f5f0e8',
            background: featured ? 'linear-gradient(135deg, #b8893f, #d8b56a)' : 'transparent',
            border: featured ? 'none' : '1px solid rgba(245,240,232,0.3)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease',
          }}
          onMouseEnter={(e) => {
            if (!featured) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(200,169,110,0.6)';
            }
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={(e) => {
            if (!featured) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)';
            }
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {plan.ctaLabel} →
        </button>
      </div>
    </div>
  );
}
