// Plant card data per scene (1–4). Scene 0 = hero, scene 5 = smart panel.
export const PLANT_CARDS = {
  // Scene 1 — Outdoor
  1: [
    { name: 'Areca Palm', scientific: 'Dypsis lutescens', tag: 'Air Purifying', emoji: '🌴', accent: '#2d5a3d', fact: 'Grows 6–12 ft in pots' },
    { name: 'Croton', scientific: 'Codiaeum variegatum', tag: 'Colorful Foliage', emoji: '🍂', accent: '#8a6a2a', fact: 'Color deepens in sunlight' },
    { name: 'Ficus Panda', scientific: 'Ficus microcarpa', tag: 'Low Maintenance', emoji: '🌿', accent: '#1a4a2a', fact: 'Bonsai-like elegance' },
  ],
  // Scene 2 — Indoor
  2: [
    { name: 'Snake Plant', scientific: 'Sansevieria trifasciata', tag: 'Night Oxygen', emoji: '🌱', accent: '#1a5c3a', fact: 'Purifies air overnight' },
    { name: 'Peace Lily', scientific: 'Spathiphyllum wallisii', tag: 'Stress Relief', emoji: '🌸', accent: '#5a4a7a', fact: 'Thrives in low light' },
    { name: 'Money Plant', scientific: 'Epipremnum aureum', tag: 'Good Fortune', emoji: '💚', accent: '#2a6a3a', fact: 'Grows in water too' },
  ],
  // Scene 3 — Balcony / Climbing
  3: [
    { name: 'Bougainvillea', scientific: 'Bougainvillea spp.', tag: 'Vibrant Climber', emoji: '🌺', accent: '#8a3a5a', fact: 'Blooms almost year-round' },
    { name: 'Creeping Fig', scientific: 'Ficus pumila', tag: 'Wall Cover', emoji: '🍃', accent: '#2d5a3d', fact: 'Clings to any surface' },
    { name: "Devil's Ivy", scientific: 'Epipremnum aureum', tag: 'Air Purifier', emoji: '🌿', accent: '#3a7c5a', fact: 'Grows 10–20 ft with support' },
  ],
  // Scene 4 — Terrace
  4: [
    { name: 'Areca Palm', scientific: 'Dypsis lutescens', tag: 'Tropical Feel', emoji: '🌴', accent: '#2d5a3d', fact: 'Natural privacy screen' },
    { name: 'Bougainvillea', scientific: 'Bougainvillea spp.', tag: 'Color Bloom', emoji: '🌺', accent: '#8a3a5a', fact: 'Full sun, low water' },
    { name: 'Schefflera', scientific: 'Schefflera arboricola', tag: 'Dense Foliage', emoji: '🌿', accent: '#2a5a3a', fact: 'Umbrella-shaped leaf clusters' },
  ],
};
