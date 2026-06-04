import { useEffect, useState } from 'react';

// Live air quality from Open-Meteo — keyless, CORS-enabled, production-safe.
// https://open-meteo.com/en/docs/air-quality-api
//
// useAirQuality(loc) → { loading, error, data }
//   loc  = { lat, lon } | null  (no fetch until a location is provided)
//   data = { usAqi, pm25, pm10, fetchedAt } | null
//
// Results are cached in localStorage (30-min TTL, keyed by rounded lat/lon) so
// revisits and re-renders don't re-hit the network. Stale requests are aborted.

const TTL = 30 * 60 * 1000;
const cacheKey = (lat, lon) => `mgh-aq:${lat.toFixed(2)},${lon.toFixed(2)}`;

function readCache(lat, lon) {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon));
    if (!raw) return null;
    const { data, t } = JSON.parse(raw);
    if (Date.now() - t > TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(lat, lon, data) {
  try {
    localStorage.setItem(cacheKey(lat, lon), JSON.stringify({ data, t: Date.now() }));
  } catch {
    /* private mode / quota — ignore */
  }
}

export function useAirQuality(loc) {
  const [state, setState] = useState({ loading: false, error: null, data: null });

  useEffect(() => {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') return;
    const { lat, lon } = loc;

    const cached = readCache(lat, lon);
    if (cached) {
      setState({ loading: false, error: null, data: cached });
      return;
    }

    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;

    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const c = json?.current || {};
        const data = {
          usAqi: Math.round(c.us_aqi ?? 0),
          pm25: Math.round((c.pm2_5 ?? 0) * 10) / 10,
          pm10: Math.round((c.pm10 ?? 0) * 10) / 10,
          fetchedAt: Date.now(),
        };
        if (!data.pm25 && !data.usAqi) throw new Error('No data');
        writeCache(lat, lon, data);
        setState({ loading: false, error: null, data });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ loading: false, error: err.message || 'fetch failed', data: null });
      });

    return () => ctrl.abort();
  }, [loc?.lat, loc?.lon]);

  return state;
}

// Past-year air-quality stats: 3-month peak + annual average (AQI & PM2.5).
// Heavier call (~1yr hourly), so it's separate from the live reading and cached
// for 12h. Returns { loading, error, data } with data =
//   { avgAqi, avgPm, peakAqi, peakPm } | null
const HIST_TTL = 12 * 60 * 60 * 1000;
const histKey = (lat, lon) => `mgh-aqh:${lat.toFixed(2)},${lon.toFixed(2)}`;
const ymd = (d) => d.toISOString().slice(0, 10);

export function useAirHistory(loc) {
  const [state, setState] = useState({ loading: false, error: null, data: null });

  useEffect(() => {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') return;
    const { lat, lon } = loc;

    try {
      const raw = localStorage.getItem(histKey(lat, lon));
      if (raw) {
        const { data, t } = JSON.parse(raw);
        if (Date.now() - t <= HIST_TTL) {
          setState({ loading: false, error: null, data });
          return;
        }
      }
    } catch {
      /* ignore */
    }

    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 365);
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${lat}&longitude=${lon}&hourly=pm2_5,us_aqi` +
      `&start_date=${ymd(start)}&end_date=${ymd(end)}&timezone=auto`;

    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const aqi = json?.hourly?.us_aqi || [];
        const pm = json?.hourly?.pm2_5 || [];
        if (!aqi.length) throw new Error('No history');

        let sumAqi = 0;
        let sumPm = 0;
        let n = 0;
        for (let i = 0; i < aqi.length; i++) {
          if (aqi[i] != null) {
            sumAqi += aqi[i];
            n++;
          }
          if (pm[i] != null) sumPm += pm[i];
        }
        // last ~90 days → 3-month peak
        const win = 90 * 24;
        let peakAqi = 0;
        let peakPm = 0;
        for (let i = Math.max(0, aqi.length - win); i < aqi.length; i++) {
          if (aqi[i] > peakAqi) peakAqi = aqi[i];
          if (pm[i] > peakPm) peakPm = pm[i];
        }
        const data = {
          avgAqi: n ? Math.round(sumAqi / n) : 0,
          avgPm: n ? Math.round((sumPm / n) * 10) / 10 : 0,
          peakAqi: Math.round(peakAqi),
          peakPm: Math.round(peakPm * 10) / 10,
        };
        try {
          localStorage.setItem(histKey(lat, lon), JSON.stringify({ data, t: Date.now() }));
        } catch {
          /* ignore */
        }
        setState({ loading: false, error: null, data });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ loading: false, error: err.message || 'fetch failed', data: null });
      });

    return () => ctrl.abort();
  }, [loc?.lat, loc?.lon]);

  return state;
}

// City → coordinates via Open-Meteo's keyless geocoding API.
// Returns [{ name, region, country, lat, lon }]. Empty array on failure.
export async function geocodeCity(query, signal) {
  const q = query.trim();
  if (q.length < 2) return [];
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  try {
    const r = await fetch(url, { signal });
    if (!r.ok) return [];
    const json = await r.json();
    return (json?.results || []).map((p) => ({
      name: p.name,
      region: [p.admin1, p.country].filter(Boolean).join(', '),
      country: p.country,
      lat: p.latitude,
      lon: p.longitude,
    }));
  } catch {
    return [];
  }
}
