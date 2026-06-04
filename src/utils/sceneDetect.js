import { SCENES } from '../constants/scenes';

// Returns the active scene object for a given global scroll progress (0..1).
export function getActiveScene(progress) {
  return (
    SCENES.find((s) => progress >= s.scrollRange[0] && progress < s.scrollRange[1]) ||
    SCENES[SCENES.length - 1]
  );
}

// Returns local progress (0..1) within a scene's own scroll range.
export function getSceneProgress(scene, scrollProgress) {
  const range = scene.scrollRange[1] - scene.scrollRange[0];
  if (range <= 0) return 0;
  return Math.max(0, Math.min(1, (scrollProgress - scene.scrollRange[0]) / range));
}
