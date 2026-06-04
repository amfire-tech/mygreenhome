import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Wind, Loader2 } from 'lucide-react';

import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { useAirQuality, useAirHistory, geocodeCity } from '../hooks/useAirQuality';
import {
  DEFAULT_LOCATION,
  SAMPLE_READING,
  SAMPLE_HISTORY,
  INDOOR_AQI,
  INDOOR_PM25,
  aqiBand,
  cigsFromPm25,
} from '../constants/airQuality';

// 270° gauge geometry (shared visual language with SmartDashboard).
const R = 80;
const C = 2 * Math.PI * R;
const ARC = C * 0.75;
const ROT = 135;
const fmt = (n) => (Math.round(n * 10) / 10).toFixed(1);

// ── Animated AQI dial ───────────────────────────────────────
function AqiDial({ value, max = 300, color }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const display = Math.round(useCountUp(value, shown, 1400));
  const frac = Math.max(0, Math.min(1, value / max));
  const offset = shown ? ARC * (1 - frac) : ARC;
  const angle = ROT + (shown ? frac * 270 : 0);

  return (
    <div className="air-dial">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle
          cx="100" cy="100" r={R} fill="none" stroke="rgba(245,240,232,0.1)"
          strokeWidth="9" strokeDasharray={`${ARC} ${C}`} transform={`rotate(${ROT} 100 100)`}
        />
        <circle
          cx="100" cy="100" r={R} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${ARC} ${C}`} strokeDashoffset={offset}
          transform={`rotate(${ROT} 100 100)`}
          style={{ transition: 'stroke-dashoffset 1.5s var(--ease-smooth), stroke 0.6s ease' }}
        />
        <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 1.6s cubic-bezier(0.34,1.2,0.4,1)' }}>
          <line x1="156" y1="100" x2="170" y2="100" stroke="#f5f0e8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="174" cy="100" r="5" fill="#f5f0e8" stroke="#0b1610" strokeWidth="1.5" />
        </g>
      </svg>
      <div className="air-dial__readout">
        <span className="air-dial__value font-display">{display}</span>
        <span className="air-dial__unit font-body">US AQI</span>
      </div>
    </div>
  );
}

// ── Animated burning cigarette ──────────────────────────────
function Cigarette({ intensity = 'high' }) {
  return (
    <div className={`cig cig--${intensity}`} aria-hidden="true">
      <span className="cig-smoke" />
      <span className="cig-smoke" />
      <span className="cig-smoke" />
      <span className="cig-stick">
        <span className="cig-ember" />
      </span>
    </div>
  );
}

// Mini history rows (3-month peak + yearly average) with the cigarettes you'd
// smoke if that air persisted all day. `stats` may be null while loading.
function StatRows({ stats, note, loading }) {
  const rows = [
    { k: '3-mo peak', aqi: stats?.peakAqi, pm: stats?.peakPm },
    { k: 'Yearly avg', aqi: stats?.avgAqi, pm: stats?.avgPm },
  ];
  return (
    <div className="air-stats">
      {rows.map((r) => (
        <div className="air-stat" key={r.k}>
          <span className="air-stat__k font-body">{r.k}</span>
          <span
            className="air-stat__aqi font-body"
            style={{ color: r.aqi != null ? aqiBand(r.aqi).color : 'rgba(245,240,232,0.4)' }}
          >
            {r.aqi != null ? `AQI ${r.aqi}` : loading ? '…' : '—'}
          </span>
          <span className="air-stat__cig font-body">
            {r.pm != null ? `${fmt(cigsFromPm25(r.pm))} cig/day` : loading ? '…' : '—'}
          </span>
        </div>
      ))}
      <span className="air-stat__note font-body">{note}</span>
    </div>
  );
}

// ── One comparison card ─────────────────────────────────────
function CompareCard({ variant, place, aqi, pm25, color, bandLabel, cigs, stats, statsNote, statsLoading, live }) {
  const out = variant === 'out';
  const cigDisplay = fmt(useCountUp(cigs, true, 1500));
  return (
    <div className={`air-card air-card--${variant}`} style={out ? { '--accent': color } : undefined}>
      <div className="air-card__head">
        <span className="air-card__place font-body">
          {out ? <MapPin size={13} /> : <Wind size={13} />}
          {place}
          {out && live && (
            <span className="air-live" title="Live air-quality data">
              <span className="air-live__dot" />
              LIVE
            </span>
          )}
        </span>
        <span className="air-card__band font-body" style={{ color, background: `${color}22` }}>
          {bandLabel}
        </span>
      </div>

      <AqiDial value={aqi} color={color} />

      <div className="air-card__cig">
        <Cigarette intensity={out ? 'high' : 'low'} />
        <div className="air-card__cig-num">
          <span className="font-display">{cigDisplay}</span>
          <span className="font-body">cigarettes / day · now</span>
        </div>
      </div>

      <StatRows stats={stats} note={statsNote} loading={statsLoading} />

      <div className="air-card__foot">
        <span className="font-body">PM2.5 now</span>
        <span className="font-body air-card__pm" style={{ color }}>{fmt(pm25)} µg/m³</span>
      </div>
    </div>
  );
}

// ── Section ─────────────────────────────────────────────────
export default function AirCheck() {
  const [ref, inView] = useInView(0.18);
  const [loc, setLoc] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [geoBusy, setGeoBusy] = useState(false);
  const boxRef = useRef(null);

  // Lazy: only resolve a location (and hit the API) once the section is seen.
  useEffect(() => {
    if (inView && !loc) setLoc(DEFAULT_LOCATION);
  }, [inView, loc]);

  const { loading, error, data } = useAirQuality(loc);
  const history = useAirHistory(loc);

  // Debounced city search.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      const r = await geocodeCity(q, ctrl.signal);
      setResults(r);
      setSearching(false);
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  // Close dropdown on outside click.
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setResults([]);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const pick = (p) => {
    setLoc({ name: p.name, region: p.region, lat: p.lat, lon: p.lon });
    setQuery('');
    setResults([]);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ name: 'Your location', region: '', lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoBusy(false);
      },
      () => setGeoBusy(false),
      { timeout: 8000, maximumAge: 600000 }
    );
  };

  // Resolve the reading (live → fallback so the UI never sits empty).
  const reading = data || (error ? SAMPLE_READING : null);
  const hist = history.data || (history.error ? SAMPLE_HISTORY : null);
  const outBand = aqiBand(reading?.usAqi ?? 0);
  const inBand = aqiBand(INDOOR_AQI);
  const cigsOut = reading ? cigsFromPm25(reading.pm25) : 0;
  const cigsIn = cigsFromPm25(INDOOR_PM25);
  // Indoor stays steady year-round (purifier + greenery).
  const inStats = { peakAqi: INDOOR_AQI, peakPm: INDOOR_PM25, avgAqi: INDOOR_AQI, avgPm: INDOOR_PM25 };
  const saved = Math.max(0, cigsOut - cigsIn);
  const placeLabel = loc ? [loc.name, loc.region].filter(Boolean).join(', ') : 'Loading…';

  return (
    <section ref={ref} id="aircheck" className="aircheck">
      <span className="aircheck__orb" aria-hidden="true" />
      <div className="aircheck__inner">
        <header className="aircheck__head">
          <span className="aircheck__eyebrow font-body">Reality Check · Live Air</span>
          <h2 className="aircheck__title font-display">
            How clean is the air you're <span className="aircheck__accent">breathing right now?</span>
          </h2>
          <p className="aircheck__sub font-body">
            Live air-quality for your city, translated into something we all understand —
            cigarettes. See the difference a MyGreenHome makes.
          </p>
        </header>

        {/* Location control */}
        <div className="air-control" ref={boxRef}>
          <div className="air-search">
            <Search size={16} className="air-search__icon" />
            <input
              className="air-search__input font-body"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your city…"
              aria-label="Search your city"
            />
            {searching && <Loader2 size={15} className="air-search__spin" />}
            {results.length > 0 && (
              <ul className="air-results">
                {results.map((p, i) => (
                  <li key={`${p.lat}-${p.lon}-${i}`}>
                    <button type="button" className="font-body" onClick={() => pick(p)}>
                      <MapPin size={13} />
                      <span>{p.name}</span>
                      <span className="air-results__region">{p.region}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" className="air-locate font-body" onClick={useMyLocation} disabled={geoBusy}>
            {geoBusy ? <Loader2 size={15} className="air-search__spin" /> : <MapPin size={15} />}
            Use my location
          </button>
        </div>

        <p className="air-now font-body">
          Showing&nbsp;
          <strong>{placeLabel}</strong>
          {loading && <span className="air-now__load"> · fetching live data…</span>}
          {error && <span className="air-now__warn"> · live data unavailable, showing a typical reading</span>}
        </p>

        {/* Comparison */}
        <div className="air-grid">
          <CompareCard
            variant="out"
            place={loc?.name || 'Outside'}
            aqi={reading?.usAqi ?? 0}
            pm25={reading?.pm25 ?? 0}
            color={outBand.color}
            bandLabel={outBand.label}
            cigs={cigsOut}
            live={!!data}
            stats={hist}
            statsLoading={history.loading}
            statsNote="cigarettes/day if that air lasted all day"
          />
          <div className="air-vs" aria-hidden="true"><span>vs</span></div>
          <CompareCard
            variant="in"
            place="Inside · MyGreenHome"
            aqi={INDOOR_AQI}
            pm25={INDOOR_PM25}
            color={inBand.color}
            bandLabel="Good"
            cigs={cigsIn}
            stats={inStats}
            statsNote="steady — every day of the year"
          />
        </div>

        {/* Delta */}
        <div className="air-delta" style={{ opacity: reading ? 1 : 0 }}>
          <span className="air-delta__big font-display">{fmt(saved)}</span>
          <span className="air-delta__txt font-body">
            cigarettes a day a MyGreenHome clears from the air you breathe
          </span>
        </div>

        <p className="air-cite font-body">
          Live &amp; past-year data: Open-Meteo · Cigarette equivalence: Berkeley Earth (≈22 µg/m³ PM2.5 ≈ 1 cigarette/day,
          if sustained 24h). Indoor figure is an estimated target with an air purifier + greenery, not a measurement.
        </p>
      </div>
    </section>
  );
}
