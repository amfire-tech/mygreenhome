import { useInView } from '../hooks/useInView';
import { PLANTS, PLANT_CATEGORIES, CATEGORY_ACCENT } from '../constants/plantLibrary';

const img = (slug) => `/images/plants/${slug}.jpg`;
const CATS = PLANT_CATEGORIES.filter((c) => c !== 'All');

const CAT_BLURB = {
  Indoor: 'Calm, air-purifying greenery for living rooms, bedrooms & desks.',
  Outdoor: 'Hardy, sun-loving plants that bring gardens & balconies alive.',
  Climbing: 'Vigorous climbers that dress up walls, pergolas & railings.',
  Kitchen: 'Fresh herbs & edibles you can snip straight into the pan.',
};

function PlantCard({ p }) {
  const accent = CATEGORY_ACCENT[p.category];
  return (
    <div className="plant-card-x plant-card-x--static">
      <div className="plant-card-x__img">
        <img src={img(p.slug)} alt={p.name} loading="lazy" />
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <h4 className="font-display" style={{ fontSize: 19, fontWeight: 600, color: '#f5f0e8', lineHeight: 1.1 }}>
          {p.name}
        </h4>
        <p className="font-body" style={{ fontStyle: 'italic', fontSize: 10.5, color: 'rgba(245,240,232,0.45)', marginTop: 2 }}>
          {p.botanical}
        </p>
        <span
          className="font-body uppercase"
          style={{ display: 'inline-block', marginTop: 10, fontSize: 8.5, letterSpacing: '0.12em', color: accent }}
        >
          {p.category}
        </span>
      </div>
    </div>
  );
}

// "The Living Library" — plants segregated by category, each a horizontally
// swipeable row. No detail modal; just a clean, browsable gallery.
export default function PlantExplorer() {
  const [ref, inView] = useInView(0.06);

  return (
    <section id="plants" ref={ref} className="plants">
      <div className="plants__inner" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p
            className="font-body uppercase"
            style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--c-gold-light)', opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease' }}
          >
            The Living Library
          </p>
          <h2
            className="font-display"
            style={{
              fontWeight: 700, fontSize: 'clamp(32px,4.4vw,60px)', lineHeight: 1.05, color: '#f5f0e8', marginTop: 12,
              opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            Find your <span className="font-script" style={{ color: 'var(--c-gold-light)', fontSize: '1.1em' }}>perfect plant.</span>
          </h2>
          <p
            className="font-body"
            style={{ fontWeight: 300, fontSize: 14.5, color: 'rgba(245,240,232,0.6)', maxWidth: 480, margin: '14px auto 0', opacity: inView ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}
          >
            {PLANTS.length} hand-picked plants & climbers, sorted by where they thrive — swipe each row to explore.
          </p>
        </div>

        {CATS.map((c, i) => {
          const list = PLANTS.filter((p) => p.category === c);
          if (!list.length) return null;
          const accent = CATEGORY_ACCENT[c];
          return (
            <div
              key={c}
              className="plant-cat"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.7s var(--ease-smooth) ${0.12 + i * 0.1}s, transform 0.7s var(--ease-smooth) ${0.12 + i * 0.1}s`,
              }}
            >
              <div className="plant-cat__head">
                <h3 className="plant-cat__title font-display">
                  <span style={{ color: accent }}>—</span> {c}
                  <span className="plant-cat__count font-body">{list.length}</span>
                </h3>
                <p className="plant-cat__blurb font-body">{CAT_BLURB[c]}</p>
              </div>
              <div className="plant-row">
                {list.map((p) => (
                  <PlantCard key={p.slug} p={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
