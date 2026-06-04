import { forwardRef, useState } from 'react';

// Scroll-synced video background — the heart of the experience.
//
// We never call play(): App.jsx drives `video.currentTime` from scroll progress
// in its rAF loop. The walkthrough is encoded all-intra (every frame a keyframe)
// so seeking is instant — that's what keeps the scrub smooth.
//
// A cinematic colour grade (CSS filter + layered emerald/vignette overlays)
// turns the bright daytime render into a moody, premium dusk look so the cream
// + gold UI pops instead of washing out.
//
// Props:
//   onLoad(durationSeconds) — fired when first frame is decoded & duration known
//   onError()               — fired if the video fails (fallback bg shows through)
const VideoLayer = forwardRef(function VideoLayer({ onLoad, onError }, ref) {
  const [ready, setReady] = useState(false);

  const handleLoadedData = (e) => {
    const v = e.currentTarget;
    v.pause(); // we control time manually — never autoplay
    setReady(true);
    onLoad?.(Number.isFinite(v.duration) ? v.duration : null);
  };

  return (
    <>
      <video
        ref={ref}
        src="/video/walkthrough.mp4"
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        controls={false}
        disablePictureInPicture
        onLoadedMetadata={(e) => e.currentTarget.pause()}
        onLoadedData={handleLoadedData}
        onError={() => onError?.()}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          opacity: ready ? 1 : 0,
          transition: 'opacity 1s var(--ease-smooth)',
          pointerEvents: 'none',
          // Brighter, sunlit grade — lifted exposure, gentle contrast/warmth.
          filter: 'brightness(1.06) contrast(1.05) saturate(1.12)',
        }}
      />

      {/* Soft top/bottom shaping only (z 2) — keeps the frame luminous. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(6,16,11,0.34) 0%, rgba(6,20,13,0.04) 26%, rgba(6,18,12,0.0) 58%, rgba(3,10,7,0.62) 100%)',
        }}
      />

      {/* Gentle symmetric vignette (z 3) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background:
            'radial-gradient(130% 110% at 50% 42%, transparent 54%, rgba(3,10,7,0.28) 84%, rgba(2,7,5,0.5) 100%)',
        }}
      />
    </>
  );
});

export default VideoLayer;
