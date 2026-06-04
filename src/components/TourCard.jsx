import { SMART_METRICS } from '../constants/smart';

// One detail card per Home-Tour scene, shown on the right of the split stage.
// App.jsx remounts this (key={sceneId}) on every scene change, so the
// slide-in-from-right entrance (see .tour-card / cardIn in index.css) replays.
//
//   scene 0      → cinematic intro
//   scenes 1–4   → zone headline + curated plant list
//   scene 5      → Neobot smart dashboard
export default function TourCard({ scene, cards = [], sceneId }) {
  const isIntro = sceneId === 0;
  const isSmart = sceneId === 5;

  return (
    <div className={`tour-card${isIntro ? ' tour-card--intro' : ''}`}>
      <span className="tour-card__badge">
        <span className="tour-card__dot" style={isSmart ? { animation: 'pulse 2s ease-in-out infinite' } : undefined} />
        {isIntro ? 'The Home Tour' : scene.zone}
      </span>

      {isIntro ? (
        <h2 className="tour-card__title font-display">
          Step <span className="font-script tour-card__script">Inside.</span>
        </h2>
      ) : (
        <h2 className="tour-card__title font-display">
          {scene.headline[0]}
          <br />
          {scene.headline[1]}
        </h2>
      )}

      <p className="tour-card__sub font-body">{scene.sub}</p>

      {/* Plant list — scenes 1–4 */}
      {!isIntro && !isSmart && (
        <div className="tour-card__list">
          {cards.map((p, i) => (
            <div className="tour-plant" key={p.name} style={{ '--d': `${0.35 + i * 0.12}s` }}>
              <span className="tour-plant__emoji" style={{ background: `${p.accent}33`, borderColor: `${p.accent}66` }}>
                {p.emoji}
              </span>
              <span className="tour-plant__text">
                <span className="tour-plant__name font-body">{p.name}</span>
                <span className="tour-plant__sci font-body">{p.scientific}</span>
              </span>
              <span className="tour-plant__tag font-body">{p.tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Smart dashboard — scene 5 */}
      {isSmart && (
        <div className="tour-card__list">
          {SMART_METRICS.map((m, i) => (
            <div className="tour-metric" key={m.label} style={{ '--d': `${0.35 + i * 0.1}s` }}>
              <span className="tour-metric__label font-body">{m.label}</span>
              <span className="tour-metric__right">
                <span className="tour-metric__value font-body" style={{ color: m.color }}>
                  {m.value}
                  {m.unit}
                </span>
                <span className="tour-metric__chip font-body" style={{ color: m.color, background: `${m.color}22` }}>
                  {m.status}
                </span>
              </span>
            </div>
          ))}
          <div className="tour-metric__foot font-body">
            <span className="tour-metric__live" />
            Auto-watering active • Next: Today 6:00 AM
          </div>
        </div>
      )}

      {isIntro && <span className="tour-card__hint font-body">Scroll to begin the walk-through ↓</span>}
    </div>
  );
}
