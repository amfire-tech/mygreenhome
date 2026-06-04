import { forwardRef, useEffect, useState } from 'react';
import { SMART_METRICS } from '../constants/smart';

// Neobot smart-garden dashboard — shown only in Scene 5.
//
// forwardRef → outer container (.parallax-panel). App writes parallax vars.
// Mounted only when sceneId === 5, so the slide-in entrance runs on mount.
const SmartPanel = forwardRef(function SmartPanel(_props, ref) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className="parallax-panel">
      <div
        style={{
          width: 256,
          maxWidth: '100%',
          padding: 24,
          borderRadius: 20,
          background: 'rgba(5,13,8,0.88)',
          border: '1px solid rgba(74,124,89,0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(40px)',
          transition: 'opacity 0.8s var(--ease-smooth) 0.4s, transform 0.8s var(--ease-smooth) 0.4s',
        }}
      >
        {/* Header */}
        <div className="flex items-center" style={{ gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: '#ff6b00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
              boxShadow: '0 4px 14px rgba(255,107,0,0.4)',
            }}
          >
            N
          </div>
          <div>
            <div className="font-body text-cream" style={{ fontSize: 12, fontWeight: 700 }}>
              Neobot
            </div>
            <div
              className="font-body uppercase"
              style={{ fontSize: 8, letterSpacing: '0.16em', color: 'rgba(245,240,232,0.4)' }}
            >
              Smart Garden Control
            </div>
          </div>
        </div>

        {/* Metric rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SMART_METRICS.map((m, i) => (
            <div
              key={m.label}
              className="flex items-center justify-between"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(14px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: `${0.55 + i * 0.1}s`,
              }}
            >
              <span
                className="font-body"
                style={{ fontSize: 10, color: 'rgba(245,240,232,0.55)' }}
              >
                {m.label}
              </span>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span
                  className="font-body"
                  style={{ fontSize: 16, fontWeight: 700, color: m.color }}
                >
                  {m.value}
                  {m.unit}
                </span>
                <span
                  className="font-body uppercase"
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.08em',
                    padding: '2px 6px',
                    borderRadius: 5,
                    color: m.color,
                    background: `${m.color}22`,
                  }}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-water indicator */}
        <div
          className="flex items-center"
          style={{
            gap: 8,
            marginTop: 18,
            paddingTop: 14,
            borderTop: '1px solid rgba(74,124,89,0.22)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease',
            transitionDelay: '1s',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4ab87a',
              boxShadow: '0 0 8px #4ab87a',
              animation: 'pulse 1.8s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span className="font-body" style={{ fontSize: 9.5, color: 'rgba(245,240,232,0.55)', lineHeight: 1.4 }}>
            Auto-watering active • Next: Today 6:00 AM
          </span>
        </div>
      </div>
    </div>
  );
});

export default SmartPanel;
