import { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, Check } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { WHATSAPP_URL, PHONE_TEL, PHONE_DISPLAY, EMAIL } from '../constants/pricing';

const SPACES = ['Living Room', 'Balcony', 'Terrace / Rooftop', 'Full Home', 'Office / Corporate', 'Other'];

// Contact & Booking. The form composes a complete enquiry and sends it through
// WhatsApp (reliable for a static site) with an email fallback. For true
// server-side email notifications, point `submit` at a form endpoint later.
export default function ContactSection() {
  const [ref, inView] = useInView(0.15);
  const [form, setForm] = useState({ name: '', phone: '', email: '', space: SPACES[0], message: '' });
  const [sent, setSent] = useState(false);

  const reveal = (d = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(34px)',
    transition: 'opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth)',
    transitionDelay: `${d}s`,
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    const text = [
      `Hi MyGreenHome! I'd like to enquire about a green setup.`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Space: ${form.space}`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" ref={ref} className="contact">
      <div className="contact__grid">
        {/* Left — invitation + quick contact */}
        <div className="contact__intro">
          <div style={{ fontSize: 40, lineHeight: 1, ...reveal(0) }}>🌿</div>
          <h2 className="contact__title font-display" style={reveal(0.1)}>
            Build Your{' '}
            <span className="font-script" style={{ color: 'var(--c-gold-light)', fontSize: '1.12em' }}>
              Green Home
            </span>{' '}
            Today
          </h2>
          <p className="contact__sub font-body" style={reveal(0.2)}>
            Tell us about your space and we'll craft a plan that breathes life into it. Quick reply,
            zero pressure.
          </p>

          <div className="contact__quick" style={reveal(0.3)}>
            <button type="button" className="contact__chip font-body" onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener')}>
              <MessageCircle size={16} /> WhatsApp Us
            </button>
            <a href={PHONE_TEL} className="contact__chip contact__chip--ghost font-body">
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="contact__chip contact__chip--ghost font-body">
              <Mail size={16} /> {EMAIL}
            </a>
          </div>
        </div>

        {/* Right — enquiry form */}
        <form className="contact__form" style={reveal(0.24)} onSubmit={submit}>
          <div className="contact__row">
            <label className="contact__field">
              <span>Name *</span>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="Your name" />
            </label>
            <label className="contact__field">
              <span>Phone *</span>
              <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+91 …" />
            </label>
          </div>
          <div className="contact__row">
            <label className="contact__field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
            </label>
            <label className="contact__field">
              <span>Space</span>
              <select value={form.space} onChange={set('space')}>
                {SPACES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="contact__field">
            <span>Message</span>
            <textarea rows={3} value={form.message} onChange={set('message')} placeholder="Tell us a little about your space…" />
          </label>

          <button type="submit" className="contact__submit font-body" data-magnetic>
            {sent ? (
              <>
                <Check size={17} /> Opening WhatsApp…
              </>
            ) : (
              <>
                <Send size={16} /> Send Enquiry
              </>
            )}
          </button>
          <p className="contact__note font-body">We typically reply within a few hours.</p>
        </form>
      </div>
    </section>
  );
}
