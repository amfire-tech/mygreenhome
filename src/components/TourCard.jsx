import { SMART_METRICS } from '../constants/smart';

// One detail card per Home-Tour scene, shown beside the looping walkthrough.
// HomeTour remounts this (key={sceneId}) on every scene change so the entrance
// animation (.tcard / cardRise) replays as the video glides between zones.
//
//   scene 0      → title card ("Step Inside")
//   scenes 1–4   → zone headline + curated plant list
//   scene 5      → Neobot smart dashboard
export default function TourCard({ scene, cards = [], sceneId, index = 1, total = 6 }) {
  const isIntro = sceneId === 0;
  const isSmart = sceneId === 5;

  return (
    <article className={`tcard${isIntro ? ' tcard--intro' : ''}${isSmart ? ' tcard--smart' : ''}`}>
      <header className="tcard__top">
        <span className="tcard__badge">
          <span className="tcard__dot" />
          {isIntro ? 'The Home Tour' : scene.zone}
        </span>
        <span className="tcard__index font-display">
          {String(index).padStart(2, '0')}
          <i>/ {String(total).padStart(2, '0')}</i>
        </span>
      </header>

      {isIntro ? (
        <h3 className="tcard__title font-display">
          Step <span className="font-script tcard__script">Inside.</span>
        </h3>
      ) : (
        <h3 className="tcard__title font-display">
          {scene.headline[0]}
          <br />
          {scene.headline[1]}
        </h3>
      )}

      <p className="tcard__sub font-body">{scene.sub}</p>

      {/* Plant list — scenes 1–4 */}
      {!isIntro && !isSmart && (
        <div className="tcard__list">
          {cards.map((p, i) => (
            <div
              className="tplant"
              key={p.name}
              style={{ '--d': `${0.3 + i * 0.1}s`, '--accent': p.accent }}
            >
              <span className="tplant__icon" style={{ background: `${p.accent}33`, borderColor: `${p.accent}66` }}>
                {p.emoji}
              </span>
              <span className="tplant__body">
                <span className="tplant__name font-body">{p.name}</span>
                <span className="tplant__sci font-body">{p.scientific}</span>
              </span>
              <span className="tplant__tag font-body">{p.tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Smart dashboard — scene 5 */}
      {isSmart && (
        <div className="tcard__list">
          {SMART_METRICS.map((m, i) => (
            <div className="tmetric" key={m.label} style={{ '--d': `${0.3 + i * 0.08}s`, '--c': m.color }}>
              <span className="tmetric__label font-body">{m.label}</span>
              <span className="tmetric__track" aria-hidden="true">
                <span className="tmetric__fill" style={{ width: `${parseInt(m.value, 10)}%`, background: m.color }} />
              </span>
              <span className="tmetric__value font-body" style={{ color: m.color }}>
                {m.value}
                {m.unit}
              </span>
              <span className="tmetric__chip font-body" style={{ color: m.color, background: `${m.color}22` }}>
                {m.status}
              </span>
            </div>
          ))}
          <div className="tmetric__foot font-body">
            <span className="tmetric__live" />
            Auto-watering active • Next: Today 6:00 AM
          </div>
        </div>
      )}

      {isIntro && (
        <p className="tcard__hint font-body">Press &amp; hold to pause · tap a dot to jump</p>
      )}
    </article>
  );
}
