import { useEffect, useRef, useState } from 'react';

const STEPS = [
  { n: '01', title: 'We Design', body: 'We study your space, light and lifestyle, then craft a bespoke green design — plant by plant.', img: '/images/spaces/outdoor.jpg' },
  { n: '02', title: 'We Set Up', body: 'Our experts install everything: plants, planters, ambient lighting and the Neobot system.', img: '/images/spaces/balcony.jpg' },
  { n: '03', title: 'We Maintain', body: 'Neobot waters and monitors daily, while our gardeners visit regularly so it always thrives.', img: '/images/spaces/indoor.jpg' },
  { n: '04', title: 'You Enjoy', body: 'You simply live in it — cleaner air, calmer days, and a home that feels beautifully alive.', img: '/images/spaces/terrace.jpg' },
];

export default function ProcessSteps() {
  const [active, setActive] = useState(0);
  const sentinelsRef = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    sentinelsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" style={{ background: 'var(--c-ivory-2)' }}>
      <div style={{ position: 'relative', height: `${STEPS.length * 100}vh` }}>
        {/* Sticky stage */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1120,
              margin: '0 auto',
              padding: '0 clamp(24px,5vw,60px)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              gap: 'clamp(28px,5vw,72px)',
              alignItems: 'center',
            }}
            className="process-grid"
          >
            {/* Text side */}
            <div>
              <p className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--c-brass)' }}>
                How It Works
              </p>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(30px,3.6vw,52px)', lineHeight: 1.06, color: 'var(--c-green-forest)', marginTop: 12 }}>
                We Design. We Set Up.
                <br />
                We Maintain. <span className="font-script" style={{ color: 'var(--c-brass)', fontSize: '1.1em' }}>You Enjoy.</span>
              </h2>

              <div style={{ position: 'relative', marginTop: 'clamp(28px,4vh,48px)', minHeight: 150 }}>
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    style={{
                      position: i === 0 ? 'relative' : 'absolute',
                      inset: i === 0 ? 'auto' : 0,
                      top: 0,
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? 'translateY(0)' : 'translateY(16px)',
                      transition: 'opacity 0.5s var(--ease-smooth), transform 0.5s var(--ease-smooth)',
                      pointerEvents: active === i ? 'auto' : 'none',
                    }}
                  >
                    <div className="flex items-baseline" style={{ gap: 14 }}>
                      <span className="font-display" style={{ fontSize: 30, fontWeight: 700, color: 'var(--c-brass)' }}>{s.n}</span>
                      <h3 className="font-display" style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: 'var(--c-green-forest)' }}>{s.title}</h3>
                    </div>
                    <p className="font-body" style={{ fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: 'var(--c-ink-dim)', marginTop: 12, maxWidth: 420 }}>
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress segments */}
              <div className="flex" style={{ gap: 8, marginTop: 32 }}>
                {STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    style={{
                      height: 3,
                      flex: 1,
                      borderRadius: 3,
                      background: i <= active ? 'var(--c-brass)' : 'rgba(20,54,31,0.14)',
                      transition: 'background 0.4s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Visual side */}
            <div
              className="process-visual"
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(20,54,31,0.18)',
              }}
            >
              {STEPS.map((s, i) => (
                <img
                  key={s.n}
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: active === i ? 1 : 0,
                    transform: active === i ? 'scale(1)' : 'scale(1.08)',
                    transition: 'opacity 0.8s var(--ease-smooth), transform 1.2s var(--ease-smooth)',
                  }}
                />
              ))}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(10,30,18,0.5) 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll sentinels */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              data-index={i}
              ref={(el) => (sentinelsRef.current[i] = el)}
              style={{ height: `${100 / STEPS.length}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
