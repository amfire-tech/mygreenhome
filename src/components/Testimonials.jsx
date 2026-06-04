import { Star, Quote } from 'lucide-react';
import { useInView } from '../hooks/useInView';

// 5 demo testimonials — realistic Indian names, cities and project types.
const REVIEWS = [
  {
    name: 'Ananya Iyer',
    city: 'Bengaluru, Karnataka',
    project: 'Living Room Garden',
    avatar: 'AI',
    tint: '#3f7d4f',
    quote:
      'Our living room finally breathes. The air feels cleaner and the whole space looks like a magazine shoot. Guests cannot stop asking who designed it.',
  },
  {
    name: 'Rohan Mehta',
    city: 'Mumbai, Maharashtra',
    project: 'Balcony Garden',
    avatar: 'RM',
    tint: '#b8893f',
    quote:
      'My tiny Mumbai balcony became my favourite corner of the house. Morning chai surrounded by greenery — honestly the best upgrade we have done.',
  },
  {
    name: 'Priya Nair',
    city: 'Kochi, Kerala',
    project: 'Terrace Garden',
    avatar: 'PN',
    tint: '#5a8a4a',
    quote:
      'The rooftop transformation left our relatives speechless during Onam. MyGreenHome handled everything end to end — we just enjoyed the result.',
  },
  {
    name: 'Arjun Sharma',
    city: 'Gurugram, Haryana',
    project: 'Corporate Green Space',
    avatar: 'AS',
    tint: '#4a9cb8',
    quote:
      'We greened our office floor and the difference in mood and focus is real. The team genuinely feels calmer. Maintenance visits are always on time.',
  },
  {
    name: 'Sneha Reddy',
    city: 'Hyderabad, Telangana',
    project: 'Indoor + Smart Setup',
    avatar: 'SR',
    tint: '#9a7ac8',
    quote:
      'I travel constantly, so the Neobot smart care sold me. It waters and monitors everything — I come back to thriving plants every single time.',
  },
];

function Card({ r }) {
  return (
    <div className="tmonial">
      <Quote className="tmonial__mark" size={26} aria-hidden="true" />
      <div className="tmonial__stars" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="tmonial__quote font-body">{r.quote}</p>
      <div className="tmonial__person">
        <span className="tmonial__avatar font-display" style={{ background: `linear-gradient(150deg, ${r.tint}, #0c160f)` }}>
          {r.avatar}
        </span>
        <span>
          <span className="tmonial__name font-display">{r.name}</span>
          <span className="tmonial__meta font-body">
            {r.city} · <span style={{ color: 'var(--c-gold-light)' }}>{r.project}</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [ref, inView] = useInView(0.12);
  // duplicate the list so the marquee loops seamlessly
  const loop = [...REVIEWS, ...REVIEWS];

  return (
    <section ref={ref} id="testimonials" className="tmonials">
      <div className="tmonials__head" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth)' }}>
        <p className="tmonials__eyebrow font-body">Loved by Homeowners</p>
        <h2 className="tmonials__title font-display">
          Real homes. <span className="font-script" style={{ color: 'var(--c-gold-light)', fontSize: '1.1em' }}>Real joy.</span>
        </h2>
      </div>

      <div className="tmonials__viewport">
        <div className="tmonials__track">
          {loop.map((r, i) => (
            <Card key={`${r.name}-${i}`} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
