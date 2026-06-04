import { forwardRef } from 'react';

// Tour intro (Scene 0 of the Home Tour). The big brand headline now lives in
// the bright hero above, so this frames the cinematic walk-through instead.
//
// The forwarded ref is the OUTER wrapper — App.jsx writes its `opacity`
// (scroll fade) and `transform` (mouse parallax). Inner lines run their own
// entrance keyed off `entered`.
const HeroText = forwardRef(function HeroText({ entered }, ref) {
  const line = (delay) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth)',
    transitionDelay: `${delay}ms`,
  });

  return (
    <div ref={ref} className="stage-text hero-text gpu">
      <p
        className="font-body uppercase text-cream/50"
        style={{ fontSize: 11, letterSpacing: '0.3em', marginBottom: 18, ...line(250) }}
      >
        The Home Tour
      </p>

      <h2 className="font-display text-cream" style={{ fontWeight: 700, lineHeight: 1.0 }}>
        <span className="block" style={{ fontSize: 'clamp(40px, 6vw, 84px)', ...line(400) }}>
          Step
        </span>
        <span
          className="font-script block"
          style={{ fontSize: 'clamp(52px, 7vw, 104px)', color: 'var(--c-gold-light)', lineHeight: 1.1, ...line(540) }}
        >
          Inside.
        </span>
      </h2>

      <p
        className="font-body"
        style={{ fontWeight: 300, fontSize: 15, marginTop: 18, maxWidth: 340, lineHeight: 1.7, color: 'rgba(245,240,232,0.6)', ...line(720) }}
      >
        Keep scrolling for a cinematic walk through your future green home — exterior to rooftop.
      </p>
    </div>
  );
});

export default HeroText;
