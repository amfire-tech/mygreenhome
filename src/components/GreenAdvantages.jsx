import { Moon, Wind, Brain, HeartPulse, ShieldCheck, Droplets, Smile } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { ADVANTAGES } from '../constants/advantages';

const ICONS = { Moon, Wind, Brain, HeartPulse, ShieldCheck, Droplets, Smile };

function AdvCard({ item, index, inView }) {
  const Icon = ICONS[item.icon] || Wind;
  const peak = Math.max(item.normal, item.green);
  const normalPct = (item.normal / peak) * 100;
  const greenPct = (item.green / peak) * 100;
  const base = 0.12 + index * 0.08;

  return (
    <article
      className="adv-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s var(--ease-smooth) ${base}s, transform 0.7s var(--ease-smooth) ${base}s`,
      }}
    >
      <div className="adv-card__top">
        <span className="adv-card__icon">
          <Icon size={20} strokeWidth={1.7} />
        </span>
        <span className="adv-card__stat font-body">{item.stat}</span>
      </div>

      <h3 className="adv-card__title font-display">{item.title}</h3>
      <p className="adv-card__fact font-body">{item.fact}</p>

      <div className="adv-bars">
        <div className="adv-bar">
          <span className="adv-bar__label font-body">Normal</span>
          <span className="adv-bar__track">
            <span
              className="adv-bar__fill adv-bar__fill--normal"
              style={{ width: inView ? `${normalPct}%` : '0%', transitionDelay: `${base + 0.15}s` }}
            />
          </span>
        </div>
        <div className="adv-bar">
          <span className="adv-bar__label adv-bar__label--green font-body">Green</span>
          <span className="adv-bar__track">
            <span
              className="adv-bar__fill adv-bar__fill--green"
              style={{ width: inView ? `${greenPct}%` : '0%', transitionDelay: `${base + 0.25}s` }}
            />
          </span>
        </div>
      </div>

      <span className="adv-card__source font-body">{item.source}</span>
    </article>
  );
}

// Replaces the old 4-pillar "Why" section. Keeps id="why" (nav "About Us").
export default function GreenAdvantages() {
  const [ref, inView] = useInView(0.12);
  return (
    <section id="why" ref={ref} className="adv">
      <span className="adv__orb" aria-hidden="true" />
      <div className="adv__inner">
        <header className="adv__head">
          <p className="adv__eyebrow font-body" style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease' }}>
            The MyGreenHome Difference
          </p>
          <h2
            className="adv__title font-display"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s var(--ease-smooth) 0.08s, transform 0.8s var(--ease-smooth) 0.08s',
            }}
          >
            7 ways a green home beats a <span className="adv__accent">normal one</span>
          </h2>
          <p
            className="adv__sub font-body"
            style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.18s' }}
          >
            Not just prettier — measurably healthier. Every claim below is grounded in published research.
          </p>
        </header>

        <div className="adv-grid">
          {ADVANTAGES.map((item, i) => (
            <AdvCard key={item.title} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
