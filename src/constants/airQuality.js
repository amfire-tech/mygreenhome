// Live air-quality model + the science behind the comparison.
//
// Cigarette equivalence: Berkeley Earth's widely-cited rule of thumb —
// ~22 µg/m³ of PM2.5 over 24h ≈ the mortality-risk of one cigarette/day.
// https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
export const CIG_PER_PM25 = 22;

// "Inside a MyGreenHome" — an estimated target with an air purifier + greenery,
// not a live measurement. Held steady at ~US AQI 30 (PM2.5 ≈ 7.2 µg/m³),
// year-round, regardless of how bad the air gets outside.
export const INDOOR_AQI = 30;
export const INDOOR_PM25 = 7.2;

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
