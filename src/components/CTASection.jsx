import { MessageCircle, Phone } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { WHATSAPP_URL, PHONE_TEL, PHONE_DISPLAY } from '../constants/pricing';

// Emotional close (Act II, ivory). id="contact" is the nav/vine jump target.
export default function CTASection() {
  const [ref, inView] = useInView(0.2);

  const reveal = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(40px)',
    transition: 'opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth)',
    transitionDelay: `${delay}s`,
  });

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        textAlign: 'center',
        padding: 'clamp(80px,12vh,120px) 40px',
        borderTop: '1px solid rgba(245,240,232,0.1)',
      }}
    >
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontSize: 42, lineHeight: 1, ...reveal(0) }}>🌿</div>

        <h2 className="font-display" style={{ fontWeight: 700, lineHeight: 1.04, marginTop: 16, ...reveal(0.12) }}>
          <span className="block" style={{ fontSize: 'clamp(34px, 4.4vw, 60px)', color: '#f5f0e8' }}>
            Build Your
          </span>
          <span
            className="font-script block"
            style={{ fontSize: 'clamp(42px, 5vw, 76px)', color: 'var(--c-gold-light)', lineHeight: 1.15 }}
          >
            Green Home Today
          </span>
        </h2>

        <p
          className="font-body"
          style={{
            fontWeight: 300,
            fontSize: 15.5,
            lineHeight: 1.8,
            color: 'rgba(245,240,232,0.6)',
            maxWidth: 430,
            margin: '20px auto 0',
            ...reveal(0.24),
          }}
        >
          Together, let's create homes that breathe, spaces that heal, and lifestyles that flourish.
        </p>

        <div className="flex flex-wrap items-center justify-center" style={{ gap: 16, marginTop: 38, ...reveal(0.36) }}>
          <button
            type="button"
            data-magnetic
            onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener')}
            className="font-body flex items-center"
            style={{
              gap: 10,
              padding: '15px 30px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: '#1f9d57',
              boxShadow: '0 14px 32px rgba(31,157,87,0.28)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 44px rgba(31,157,87,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 14px 32px rgba(31,157,87,0.28)';
            }}
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </button>

          <button
            type="button"
            data-magnetic
            onClick={() => {
              window.location.href = PHONE_TEL;
            }}
            className="font-body flex items-center"
            style={{
              gap: 10,
              padding: '15px 30px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 500,
              color: '#f5f0e8',
              background: 'transparent',
              border: '1px solid rgba(245,240,232,0.3)',
              transition: 'background 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(245,240,232,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(245,240,232,0.3)';
            }}
          >
            <Phone size={16} />
            {PHONE_DISPLAY}
          </button>
        </div>
      </div>
    </section>
  );
}
