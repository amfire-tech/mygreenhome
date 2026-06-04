import { useState } from 'react';
import { WHATSAPP_URL } from '../constants/pricing';

// Individual plant card: dark glassmorphic, 3D tilt on hover, staggered entrance.
//
// Nested structure keeps the two animations independent:
//   outer  → entrance (opacity + translateY), gated by `visible`
//   inner  → hover tilt + glow
export default function PlantCard({ card, index, visible }) {
  const [hover, setHover] = useState(false);
  const accent = card.accent;

  const tilt = hover
    ? 'perspective(800px) rotateY(-9deg) rotateX(6deg) translateY(-6px) scale(1.05)'
    : 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.65s var(--ease-smooth), transform 0.65s var(--ease-smooth)',
        transitionDelay: `${index * 0.12}s`,
        willChange: 'transform, opacity',
      }}
    >
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener')}
        className="text-left plant-card"
        style={{
          position: 'relative',
          flexShrink: 0,
          borderRadius: 18,
          padding: '18px 16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, rgba(12,24,16,0.72), rgba(4,10,7,0.86))',
          border: hover ? '1px solid rgba(200,169,110,0.55)' : '1px solid rgba(245,240,232,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: hover
            ? `0 26px 56px rgba(0,0,0,0.55), 0 0 0 1px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.06)`
            : '0 12px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
          transform: tilt,
          transition:
            'transform 0.4s var(--ease-bounce), border-color 0.35s ease, box-shadow 0.35s ease',
          cursor: 'pointer',
        }}
      >
        {/* Accent corner glow */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}55, transparent 70%)`,
            opacity: hover ? 1 : 0.5,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Emoji chip */}
        <span
          style={{
            position: 'relative',
            width: 40,
            height: 40,
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            background: `${accent}26`,
            border: `1px solid ${accent}59`,
          }}
        >
          {card.emoji}
        </span>

        <h3
          className="font-display text-cream"
          style={{ fontWeight: 600, fontSize: 16, marginTop: 12, lineHeight: 1.1 }}
        >
          {card.name}
        </h3>
        <p
          className="font-body"
          style={{
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 9,
            color: 'rgba(245,240,232,0.4)',
            marginTop: 2,
          }}
        >
          {card.scientific}
        </p>

        <span
          className="font-body uppercase"
          style={{
            alignSelf: 'flex-start',
            marginTop: 11,
            padding: '3px 9px',
            borderRadius: 6,
            fontSize: 8.5,
            letterSpacing: '0.1em',
            color: '#e8c98e',
            background: 'rgba(200,169,110,0.12)',
            border: '1px solid rgba(200,169,110,0.28)',
          }}
        >
          {card.tag}
        </span>

        <p
          className="font-body"
          style={{
            fontSize: 10,
            color: 'rgba(245,240,232,0.42)',
            marginTop: 'auto',
            paddingTop: 10,
            lineHeight: 1.35,
          }}
        >
          {card.fact}
        </p>

        <span
          className="font-body uppercase flex items-center"
          style={{
            gap: 5,
            fontSize: 8.5,
            letterSpacing: '0.14em',
            color: hover ? '#e8c98e' : 'rgba(245,240,232,0.5)',
            marginTop: 9,
            transition: 'color 0.3s ease',
          }}
        >
          View Details
          <span style={{ transform: hover ? 'translateX(3px)' : 'none', transition: 'transform 0.3s ease' }}>
            →
          </span>
        </span>
      </button>
    </div>
  );
}
