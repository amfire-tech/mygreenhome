import { useCallback, useEffect, useRef } from 'react';

import { lerp, clamp } from './utils/math';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useMouseParallax } from './hooks/useMouseParallax';

import Nav from './components/Nav';
import HomeTour from './components/HomeTour';
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

export default function App() {
  // Smooth-scroll + mouse engines.
  const lenisRef = useScrollProgress();
  const { targetRef: mouseTargetRef, smoothRef: mouseSmoothRef } = useMouseParallax();

  // DOM refs driven directly in the rAF loop (never trigger re-renders).
  const navRef = useRef(null);

  // Plain refs (loop-local state).
  const rafRef = useRef(null);
  const navScrolledRef = useRef(false);
  const lastScrollRef = useRef(0); // for nav hide-on-scroll-down / show-on-up
  const navHiddenRef = useRef(false);
  const lastPageProgRef = useRef(-1); // skip writing --page-progress when unchanged

  // --- Global animation loop: smooth scroll, page progress, mouse easing, nav.
  //     (The Home Tour now owns its own video/scene loop — see HomeTour.jsx.)
  useEffect(() => {
    const tick = (time) => {
      const lenis = lenisRef.current;
      lenis?.raf(time);

      const scrollY = lenis ? lenis.scroll : window.scrollY;

      // Whole-page progress (drives the Living Vine + any --page-progress CSS).
      // Only write when it actually changes — avoids a style recalc every frame.
      if (lenis && lenis.limit > 0) {
        const pp = Math.round(clamp(lenis.scroll / lenis.limit, 0, 1) * 1000);
        if (pp !== lastPageProgRef.current) {
          lastPageProgRef.current = pp;
          document.documentElement.style.setProperty('--page-progress', (pp / 1000).toFixed(3));
        }
      }

      // Smooth mouse — consumed by the hero parallax + tour particles/parallax.
      const m = mouseSmoothRef.current;
      m.x = lerp(m.x, mouseTargetRef.current.x, 0.07);
      m.y = lerp(m.y, mouseTargetRef.current.y, 0.07);

      // Nav theme — transparent over the bright hero, solid dark bar past it.
      if (navRef.current) {
        const vh = window.innerHeight;
        const scrolled = scrollY > vh * 0.6;
        if (scrolled !== navScrolledRef.current) {
          navScrolledRef.current = scrolled;
          navRef.current.classList.toggle('is-scrolled', scrolled);
        }
        // Hide on scroll-down, reveal on scroll-up (standard mobile pattern).
        const dy = scrollY - lastScrollRef.current;
        let hidden = navHiddenRef.current;
        if (scrollY < vh * 0.5) hidden = false;
        else if (dy > 4) hidden = true;
        else if (dy < -4) hidden = false;
        if (hidden !== navHiddenRef.current) {
          navHiddenRef.current = hidden;
          navRef.current.classList.toggle('is-hidden', hidden);
        }
        lastScrollRef.current = scrollY;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [lenisRef, mouseSmoothRef, mouseTargetRef]);

  // --- Navigation: every target is a section id ('contact', 'tour', 'hero'…).
  const handleNavigate = useCallback(
    (target) => {
      const lenis = lenisRef.current;
      const sel = `#${target}`;
      if (lenis) lenis.scrollTo(sel);
      else document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    },
    [lenisRef]
  );

  return (
    <div>
      {/* Persistent overlays */}
      <Nav ref={navRef} onNavigate={handleNavigate} />

      {/* ─── ACT 0 — BRIGHT, REFRESHING HERO ─── */}
      <HeroIntro onTour={() => handleNavigate('tour')} mouseRef={mouseSmoothRef} />

      {/* ─── HOME TOUR — auto-looping walkthrough · scene-synced cards ─── */}
      <HomeTour mouseRef={mouseSmoothRef} />

      {/* ─── BEFORE / AFTER TRANSFORMATIONS — scroll-swapped big cards ─── */}
      <Transformations />

      {/* ─── SMART GREEN ECOSYSTEM — Neobot controller showcase ─── */}
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
