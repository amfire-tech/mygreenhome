import { forwardRef } from 'react';

// Zone label + headline for scenes 1–5.
//
// forwardRef → outer wrapper. App.jsx drives its `opacity` (scene-progress
// fade in/out) and `transform` (mouse parallax). The inner block is keyed by
// `sceneId` so it re-mounts on every scene change and replays its fadeUp.
const SceneOverlay = forwardRef(function SceneOverlay({ scene, sceneId }, ref) {
  const active = scene && scene.zone != null;
  const isSmart = sceneId === 5;

  return (
    <div
      ref={ref}
      className="stage-text scene-overlay gpu"
      style={{
        opacity: 0, // App controls this each frame
        pointerEvents: 'none',
      }}
    >
      {active && (
        <div key={sceneId}>
          {/* Zone badge */}
          <div
            className="inline-flex items-center"
            style={{
              gap: 8,
              padding: '6px 13px',
              borderRadius: 999,
              background: 'rgba(74,124,89,0.12)',
              border: '1px solid rgba(74,124,89,0.4)',
              marginBottom: 18,
              animation: 'fadeUp 0.6s var(--ease-smooth) both',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#4a7c59',
                animation: isSmart ? 'pulse 2s ease-in-out infinite' : 'none',
              }}
            />
            <span
              className="font-body uppercase"
              style={{ fontSize: 9, letterSpacing: '0.2em', color: '#4a7c59' }}
            >
              {scene.zone}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-cream" style={{ fontWeight: 700, lineHeight: 1.04 }}>
            <span
              className="block"
              style={{
                fontSize: 'clamp(30px, 5vw, 62px)',
                animation: 'fadeUp 0.6s var(--ease-smooth) both',
              }}
            >
              {scene.headline[0]}
            </span>
            <span
              className="block"
              style={{
                fontSize: 'clamp(30px, 5vw, 62px)',
                animation: 'fadeUp 0.6s var(--ease-smooth) 0.12s both',
              }}
            >
              {scene.headline[1]}
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="font-body"
            style={{
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 300,
              marginTop: 16,
              color: 'rgba(245,240,232,0.5)',
              animation: 'fadeUp 0.6s var(--ease-smooth) 0.25s both',
            }}
          >
            {scene.sub}
          </p>
        </div>
      )}
    </div>
  );
});

export default SceneOverlay;
