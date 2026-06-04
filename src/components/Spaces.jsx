import { useInView } from '../hooks/useInView';

const ZONES = [
  { zone: 'Outdoor', title: 'Green Spaces, Better Places', img: '/images/spaces/outdoor.jpg' },
  { zone: 'Indoor', title: 'Bring Nature Inside', img: '/images/spaces/indoor.jpg' },
  { zone: 'Balcony', title: 'Your Perfect Green Corner', img: '/images/spaces/balcony.jpg' },
  { zone: 'Terrace', title: 'Live Above the Ordinary', img: '/images/spaces/terrace.jpg' },
];

export default function Spaces() {
  const [ref, inView] = useInView(0.12);

  return (
    <section id="spaces" ref={ref} style={{ padding: 'clamp(80px,11vh,120px) clamp(24px,5vw,60px)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p
            className="font-body uppercase"
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              color: 'var(--c-brass)',
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.7s ease',
            }}
          >
            Spaces We Transform
          </p>
          <h2
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(32px,4.4vw,60px)',
              lineHeight: 1.06,
              color: 'var(--c-green-forest)',
              marginTop: 12,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            Every corner, <span className="font-script" style={{ color: 'var(--c-brass)', fontSize: '1.12em' }}>a sanctuary.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {ZONES.map((z, i) => (
            <article
              key={z.zone}
              data-cursor
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                borderRadius: 22,
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(48px)',
                transition: `opacity 0.8s var(--ease-smooth) ${i * 0.12}s, transform 0.8s var(--ease-smooth) ${i * 0.12}s`,
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.07)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={z.img}
                alt={z.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s var(--ease-smooth)' }}
              />
              <span
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(8,24,14,0.78) 100%)' }}
              />
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: 20 }}>
                <span className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--c-gold-light)' }}>
                  {z.zone}
                </span>
                <h3 className="font-display" style={{ fontWeight: 600, fontSize: 24, lineHeight: 1.15, color: 'var(--c-cream)', marginTop: 4 }}>
                  {z.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
