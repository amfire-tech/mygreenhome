import { useCallback, useEffect, useRef, useState } from 'react';

import { SCENES, VIDEO_DURATION } from './constants/scenes';
import { PLANT_CARDS } from './constants/plants';
import { lerp, clamp } from './utils/math';
import { getActiveScene } from './utils/sceneDetect';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useMouseParallax } from './hooks/useMouseParallax';

import Nav from './components/Nav';
import VideoLayer from './components/VideoLayer';
import BackgroundFallback, { BG_MAP } from './components/BackgroundFallback';
import ParticleCanvas from './components/ParticleCanvas';
import TourCard from './components/TourCard';
import AirCheck from './components/AirCheck';
import Transformations from './components/Transformations';
import SmartEcosystem from './components/SmartEcosystem';
import GreenAdvantages from './components/GreenAdvantages';
import PlantExplorer from './components/PlantExplorer';
import ImpactStats from './components/ImpactStats';
import PricingSection from './components/PricingSection';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';

import HeroIntro from './components/HeroIntro';

// #rrggbb → {r,g,b}
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

export default function App() {
  // State — only changes that genuinely need a React re-render.
  const [sceneId, setSceneId] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Smooth-scroll + mouse engines.
  const lenisRef = useScrollProgress();
  const { targetRef: mouseTargetRef, smoothRef: mouseSmoothRef } = useMouseParallax();

  // DOM refs driven directly in the rAF loop (never trigger re-renders).
  const scrollContainerRef = useRef(null);
  const stickyRef = useRef(null); // holds --par-x/--par-y for video + card tilt
  const videoRef = useRef(null);
  const bgLayerRef = useRef(null);
  const navRef = useRef(null);

  // Plain refs (loop-local state).
  const rafRef = useRef(null);
  const stageTopRef = useRef(0); // document Y where the Home Tour stage begins
  const stickyMaxRef = useRef(0);
  const durationRef = useRef(VIDEO_DURATION);
  const videoPlayheadRef = useRef(0);
  const navScrolledRef = useRef(false);
  const currentSceneIdRef = useRef(0);
  const glowRef = useRef(hexToRgb(BG_MAP[0].glow));

  // --- Measure the sticky stage scroll span (and keep it fresh on resize).
  useEffect(() => {
    const measure = () => {
      const el = scrollContainerRef.current;
      if (el) {
        stageTopRef.current = el.offsetTop; // tour now sits below the bright hero
        stickyMaxRef.current = Math.max(1, el.offsetHeight - window.innerHeight);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    // Re-measure after layout settles (fonts, mobile URL bar, etc.).
    const t = setTimeout(measure, 400);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  // --- The single source-of-truth animation loop.
  useEffect(() => {
    const tick = (time) => {
      const lenis = lenisRef.current;
      lenis?.raf(time);

      // 1. Tour progress (0..1), measured from where the stage begins — it now
      //    sits below the bright hero, so subtract the stage's document offset.
      const scrollY = lenis ? lenis.scroll : window.scrollY;
      const sp = clamp((scrollY - stageTopRef.current) / (stickyMaxRef.current || 1), 0, 1);

      // 1a. Whole-page progress (drives the Living Vine + any --page-progress CSS).
      if (lenis && lenis.limit > 0) {
        document.documentElement.style.setProperty('--page-progress', clamp(lenis.scroll / lenis.limit, 0, 1).toFixed(4));
      }

      // 2. Smooth mouse.
      const m = mouseSmoothRef.current;
      m.x = lerp(m.x, mouseTargetRef.current.x, 0.07);
      m.y = lerp(m.y, mouseTargetRef.current.y, 0.07);
      const rx = m.x;
      const ry = m.y;

      // 3. Scene detection — re-render only when the scene actually changes.
      const newScene = getActiveScene(sp);
      if (newScene.id !== currentSceneIdRef.current) {
        currentSceneIdRef.current = newScene.id;
        setSceneId(newScene.id);
      }
      const sceneIdNow = currentSceneIdRef.current;

      // 4. Video scrubbing — driven purely by scroll (all-intra = instant seeks).
      //    A light playhead ease keeps the frame gliding; no idle motion, so the
      //    video is perfectly still whenever you stop scrolling.
      const video = videoRef.current;
      if (video && videoLoaded) {
        const dur = durationRef.current || VIDEO_DURATION;
        const ph = videoPlayheadRef;
        ph.current = lerp(ph.current, sp * dur, 0.3);
        if (sp <= 0.001) ph.current = 0;
        else if (sp >= 0.999) ph.current = dur;
        if (Math.abs(video.currentTime - ph.current) > 0.004) {
          try {
            video.currentTime = ph.current;
          } catch {
            /* seek not ready yet — ignore */
          }
        }
      }

      // 6. Nav theme — transparent over the bright hero, then a solid dark bar
      //    once you scroll past it (readable over every section below).
      if (navRef.current) {
        const scrolled = scrollY > window.innerHeight * 0.6;
        if (scrolled !== navScrolledRef.current) {
          navScrolledRef.current = scrolled;
          navRef.current.classList.toggle('is-scrolled', scrolled);
        }
      }

      // 7. Mouse parallax — one set of vars on the sticky drives both the
      //    contained video panel and the 3D-glass detail card tilt.
      if (stickyRef.current) {
        stickyRef.current.style.setProperty('--par-x', rx.toFixed(3));
        stickyRef.current.style.setProperty('--par-y', ry.toFixed(3));
      }

      // 8. Background spotlight — lerp glow color across scenes + follow mouse.
      if (bgLayerRef.current) {
        const tgt = hexToRgb((BG_MAP[sceneIdNow] || BG_MAP[0]).glow);
        const g = glowRef.current;
        g.r = lerp(g.r, tgt.r, 0.04);
        g.g = lerp(g.g, tgt.g, 0.04);
        g.b = lerp(g.b, tgt.b, 0.04);
        const cx = 50 + rx * 8;
        const cy = 50 + ry * 8;
        bgLayerRef.current.style.background = `radial-gradient(ellipse at ${cx}% ${cy}%, rgba(${g.r | 0}, ${g.g | 0}, ${g.b | 0}, 0.5), transparent 65%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoLoaded, lenisRef, mouseSmoothRef, mouseTargetRef]);

  // --- Navigation: numbers = a fraction of the Home Tour stage (offset by the
  //     hero above it); strings = a section id ('contact', 'tour', 'hero'…).
  const handleNavigate = useCallback(
    (target) => {
      const lenis = lenisRef.current;
      if (typeof target === 'string') {
        const sel = `#${target}`;
        if (lenis) lenis.scrollTo(sel);
        else document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const y = stageTopRef.current + target * stickyMaxRef.current;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [lenisRef]
  );

  return (
    <div>
      {/* Persistent overlays */}
      <Nav ref={navRef} onNavigate={handleNavigate} />

      {/* ─── ACT 0 — BRIGHT, REFRESHING HERO ─── */}
      <HeroIntro onTour={() => handleNavigate('tour')} mouseRef={mouseSmoothRef} />

      {/* ─── HOME TOUR — SCROLL-SYNCED CINEMA (video left · detail card right) ─── */}
      <div ref={scrollContainerRef} id="tour" className="scroll-stage">
        <div ref={stickyRef} className="scroll-stage__sticky tour-split">
          {/* Ambient background + particles (z 0–4) */}
          <BackgroundFallback ref={bgLayerRef} sceneId={sceneId} />
          <ParticleCanvas mouseRef={mouseSmoothRef} />

          {/* Section heading */}
          <div className="tour-heading">
            <span className="tour-heading__eyebrow font-body">The Home Tour</span>
            <h2 className="tour-heading__title font-display">A Walk Through Your Green Home</h2>
          </div>

          {/* Left — contained scroll-synced walkthrough (held still) */}
          <div className="tour-video">
            <VideoLayer
              ref={videoRef}
              onLoad={(d) => {
                if (d) durationRef.current = d;
                setVideoLoaded(true);
              }}
              onError={() => setVideoLoaded(false)}
            />
            <span className="tour-video__label font-body">Live Walkthrough</span>
          </div>

          {/* Right — detail card on a stack of pages, one scene at a time */}
          <div className="tour-stage">
            <div className="tour-tilt">
              <span className="tour-deck tour-deck--3" aria-hidden="true" />
              <span className="tour-deck tour-deck--2" aria-hidden="true" />
              <span className="tour-deck tour-deck--1" aria-hidden="true" />
              <TourCard key={sceneId} scene={SCENES[sceneId]} cards={PLANT_CARDS[sceneId]} sceneId={sceneId} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── BEFORE / AFTER TRANSFORMATIONS — scroll-swapped big cards ─── */}
      <Transformations />

      {/* ─── SMART GREEN ECOSYSTEM — Skillbot controller showcase ─── */}
      <SmartEcosystem />

      {/* ─── LIVE AIR-QUALITY REALITY CHECK — your city vs a green home ─── */}
      <AirCheck />

      {/* ─── 7 ADVANTAGES vs A NORMAL HOME — research-backed (id="why") ─── */}
      <GreenAdvantages />

      {/* ─── THE LIVING LIBRARY — dark plant explorer (bridges into ivory) ─── */}
      <PlantExplorer />

      {/* ─── CLOSING SECTIONS (unified dark) ─── */}
      <div className="act2">
        <ImpactStats />
        <PricingSection />
        <Testimonials />
        <FAQ />
        <ContactSection />
        <Footer />
      </div>

      {/* Persistent floating WhatsApp */}
      <WhatsAppFab />
    </div>
  );
}
