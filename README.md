# MyGreenHome — Immersive Scroll-Synced Website

> **Smart Gardens. Healthy Homes. Better Living.**
> A cinematic single-page site where an 18.6-second walkthrough video scrubs
> frame-by-frame as you scroll — from the exterior of a luxury home through the
> indoor conservatory, balcony, terrace, and a smart rooftop garden — then
> reveals the pricing series and a WhatsApp call-to-action.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production bundle → dist/
npm run preview    # serve the production build locally → http://localhost:4173
```

> **Video asset:** the walkthrough lives at `public/video/walkthrough.mp4`. If
> it is missing or fails to load, an animated per-scene gradient background is
> shown as a graceful fallback.

> ### ⚠️ The video MUST be encoded all-intra (every frame a keyframe)
> Smooth scroll-scrubbing depends entirely on fast seeking. A normal H.264 file
> has sparse keyframes, so seeking to an arbitrary time forces the browser to
> decode many frames — that is what causes scroll lag and choppy sync. The
> shipped video is re-encoded to **all-intra 720p** (keyframe interval = 1) so
> every seek is instant. If you replace the walkthrough, re-encode it the same
> way:
>
> ```bash
> ffmpeg -i source.mp4 -vf "scale=1280:720:flags=lanczos" \
>   -c:v libx264 -preset slow -crf 22 \
>   -x264-params "keyint=1:min-keyint=1:scenecut=0" \
>   -pix_fmt yuv420p -an -movflags +faststart \
>   public/video/walkthrough.mp4
> ```
>
> Verify with `ffprobe`: I-frame count should equal the total frame count.

---

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | React 18 + Vite 5 (JavaScript / JSX)                |
| Styling        | Tailwind CSS 3 + inline styles for dynamic values   |
| Smooth scroll  | [Lenis](https://github.com/darkroomengineering/lenis) |
| Animation      | One hand-rolled `requestAnimationFrame` loop + CSS keyframes |
| Particles      | Custom `<canvas>` (no library)                      |
| Icons          | lucide-react                                        |
| Fonts          | Cormorant Garamond (display) + Outfit (body)        |

There is **no GSAP/ScrollTrigger**: frame-accurate video scrubbing is driven
directly from a single rAF loop, which is the most performant approach for this
use case. Lenis provides the premium smooth-scroll feel on top.

---

## How it works

### One animation loop, minimal re-renders
`src/App.jsx` owns a single `requestAnimationFrame` loop that:

1. Drives Lenis (`lenis.raf(time)`) — one frame source for everything.
2. Computes scroll progress **relative to the sticky stage** (`lenis.scroll /
   (stageHeight − viewport)`), so the journey maps 0→1 across the pinned
   `650vh` stage regardless of the pricing/CTA height below it.
3. Scrubs the video: `video.currentTime = progress × duration` (the real
   duration is read from the element at runtime, not hard-coded).
4. Updates the progress bar, nav fade, hero/scene parallax + opacity, plant-card
   reveal, and the mouse-following background spotlight — all via **direct DOM /
   CSS-variable writes**, never React state.

React state changes only on **scene change** (~6 times) and the **card-reveal
threshold** — so the loop runs at 60fps without re-rendering the tree.

### Scene system
Six scenes are defined in `src/constants/scenes.js`, each with a scroll range
and the plant/zone content shown there. `src/utils/sceneDetect.js` resolves the
active scene and its local progress.

### Parallax without layout fights
Plant cards and the smart panel use the `.parallax-cards` / `.parallax-panel`
classes. App writes only the `--par-x` / `--par-y` CSS variables each frame; the
base layout (right rail on desktop → bottom row / docked panel on mobile) lives
in CSS, so per-frame JS never clobbers responsive positioning.

---

## Project structure

```
src/
├── App.jsx                 # Orchestrator — the single rAF loop + layout
├── index.css               # Tokens, resets, keyframes, responsive layout classes
├── constants/              # scenes, plants, smart metrics, pricing + contact info
├── hooks/                  # useScrollProgress (Lenis), useMouseParallax, useInView
├── utils/                  # math (lerp/clamp/…), sceneDetect
└── components/             # Nav, VideoLayer, BackgroundFallback, ParticleCanvas,
                            # ScrollProgress, HeroText, SceneOverlay, PlantCard(s),
                            # SmartPanel, ScrollCue, PricingSection, PricingCard,
                            # CTASection, Footer
```

## Editing content

- **Pricing & contact** (WhatsApp / phone / email): `src/constants/pricing.js`
- **Plant cards per scene**: `src/constants/plants.js`
- **Scene headlines & scroll ranges**: `src/constants/scenes.js`
- **Neobot metrics**: `src/constants/smart.js`
- **Design tokens** (colors, fonts, spacing): `:root` in `src/index.css`

All CTAs point to WhatsApp `https://wa.me/919368408577` and `tel:+919368408577`.

---

## Accessibility & performance notes

- Respects `prefers-reduced-motion`: Lenis falls back to near-native scrolling,
  CSS transitions/animations are neutralized, and particles render static.
- The video is `muted` + `playsInline` and is **never played** — it is paused
  and scrubbed by `currentTime`, which is the reliable cross-browser technique.
- Dev/preview servers serve the video with HTTP Range (`206`) support, so
  seeking does not re-download from the start.
- Verified rendering with no console errors on desktop (1440×900) and mobile
  (390×844), including video scrubbing across all six scenes.
