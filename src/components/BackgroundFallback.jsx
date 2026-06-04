import { forwardRef } from 'react';

// Per-scene background palette. Shown before the video decodes (and as a
// graceful fallback if the video is missing/fails). Exported so App's rAF
// loop can lerp the spotlight glow color smoothly across scene changes.
export const BG_MAP = {
  0: { base: '#050d08', glow: '#0d2015' }, // Exterior — deep night green
  1: { base: '#071510', glow: '#0d2a1a' }, // Outdoor — richer forest
  2: { base: '#060e08', glow: '#0a2010' }, // Indoor — dense canopy
  3: { base: '#060e06', glow: '#0a1f0a' }, // Balcony — pure green
  4: { base: '#0d0a03', glow: '#1a1005' }, // Terrace — warm amber dark
  5: { base: '#050d08', glow: '#0d2015' }, // Smart — back to deep green
};

// forwardRef → the spotlight layer. App.jsx writes its `background` each frame
// (mouse-following radial gradient with a lerped glow color).
const BackgroundFallback = forwardRef(function BackgroundFallback({ sceneId }, ref) {
  const base = (BG_MAP[sceneId] || BG_MAP[0]).base;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Solid base — smoothly transitions color when the scene changes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: base,
          transition: 'background 1.8s ease',
        }}
      />

      {/* Mouse-following spotlight — App writes the radial gradient each frame */}
      <div
        ref={ref}
        className="gpu"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${
            (BG_MAP[sceneId] || BG_MAP[0]).glow
          }80, ${base} 65%)`,
        }}
      />

      {/* Drifting ambient orbs for depth */}
      <div
        aria-hidden="true"
        className="gpu"
        style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,124,89,0.10), transparent 70%)',
          filter: 'blur(60px)',
          animation: 'leafDrift 16s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="gpu"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '6%',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.07), transparent 70%)',
          filter: 'blur(80px)',
          animation: 'leafDrift 22s ease-in-out infinite',
          animationDelay: '-7s',
        }}
      />
    </div>
  );
});

export default BackgroundFallback;
