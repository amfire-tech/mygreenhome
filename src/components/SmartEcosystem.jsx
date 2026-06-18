import { useInView } from '../hooks/useInView';
import SmartDashboard from './SmartDashboard';

// "Smart Green Ecosystem" — showcases the Skillbot controller infographic as a
// large floating, glowing centerpiece. Reveals on scroll; stays in the dark
// zone between the transformations and the dawn-break into Act II.
export default function SmartEcosystem() {
  const [ref, inView] = useInView(0.2);

  const reveal = (d = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(34px)',
    transition: 'opacity 0.9s var(--ease-smooth), transform 0.9s var(--ease-smooth)',
    transitionDelay: `${d}s`,
  });

  return (
    <section ref={ref} id="ecosystem" className="eco">
      <span className="eco__orb eco__orb--a" aria-hidden="true" />
      <span className="eco__orb eco__orb--b" aria-hidden="true" />

      <div className="eco__inner">
        <div className="eco__head">
          <span className="eco__eyebrow font-body" style={reveal(0)}>
            Smart Green Ecosystem
          </span>
          <h2 className="eco__title font-display" style={reveal(0.1)}>
            The Brain Behind Your <span className="eco__title-accent">Green Home</span>
          </h2>
          <p className="eco__sub font-body" style={reveal(0.2)}>
            Soil, water, light and air — sensed and cared for automatically, so every leaf thrives
            without you lifting a finger.
          </p>
        </div>

        <div className="eco__device" style={reveal(0.32)}>
          <span className="eco__glow" aria-hidden="true" />
          <img
            src="/images/meter.webp"
            alt="NeoBot smart-garden controller showing soil health, air quality and irrigation status"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Live animated infographics — the system, working in real time */}
        <SmartDashboard />
      </div>
    </section>
  );
}
