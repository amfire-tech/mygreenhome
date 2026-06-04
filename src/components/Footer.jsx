import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { EMAIL, WEBSITE, PHONE_DISPLAY, PHONE_TEL } from '../constants/pricing';

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
  { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
];

const PROMISE = ['Premium Quality', 'Expert Care', 'Lasting Greenery'];

export default function Footer() {
  return (
    <footer style={{ background: '#040906', color: 'var(--c-cream)', borderTop: '1px solid rgba(245,240,232,0.08)' }}>
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: 'clamp(56px,8vh,84px) 40px 40px',
          display: 'grid',
          gap: 48,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        {/* Brand */}
        <div>
          <img
            src="/logo.png"
            alt="MyGreenHome"
            style={{ height: 44, width: 'auto', display: 'block' }}
          />
          <p
            className="font-body uppercase"
            style={{ fontSize: 10, letterSpacing: '0.22em', color: 'rgba(245,240,232,0.55)', marginTop: 10 }}
          >
            Smart Gardens. Healthy Homes.
          </p>
          <p className="font-body" style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(245,240,232,0.5)', marginTop: 16, maxWidth: 280 }}>
            Because every home deserves a touch of nature — and a lifetime of joy.
          </p>
        </div>

        {/* Promise */}
        <div>
          <h4 className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--c-gold-light)', marginBottom: 16 }}>
            Our Promise
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROMISE.map((p) => (
              <li key={p} className="font-body" style={{ fontSize: 13.5, color: 'rgba(245,240,232,0.72)' }}>
                {p}
              </li>
            ))}
            <li className="font-script" style={{ fontSize: 22, color: 'var(--c-gold-light)' }}>Always.</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--c-gold-light)', marginBottom: 16 }}>
            Get in Touch
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={PHONE_TEL} className="font-body" style={{ fontSize: 13.5, color: 'rgba(245,240,232,0.72)' }}>
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="font-body" style={{ fontSize: 13.5, color: 'rgba(245,240,232,0.72)' }}>
              {EMAIL}
            </a>
            <a href={`https://${WEBSITE}`} target="_blank" rel="noopener noreferrer" className="font-body" style={{ fontSize: 13.5, color: 'rgba(245,240,232,0.72)' }}>
              {WEBSITE}
            </a>
          </div>
          <div className="flex items-center" style={{ gap: 14, marginTop: 20 }}>
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-magnetic
                style={{ color: 'rgba(245,240,232,0.6)', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e8c98e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,240,232,0.6)')}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="font-body"
        style={{
          borderTop: '1px solid rgba(245,240,232,0.1)',
          padding: '20px 40px',
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(245,240,232,0.4)',
        }}
      >
        © {new Date().getFullYear()} MyGreenHome · Designed by nature. Perfected for your home.
      </div>
    </footer>
  );
}
