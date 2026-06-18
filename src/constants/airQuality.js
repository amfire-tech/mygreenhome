// Live air-quality model + the science behind the comparison.
//
// Cigarette equivalence: Berkeley Earth's widely-cited rule of thumb —
// ~22 µg/m³ of PM2.5 over 24h ≈ the mortality-risk of one cigarette/day.
// https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
export const CIG_PER_PM25 = 22;

// "Inside a MyGreenHome" — an estimated target with an air purifier + greenery,
// not a live measurement. It is always derived FROM the outdoor reading so the
// inside is guaranteed cleaner than the street (a fixed indoor value used to
// look *worse* than already-clean cities like London). Model: ~70% PM2.5
// removal, then a HARD CAP at US AQI 25 — the inside never shows worse than 25,
// whether the city is London or hazardous Delhi (a well-sized purifier holds a
// sealed room there). Low-pollution cities just use the derived value (< 25).
export const INDOOR_REMOVAL = 0.7; // fraction of PM2.5 the home clears
export const INDOOR_AQI_CAP = 25; // inside never exceeds this, any city
export const INDOOR_PM_CEIL = 6; // µg/m³ ≈ US AQI 25 (the cap above)
export const INDOOR_PM_FLOOR = 2; // never claim cleaner than this

// Indoor PM2.5 for a given outdoor PM2.5 — always strictly lower than outdoor.
export function indoorPm25From(outdoorPm25) {
  const out = Math.max(0, Number.isFinite(outdoorPm25) ? outdoorPm25 : 0);
  const cleaned = Math.min(out * (1 - INDOOR_REMOVAL), INDOOR_PM_CEIL);
  // clamp to the floor, but never above ~85% of outdoor (stays better even when
  // the street is already pristine), and never below 0.
  const v = Math.min(out * 0.85, Math.max(INDOOR_PM_FLOOR, cleaned));
  return Math.round(Math.max(0, v) * 10) / 10;
}

// US EPA AQI from a PM2.5 concentration (µg/m³) — same scale Open-Meteo reports
// for the outdoor reading, so the indoor dial is consistent with it.
const PM25_AQI_BP = [
  [0.0, 12.0, 0, 50],
  [12.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 150.4, 151, 200],
  [150.5, 250.4, 201, 300],
  [250.5, 350.4, 301, 400],
  [350.5, 500.4, 401, 500],
];
export function usAqiFromPm25(pm25) {
  const c = Math.max(0, Number.isFinite(pm25) ? pm25 : 0);
  for (const [cLo, cHi, aLo, aHi] of PM25_AQI_BP) {
    if (c <= cHi) return Math.round(((aHi - aLo) / (cHi - cLo)) * (c - cLo) + aLo);
  }
  return 500;
}

// Shown on first load so the section is never empty (one of India's most
// polluted metros makes the comparison land hard).
export const DEFAULT_LOCATION = { name: 'Delhi', region: 'India', lat: 28.6139, lon: 77.209 };

// Offline / API-failure fallbacks so the UI always renders something real-ish.
export const SAMPLE_READING = { usAqi: 168, pm25: 88, pm10: 142 };
export const SAMPLE_HISTORY = { avgAqi: 204, avgPm: 82.5, peakAqi: 915, peakPm: 270.1 };

// US AQI categories (0–500). Each band: upper bound, label, colour.
export const AQI_BANDS = [
  { max: 50, label: 'Good', color: '#4ab87a' },
  { max: 100, label: 'Moderate', color: '#d8a23a' },
  { max: 150, label: 'Unhealthy (sensitive)', color: '#e07b39' },
  { max: 200, label: 'Unhealthy', color: '#c2503a' },
  { max: 300, label: 'Very Unhealthy', color: '#8e44ad' },
  { max: Infinity, label: 'Hazardous', color: '#7e2d2d' },
];

export function aqiBand(usAqi) {
  const v = Number.isFinite(usAqi) ? usAqi : 0;
  return AQI_BANDS.find((b) => v <= b.max) || AQI_BANDS[AQI_BANDS.length - 1];
}

// Cigarettes/day for a given PM2.5 (µg/m³), rounded to 1 decimal.
export function cigsFromPm25(pm25) {
  const v = Math.max(0, Number.isFinite(pm25) ? pm25 : 0);
  return Math.round((v / CIG_PER_PM25) * 10) / 10;
}

// We headline the equivalence over a MONTH, not a day — same science, bigger and
// more visceral number (a clean-ish "0.3/day" reads as nothing; "9/month" lands).
// Change CIG_WINDOW_DAYS/LABEL together to reframe (7 = week, 365 = year).
export const CIG_WINDOW_DAYS = 30;
export const CIG_WINDOW_LABEL = 'month';

// Cigarettes over the headline window for a given PM2.5 (unrounded — format at
// display so the count-up stays accurate; multiplying the rounded daily figure
// would drift).
export function cigsPerWindow(pm25) {
  const v = Math.max(0, Number.isFinite(pm25) ? pm25 : 0);
  return (v / CIG_PER_PM25) * CIG_WINDOW_DAYS;
}
