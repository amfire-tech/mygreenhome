import { Wind, Heart, Cpu, TrendingUp } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const PILLARS = [
  { Icon: Wind, title: 'Cleaner Air', body: 'Living plants purify the air and remove toxins — a measurably healthier home.' },
  { Icon: Heart, title: 'Calmer Mind', body: 'Greenery lowers stress and lifts mood, creating spaces that genuinely heal.' },
  { Icon: Cpu, title: 'Smarter Care', body: 'Neobot monitors, waters and cares for your garden 24/7 — effortlessly.' },
  { Icon: TrendingUp, title: 'Lasting Value', body: "Beautiful, living spaces that elevate your home's character and its worth." },
];

export default function WhyGreenHome() {
  const [ref, inView] = useInView(0.15);
  const reveal = (d = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(34px)',
    transition: 'opacity 0.8s var(--ease-smooth), transform 0.8s var(--ease-smooth)',
    transitionDelay: `${d}s`,
  });

  return (
    <section id="why" ref={ref} className="why">
      <span className="why__orb" aria-hidden="true" />
      <div className="why__inner">
        <div className="why__head">
          <p className="why__eyebrow font-body" style={reveal(0)}>
            Why MyGreenHome
          </p>
          <h2 className="why__title font-display" style={reveal(0.08)}>
            More than plants — <span className="font-script why__script">a way to live.</span>
          </h2>
          <p className="why__sub font-body" style={reveal(0.16)}>
            We design, install and maintain living green spaces that make your home healthier,
            calmer and more beautiful — powered by smart technology and expert care.
          </p>
        </div>

        <div className="why__grid">
          {PILLARS.map(({ Icon, title, body }, i) => (
            <div key={title} className="why-card-wrap" style={reveal(0.1 + i * 0.1)}>
              <div className="why-card">
                <span className="why-card__icon">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <h3 className="why-card__title font-display">{title}</h3>
                <p className="why-card__body font-body">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
