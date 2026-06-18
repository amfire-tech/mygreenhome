import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';

/* ============================================================
   LIVE SMART DASHBOARD
   Four world-class animated infographics that bring the
   "Smart Green Ecosystem" story to life. Pure SVG + CSS + a
   couple of tiny timers — no extra dependencies. Each widget
   reveals on scroll, then keeps breathing on a loop.
   ============================================================ */

// ── 270° gauge geometry (shared by the AQI dial) ──
const R = 80;
const C = 2 * Math.PI * R; // full circumference
const ARC = C * 0.75; // visible 270° arc length
const ROT = 135; // rotate so the gap sits centered at the bottom

// ── 1 · AQI AIR-QUALITY GAUGE (auto-cycling) ────────────────
// Loops through purified-indoor → polluted-outdoor states so the dial tells the
// whole story on its own: needle sweeps, number glides, band + colour change.
const AQI_MAX = 400; // full sweep top (so 350+ lands deep in the red zone)
const AQI_STATES = [
  { aqi: 25, label: 'Good', note: 'Indoor · purified', text: '#4ab87a' },
  { aqi: 147, label: 'Unhealthy', note: 'Outdoor · city air', text: '#e8893f' },
  { aqi: 358, label: 'Hazardous', note: 'Outdoor · polluted', text: '#e2574c' },
];
// US-AQI colour bands mapped onto the 0–AQI_MAX arc.
const AQI_BANDS = [
  { from: 0, to: 50, color: '#4ab87a' },
  { from: 50, to: 100, color: '#d8a23a' },
  { from: 100, to: 150, color: '#e07b39' },
  { from: 150, to: 200, color: '#c2503a' },
  { from: 200, to: 300, color: '#8e44ad' },
  { from: 300, to: AQI_MAX, color: '#7e2d2d' },
];

function AqiGauge({ inView }) {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState(0); // tweened AQI number (drives needle)
  const fromRef = useRef(0);
  const state = AQI_STATES[idx];

  // Advance to the next state on a loop, only while the card is on screen.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % AQI_STATES.length), 2800);
    return () => clearInterval(id);
  }, [inView]);

  // Glide the number (and needle) from the previous value to the new target.
  useEffect(() => {
    if (!inView) {
      setDisplay(0);
      fromRef.current = 0;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(state.aqi);
      fromRef.current = state.aqi;
      return;
    }
    const from = fromRef.current;
    const to = state.aqi;
    const t0 = performance.now();
    const dur = 950;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setDisplay(from + (to - from) * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setDisplay(to);
        fromRef.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, inView, state.aqi]);

  const frac = Math.max(0, Math.min(1, display / AQI_MAX));
  const needleAngle = ROT + frac * 270;

  return (
    <div className="eco-card">
      <span className="eco-card__eyebrow font-body">Air Quality</span>
      <div className="eco-card__viz aqi-viz">
        {/* drifting dust that clears away */}
        {[...Array(5)].map((_, i) => (
          <span key={i} className="aqi-particle" style={{ left: `${15 + i * 16}%`, animationDelay: `${i * 0.7}s` }} />
        ))}
        <svg viewBox="0 0 200 200" className="aqi-svg" aria-hidden="true">
          {AQI_BANDS.map((b, i) => {
            const s = b.from / AQI_MAX;
            const len = ((b.to - b.from) / AQI_MAX) * ARC;
            const active = display >= b.from && display < b.to;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={b.color}
                strokeWidth="9"
                strokeLinecap="butt"
                strokeDasharray={`${Math.max(0, len - 2)} ${C}`}
                strokeDashoffset={-s * ARC}
                transform={`rotate(${ROT} 100 100)`}
                opacity={inView ? (active ? 1 : 0.26) : 0.16}
                style={{ transition: 'opacity 0.5s ease' }}
              />
            );
          })}
          {/* pointer — rides just inside the arc so it never crosses the value */}
          <g transform={`rotate(${needleAngle} 100 100)`}>
            <line x1="156" y1="100" x2="170" y2="100" stroke="#f5f0e8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="174" cy="100" r="5" fill="#f5f0e8" stroke="#0b1610" strokeWidth="1.5" />
          </g>
        </svg>
        <div className="aqi-readout">
          <span
            className="aqi-readout__value font-display"
            style={{ color: state.text, transition: 'color 0.6s ease' }}
          >
            {Math.round(display)}
          </span>
          <span className="aqi-readout__unit font-body">AQI</span>
        </div>
      </div>
      <div className="eco-card__foot">
        <span
          className="eco-pill"
          style={{ color: state.text, background: `${state.text}22`, transition: 'color 0.5s ease, background 0.5s ease' }}
        >
          ● {state.label}
        </span>
        <span key={idx} className="eco-card__note font-body aqi-note">{state.note}</span>
      </div>
    </div>
  );
}

// ── 2 · OXYGEN BREATHING METER ──────────────────────────────
function OxygenMeter({ inView }) {
  const o2 = Math.round(useCountUp(24, inView, 1700));
  const level = 66; // fill height %

  return (
    <div className="eco-card">
      <span className="eco-card__eyebrow font-body">Fresh Oxygen</span>
      <div className="eco-card__viz o2-viz">
        <div className="o2-capsule">
          <div className="o2-fill" style={{ height: inView ? `${level}%` : '0%' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className="o2-bubble" style={{ left: `${12 + i * 18}%`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>
          <span className="o2-ring" />
        </div>
        <div className="o2-readout">
          <span className="o2-readout__value font-display">+{o2}%</span>
          <span className="o2-readout__label font-body">O₂ enriched</span>
        </div>
      </div>
      <div className="eco-card__foot">
        <span className="eco-pill" style={{ color: '#7ab8c8', background: '#7ab8c822' }}>● Breathing easy</span>
        <span className="eco-card__note font-body">vs. sealed room</span>
      </div>
    </div>
  );
}

// ── 3 · SMART IRRIGATION TRACKER ────────────────────────────
function pad(n) {
  return String(n).padStart(2, '0');
}
function useCountdownTo(hour) {
  const [str, setStr] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(hour, 0, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const d = Math.max(0, next - now);
      const h = Math.floor(d / 3.6e6);
      const m = Math.floor((d % 3.6e6) / 6e4);
      const s = Math.floor((d % 6e4) / 1000);
      setStr(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [hour]);
  return str;
}

function IrrigationTracker({ inView }) {
  const countdown = useCountdownTo(6); // next watering at 6:00 AM
  const moisture = Math.round(useCountUp(88, inView, 1700));

  return (
    <div className="eco-card">
      <span className="eco-card__eyebrow font-body">Smart Irrigation</span>
      <div className="eco-card__viz irr-viz">
        <svg viewBox="0 0 200 110" className="irr-svg" aria-hidden="true">
          {/* pipe + flowing water */}
          <path d="M20 24 H120 Q150 24 150 54 V70" className="irr-pipe" />
          <path d="M20 24 H120 Q150 24 150 54 V70" className="irr-flow" />
          {/* falling droplets */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="150" cy="74" r="3.4" className="irr-drop" fill="#4a9cb8" style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
          {/* nozzle */}
          <rect x="143" y="68" width="14" height="6" rx="2" fill="#4a7c59" />
        </svg>
        {/* soil moisture bar */}
        <div className="irr-soil">
          <span className="irr-soil__fill" />
        </div>
        <div className="irr-meta">
          <div className="irr-meta__row">
            <span className="font-body irr-meta__k">Soil moisture</span>
            <span className="font-body irr-meta__v" style={{ color: '#4a9cb8' }}>{moisture}%</span>
          </div>
          <div className="irr-meta__row">
            <span className="font-body irr-meta__k">Next watering in</span>
            <span className="font-body irr-meta__v irr-count">{countdown}</span>
          </div>
        </div>
      </div>
      <div className="eco-card__foot">
        <span className="eco-pill" style={{ color: '#4ab87a', background: '#4ab87a22' }}>
          <span className="eco-dot" />Auto-watering on
        </span>
        <span className="eco-card__note font-body">Zero waste · 24/7</span>
      </div>
    </div>
  );
}

// ── 4 · AI PLANT-HEALTH SCAN ────────────────────────────────
const AI_MSGS = [
  'Analyzing leaf moisture…',
  'Optimizing light spectrum…',
  'Balancing soil nutrients…',
  'All systems nominal ✓',
];

function AiHealthScan({ inView }) {
  const conf = Math.round(useCountUp(92, inView, 1900));
  const [msg, setMsg] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setMsg((m) => (m + 1) % AI_MSGS.length), 2400);
    return () => clearInterval(id);
  }, [inView]);

  const r = 30;
  const c = 2 * Math.PI * r;

  return (
    <div className="eco-card">
      <span className="eco-card__eyebrow font-body">AI Plant Health</span>
      <div className="eco-card__viz ai-viz">
        <div className="ai-stage">
          {/* scanning leaf */}
          <svg viewBox="0 0 64 64" className="ai-leaf" aria-hidden="true">
            <path
              d="M32 6 C16 14 12 36 14 54 C34 54 52 40 52 18 C44 20 34 26 30 40 C30 28 30 16 32 6 Z"
              fill="none"
              stroke="#7ec24f"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ai-scanline" />
          {/* neural node graph */}
          <svg viewBox="0 0 120 64" className="ai-net" aria-hidden="true">
            {[
              [12, 32, 56, 14],
              [12, 32, 56, 50],
              [56, 14, 100, 32],
              [56, 50, 100, 32],
              [56, 14, 56, 50],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="ai-edge" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            {[
              [12, 32],
              [56, 14],
              [56, 50],
              [100, 32],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4.5" className="ai-node" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </svg>
        </div>
        {/* confidence ring */}
        <div className="ai-ring">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(126,194,79,0.18)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="#7ec24f"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={inView ? c * (1 - 0.92) : c}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 1.9s var(--ease-smooth)' }}
            />
          </svg>
          <div className="ai-ring__label">
            <span className="font-display">{conf}%</span>
            <span className="font-body">healthy</span>
          </div>
        </div>
      </div>
      <div className="eco-card__foot ai-foot">
        <span className="eco-dot eco-dot--ai" />
        <span key={msg} className="ai-msg font-body">{AI_MSGS[msg]}</span>
      </div>
    </div>
  );
}

// ── ALTERNATING STORY ROWS ──────────────────────────────────
const ITEMS = [
  {
    Widget: AqiGauge,
    kicker: 'Air Quality',
    title: 'Cleaner air, every breath',
    body: 'Indoor sensors read your air quality in real time while living greenery quietly filters it — keeping the space fresh, calm and healthy, day and night.',
  },
  {
    Widget: OxygenMeter,
    kicker: 'Oxygen',
    title: 'Rooms that breathe',
    body: 'A wall of plants enriches the oxygen around you, turning closed, stuffy rooms into bright, energising spaces you can actually feel.',
  },
  {
    Widget: IrrigationTracker,
    kicker: 'Irrigation',
    title: 'Watering on autopilot',
    body: 'The system senses soil moisture and waters each plant exactly when needed — precise, waste-free and running 24/7, so you never lift a finger.',
  },
  {
    Widget: AiHealthScan,
    kicker: 'AI Care',
    title: 'Cared for by AI',
    body: 'Our smart engine studies moisture, light and nutrients for every plant, predicting what they need before a single leaf ever droops.',
  },
];

function StoryRow({ item, index }) {
  const { Widget, kicker, title, body } = item;
  const [ref, inView] = useInView(0.28);
  const reverse = index % 2 === 1;

  return (
    <div ref={ref} className={`eco-row${reverse ? ' eco-row--reverse' : ''}${inView ? ' is-in' : ''}`}>
      <div className="eco-row__media">
        <Widget inView={inView} />
      </div>
      <div className="eco-row__copy">
        <span className="eco-row__num font-display">{String(index + 1).padStart(2, '0')}</span>
        <span className="eco-row__kicker font-body">{kicker}</span>
        <h3 className="eco-row__title font-display">{title}</h3>
        <p className="eco-row__body font-body">{body}</p>
      </div>
    </div>
  );
}

export default function SmartDashboard() {
  return (
    <div className="eco-dash">
      {ITEMS.map((item, i) => (
        <StoryRow key={item.kicker} item={item} index={i} />
      ))}
    </div>
  );
}
