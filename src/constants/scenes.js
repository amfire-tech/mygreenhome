// Scene definitions — scroll ranges map to video time ranges.
// Each scene's `scrollRange` is a [start, end] fraction of total page scroll (0..1).
// `videoRange` is the [start, end] time (seconds) of the walkthrough video.

export const SCENES = [
  {
    id: 0,
    zone: null,
    label: null,
    headline: ['Smart Gardens.', 'Healthy Homes.'],
    sub: 'We Design. We Set Up. We Maintain. You Enjoy.',
    scrollRange: [0, 0.15],
    videoRange: [0, 3],
  },
  {
    id: 1,
    zone: 'OUTDOOR',
    label: 'Outdoor Plants',
    headline: ['Green Spaces,', 'Better Places'],
    sub: 'Curated plants that bring life, color & fresh air to your outdoors.',
    scrollRange: [0.15, 0.3],
    videoRange: [3, 6],
  },
  {
    id: 2,
    zone: 'INDOOR',
    label: 'Indoor Plants',
    headline: ['Bring Nature', 'Inside'],
    sub: 'Transform every room into a living, breathing sanctuary of green.',
    scrollRange: [0.3, 0.5],
    videoRange: [6, 9],
  },
  {
    id: 3,
    zone: 'BALCONY',
    label: 'Balcony & Climbing',
    headline: ['Your Perfect', 'Green Corner'],
    sub: 'Climbing plants & vertical gardens redefining your balcony space.',
    scrollRange: [0.5, 0.65],
    videoRange: [9, 12],
  },
  {
    id: 4,
    zone: 'TERRACE',
    label: 'Terrace Garden',
    headline: ['Live Above', 'the Ordinary'],
    sub: 'A rooftop oasis designed to impress. A terrace garden like no other.',
    scrollRange: [0.65, 0.8],
    videoRange: [12, 15],
  },
  {
    id: 5,
    zone: 'SMART TECH',
    label: 'Smart Technology',
    headline: ['Powered by', 'Intelligence'],
    sub: 'Neobot monitors, waters & cares for your garden automatically — 24/7.',
    scrollRange: [0.8, 1.0],
    videoRange: [15, 18.633],
  },
];

export const VIDEO_DURATION = 18.633;
export const SCROLL_VH = 650; // total page scroll height (desktop)
export const SCROLL_VH_MOBILE = 700; // more breathing room on mobile
