import { useEffect, useRef, useState } from 'react';

import { SCENES, VIDEO_DURATION } from '../constants/scenes';
import { PLANT_CARDS } from '../constants/plants';
import { lerp } from '../utils/math';
import BackgroundFallback, { BG_MAP } from './BackgroundFallback';
import ParticleCanvas from './ParticleCanvas';
import TourCard from './TourCard';

// The video glides at a calm, cinematic pace (0.6× ≈ a 31s loop) instead of the
// old scroll-scrub. Bump toward 1 for faster, down for slower.
const PLAYBACK_RATE = 0.6;

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

// Which scene owns a given video time (seconds) — last scene whose range started.
const sceneForTime = (t) => {
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (t >= SCENES[i].videoRange[0]) return i;
  }
  return 0;
};

// ─── HOME TOUR ──────────────────────────────────────────────────────────────
// A self-contained, auto-looping walkthrough: the clip plays slowly on a loop
// and the detail card on the right swaps to match whatever zone is on screen.
// Press-and-hold the card to pause; release to resume. Tap a dot to jump.
export default function HomeTour({ mouseRef }) {
  const [sceneId, setSceneId] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [src, setSrc] = useState(null);

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const glowRef = useRef(null); // BackgroundFallback's spotlight layer
  const progressRef = useRef(null); // thin scene-progress bar fill

  const sceneNowRef = useRef(0);
  const heldRef = useRef(false); // user is pressing the card
  const inViewRef = useRef(true); // section visible → allowed to play
  const glowRgbRef = useRef(hexToRgb(BG_MAP[0].glow));
  const lastGlowKeyRef = useRef(-1);

  // Fetch the clip once as a fully-seekable in-memory blob (Cloudflare Pages
  // serves no HTTP range, so a plain <video src> can't be seeked for the
  // tap-to-jump dots — a blob URL always can). Loop + autoplay run off this.
  useEffect(() => {
    let url = null;
    let cancelled = false;
    fetch('/video/walkthrough.mp4?v=60fps')
      .then((r) => {
        if (!r.ok) throw new Error(`video ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  // Pause when scrolled out of view (battery/CPU) — but never override a hold.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting && !heldRef.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // One rAF loop owns: scene sync, the progress bar, the spotlight-colour ease,
  // and the gentle mouse parallax — all driven by the video's own playhead.
  useEffect(() => {
    let raf;
    const dur = VIDEO_DURATION;
    const tick = () => {
      const v = videoRef.current;
      if (v) {
        const t = v.currentTime || 0;
        // scene → only re-render on an actual change
        const idx = sceneForTime(t);
        if (idx !== sceneNowRef.current) {
          sceneNowRef.current = idx;
          setSceneId(idx);
        }
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${Math.min(t / dur, 1).toFixed(4)})`;
        }
        // spotlight colour eases toward the active scene; repaint only on change
        if (glowRef.current) {
          const tgt = hexToRgb((BG_MAP[idx] || BG_MAP[0]).glow);
          const g = glowRgbRef.current;
          g.r = lerp(g.r, tgt.r, 0.05);
          g.g = lerp(g.g, tgt.g, 0.05);
          g.b = lerp(g.b, tgt.b, 0.05);
          const base = (BG_MAP[idx] || BG_MAP[0]).base;
          const key = ((g.r | 0) << 16) | ((g.g | 0) << 8) | (g.b | 0);
          if (key !== lastGlowKeyRef.current) {
            lastGlowKeyRef.current = key;
            glowRef.current.style.background = `radial-gradient(ellipse at 50% 46%, rgba(${g.r | 0}, ${g.g | 0}, ${g.b | 0}, 0.5), ${base} 66%)`;
          }
        }
      }
      // subtle parallax on the whole stage (desktop pointer)
      if (sectionRef.current && mouseRef?.current) {
        sectionRef.current.style.setProperty('--par-x', mouseRef.current.x.toFixed(3));
        sectionRef.current.style.setProperty('--par-y', mouseRef.current.y.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);

  const handleLoaded = (e) => {
    const v = e.currentTarget;
    v.loop = true;
    v.playbackRate = PLAYBACK_RATE;
    setReady(true);
    if (inViewRef.current && !heldRef.current) v.play().catch(() => {});
  };

  // ── Press-and-hold the card → pause; release → resume ──
  const hold = () => {
    heldRef.current = true;
    setPaused(true);
    videoRef.current?.pause();
  };
  const release = () => {
    if (!heldRef.current) return;
    heldRef.current = false;
    setPaused(false);
    if (inViewRef.current) videoRef.current?.play().catch(() => {});
  };

  // Tap a dot → jump the playhead to that zone (and reflect it instantly).
  const jumpTo = (i) => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = SCENES[i].videoRange[0] + 0.05;
    } catch {
      /* not seekable yet */
    }
    sceneNowRef.current = i;
    setSceneId(i);
  };

  return (
    <section ref={sectionRef} id="tour" className="tour2">
      <BackgroundFallback ref={glowRef} sceneId={sceneId} />
      <ParticleCanvas mouseRef={mouseRef} />

      <div className="tour2__heading">
        <span className="tour2__eyebrow font-body">The Home Tour</span>
        <h2 className="tour2__title font-display">A Walk Through Your Green Home</h2>
      </div>

      <div className="tour2__inner">
        {/* Left — the looping walkthrough */}
        <div className="tour2__video">
          <video
            ref={videoRef}
            src={src || undefined}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            disablePictureInPicture
            onLoadedData={handleLoaded}
            className="tour2__vid"
            style={{ opacity: ready ? 1 : 0 }}
          />
          {/* cinematic shaping */}
          <span className="tour2__vid-grade" aria-hidden="true" />
          <span className="tour2__vid-vignette" aria-hidden="true" />
          <span className="tour2__label font-body">Live Walkthrough</span>
          <span className={`tour2__paused${paused ? ' is-on' : ''}`} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2.5" width="3.4" height="11" rx="1.2" />
              <rect x="9.6" y="2.5" width="3.4" height="11" rx="1.2" />
            </svg>
            Paused
          </span>
        </div>

        {/* Right — scene-synced detail card. Press-and-hold to pause. */}
        <div
          className="tour2__card"
          onPointerDown={hold}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
        >
          <TourCard
            key={sceneId}
            scene={SCENES[sceneId]}
            cards={PLANT_CARDS[sceneId]}
            sceneId={sceneId}
            index={sceneId + 1}
            total={SCENES.length}
          />
        </div>
      </div>

      {/* Scene progress + tappable dots */}
      <div className="tour2__nav">
        <span className="tour2__progress" aria-hidden="true">
          <span ref={progressRef} className="tour2__progress-fill" />
        </span>
        <div className="tour2__dots" role="tablist" aria-label="Tour scenes">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === sceneId}
              aria-label={s.zone || 'Intro'}
              className={`tour2__dot${i === sceneId ? ' is-active' : ''}`}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
