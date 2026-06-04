// Linear interpolation between a and b by t (0..1).
export const lerp = (a, b, t) => a + (b - a) * t;

// Clamp v into [lo, hi].
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Smooth ease-in-out curve.
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// Remap v from [inMin, inMax] to [outMin, outMax].
export const mapRange = (v, inMin, inMax, outMin, outMax) =>
  ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

// Random float in [min, max).
export const rand = (min, max) => min + Math.random() * (max - min);
