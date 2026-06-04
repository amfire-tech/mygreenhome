import { useInView } from '../hooks/useInView';

// The "dawn breaks" seam: dusk dark gradients up into ivory while a sunrise
// glow rises. The brand statement lands as Act II (editorial) begins.
export default function DawnStatement() {
  const [ref, inView] = useInView(0.25);

  const reveal = (d = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(34px)',
    transition: 'opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth)',
    transitionDelay: `${d}s`,
  });

  return (
    <section
      ref={ref}
      className="dawn-break"
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 24px 12vh',
      }}
    >
      <span className="dawn-break__sun" aria-hidden="true" />

      <div style={{ position: 'relative', maxWidth: 760 }}>
        <p
          className="font-body uppercase"
          style={{ fontSize: 11, letterSpacing: '0.32em', color: 'var(--c-brass)', ...reveal(0) }}
        >
          Welcome Home
        </p>

        <h2
          className="font-display"
          style={{ fontWeight: 700, lineHeight: 1.02, marginTop: 18, color: 'var(--c-green-forest)' }}
        >
          <span className="block" style={{ fontSize: 'clamp(44px, 7vw, 96px)', ...reveal(0.1) }}>
            Real Green.
          </span>
          <span
            className="block"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: 'var(--c-brass)', ...reveal(0.2) }}
          >
            Real Homes.
          </span>
        </h2>

        <p
          className="font-body"
          style={{
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            lineHeight: 1.8,
            color: 'var(--c-ink-dim)',
            maxWidth: 560,
            margin: '24px auto 0',
            ...reveal(0.3),
          }}
        >
          From cozy corners to open terraces, MyGreenHome brings nature to every space — making
          your home healthier, happier, and more beautiful.
        </p>

        <div
          style={{
            width: 64,
            height: 1,
            margin: '32px auto 0',
            background: 'linear-gradient(90deg, transparent, var(--c-brass), transparent)',
            ...reveal(0.4),
          }}
        />
      </div>
    </section>
  );
}
