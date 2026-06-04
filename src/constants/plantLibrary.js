// MyGreenHome plant library — data transcribed from the brand catalogue.
// Images are real catalogue renders extracted to /images/plants/<slug>.jpg.

export const PLANT_CATEGORIES = ['All', 'Indoor', 'Outdoor', 'Climbing', 'Kitchen'];

export const CATEGORY_ACCENT = {
  Indoor: '#2f6b46',
  Outdoor: '#5a8a4a',
  Climbing: '#b04a6a',
  Kitchen: '#7a8c2e',
};

export const PLANTS = [
  // ── INDOOR ──────────────────────────────────────────────
  {
    slug: 'snake-plant', name: 'Snake Plant', botanical: 'Sansevieria trifasciata', category: 'Indoor',
    tagline: 'Tough. Timeless. Air-purifying.',
    light: 'Low to bright indirect', water: 'Every 2–3 weeks', height: '1–3 ft',
    benefits: ['Releases oxygen at night', 'Removes indoor toxins', 'Thrives on neglect'],
    fact: 'NASA lists it among the top air-purifying plants — removing up to 107 toxins.',
  },
  {
    slug: 'zz-plant', name: 'ZZ Plant', botanical: 'Zamioculcas zamiifolia', category: 'Indoor',
    tagline: 'Glossy, elegant & effortless.',
    light: 'Low to bright indirect', water: 'Every 2–3 weeks', height: '2–3 ft',
    benefits: ['Thrives in low light', 'Survives weeks without water', 'Air purifying'],
    fact: 'Stores water in its thick rhizomes to survive long dry spells.',
  },
  {
    slug: 'rubber-plant', name: 'Rubber Plant', botanical: 'Ficus elastica', category: 'Indoor',
    tagline: 'Bold beauty for modern interiors.',
    light: 'Bright indirect (tolerates low)', water: 'When top 1–2 in dry', height: '4–8 ft',
    benefits: ['Large glossy statement leaves', 'Improves air quality', 'Long-lasting & hardy'],
    fact: 'Its latex sap was once used to make rubber.',
  },
  {
    slug: 'aglaonema', name: 'Aglaonema', botanical: 'Aglaonema spp.', category: 'Indoor',
    tagline: 'Vibrant beauty for every corner.',
    light: 'Low to bright indirect', water: 'When top 1–2 in dry', height: '1–3 ft',
    benefits: ['Colorful patterned foliage', 'Thrives in low light', 'Easy to care for'],
    fact: "Also called 'Chinese Evergreen' — it stays lush all year round.",
  },
  {
    slug: 'money-plant', name: 'Money Plant', botanical: 'Epipremnum aureum', category: 'Indoor',
    tagline: 'Air purifier. Good fortune.',
    light: 'Low to bright indirect', water: 'When top inch dry', height: 'Trails 3–10 ft',
    benefits: ['Purifies the air', 'Grows in water or soil', 'Brings positive energy'],
    fact: 'Can grow indefinitely in just a jar of water.',
  },
  {
    slug: 'travelers-palm', name: "Traveler's Palm", botanical: 'Ravenala madagascariensis', category: 'Indoor',
    tagline: 'Bold elegance. Tropical impact.',
    light: 'Bright indirect to direct', water: 'Keep evenly moist', height: '6–10 ft',
    benefits: ['Dramatic fan-shaped canopy', 'Purifies the air', 'Resort-like statement'],
    fact: 'Stores water in its leaf bases — travellers once drank from it.',
  },

  // ── OUTDOOR ─────────────────────────────────────────────
  {
    slug: 'areca-palm', name: 'Areca Palm', botanical: 'Dypsis lutescens', category: 'Outdoor',
    tagline: 'Natural privacy. Tropical elegance.',
    light: 'Partial to full sun', water: 'When top inch dry', height: '6–12 ft',
    benefits: ['Natural air purifier', 'Creates green privacy', 'Adds tropical luxury'],
    fact: 'Releases moisture into the air — a natural humidifier.',
  },
  {
    slug: 'croton', name: 'Croton', botanical: 'Codiaeum variegatum', category: 'Outdoor',
    tagline: 'Colorful foliage. Effortless vibrance.',
    light: 'Bright / partial sun', water: 'When top inch dry', height: '2–4 ft',
    benefits: ['Bright multicolored leaves', 'All-season color', 'Low maintenance'],
    fact: 'More sunlight means deeper, brighter leaf colors.',
  },
  {
    slug: 'ficus-panda', name: 'Ficus Panda', botanical: 'Ficus microcarpa', category: 'Outdoor',
    tagline: 'Compact beauty. Timeless elegance.',
    light: 'Bright indirect to partial', water: 'When top inch dry', height: '2–4 ft',
    benefits: ['Neat bonsai-like form', 'Evergreen & resilient', 'Air purifying'],
    fact: 'A Ficus microcarpa variety long prized for bonsai.',
  },
  {
    slug: 'schefflera', name: 'Schefflera', botanical: 'Schefflera arboricola', category: 'Outdoor',
    tagline: 'Lush foliage. Natural charm.',
    light: 'Partial to full sun', water: 'Keep evenly moist', height: '4–8 ft',
    benefits: ['Umbrella-like leaf clusters', 'Air purifying', 'Fast growing'],
    fact: 'Named after botanist J.P.E. von Scheffler.',
  },
  {
    slug: 'canna-lily', name: 'Canna Lily', botanical: 'Canna indica', category: 'Outdoor',
    tagline: 'Bold blooms. Tropical vibes.',
    light: 'Full sun', water: 'Keep moist', height: '1–2.5 m',
    benefits: ['Bright showy flowers', 'Lush tropical foliage', 'Attracts pollinators'],
    fact: 'Not a true lily — and it loves the Indian summer.',
  },
  {
    slug: 'lemon-tree', name: 'Lemon Tree', botanical: 'Citrus limon', category: 'Outdoor',
    tagline: 'Fresh fruits. Natural goodness.',
    light: 'Full sun', water: 'When top inch dry', height: '6–12 ft',
    benefits: ['Home-grown organic lemons', 'Fragrant blossoms', 'Air purifying'],
    fact: 'One potted tree can give dozens of lemons in a season.',
  },

  // ── CLIMBING ────────────────────────────────────────────
  {
    slug: 'bougainvillea', name: 'Bougainvillea', botanical: 'Bougainvillea spp.', category: 'Climbing',
    tagline: 'Vibrant blooms. Strong climber.',
    light: 'Full sun (6+ hrs)', water: 'Deep, infrequent', height: '10–30 ft',
    benefits: ['Year-round colorful bracts', 'Covers walls & pergolas', 'Tough & drought-friendly'],
    fact: "Its 'flowers' are actually bracts protecting tiny white blooms.",
  },
  {
    slug: 'jasmine', name: 'Jasmine', botanical: 'Jasminum spp.', category: 'Climbing',
    tagline: 'Fragrant blooms. Timeless beauty.',
    light: '4–6 hrs sun', water: 'Moist, not soggy', height: '3–6 m',
    benefits: ['Intensely fragrant flowers', 'Lush green cover', 'Attracts pollinators'],
    fact: 'Jasmine opens in the evening — nature’s own perfume.',
  },
  {
    slug: 'madhumati', name: 'Madhumati', botanical: 'Quisqualis indica', category: 'Climbing',
    tagline: 'Fragrant. Color-changing beauty.',
    light: 'Full sun', water: 'Regular', height: '15–30 ft',
    benefits: ['Color-changing blooms', 'Sweet fragrance', 'Fast & vigorous'],
    fact: 'Flowers open white, turn pink, then deep red — all in one cluster.',
  },
  {
    slug: 'passion-flower', name: 'Passion Flower', botanical: 'Passiflora spp.', category: 'Climbing',
    tagline: 'Exotic blooms. Tropical beauty.',
    light: 'Full sun (6+ hrs)', water: 'Regular', height: '10–20 ft',
    benefits: ['Stunning exotic flowers', 'Evergreen privacy screen', 'Attracts pollinators'],
    fact: 'Some varieties also bear sweet, edible passion fruit.',
  },
  {
    slug: 'aparajita', name: 'Aparajita', botanical: 'Clitoria ternatea', category: 'Climbing',
    tagline: 'Vibrant blue. Natural & versatile.',
    light: 'Full sun (6+ hrs)', water: 'Regular', height: '10–20 ft',
    benefits: ['Striking blue flowers', 'Edible & antioxidant-rich', 'Easy to grow'],
    fact: 'Add lemon to its blue tea and it turns purple — a natural pH indicator.',
  },

  // ── KITCHEN ─────────────────────────────────────────────
  {
    slug: 'mint', name: 'Mint', botanical: 'Mentha spicata', category: 'Kitchen',
    tagline: 'Refreshing. Aromatic. Easy.',
    light: 'Bright indirect, 4–6 hrs', water: 'Keep moist', height: '1–2 ft',
    benefits: ['Continuous harvest', 'Aids digestion', 'Teas, chutneys & salads'],
    fact: 'Grows so eagerly it is best kept in its own pot.',
  },
  {
    slug: 'tomato', name: 'Cherry Tomato', botanical: 'Solanum lycopersicum', category: 'Kitchen',
    tagline: 'Sweet. Juicy. Nutritious.',
    light: 'Full sun, 6–8 hrs', water: 'Keep moist', height: '2–4 ft',
    benefits: ['Months of continuous harvest', 'Rich in Vitamin C', 'Salads, sauces & snacks'],
    fact: 'Home-grown tomatoes taste sweeter and pack more nutrients.',
  },
  {
    slug: 'chilli', name: 'Chilli', botanical: 'Capsicum annuum', category: 'Kitchen',
    tagline: 'Spicy. Fresh. Flavorful.',
    light: 'Full sun, 6–8 hrs', water: 'Keep moist', height: '1.5–3 ft',
    benefits: ['Abundant months-long harvest', 'Rich in Vitamin C', 'Pick green or red'],
    fact: 'Homegrown chillies are more flavorful than store-bought.',
  },
  {
    slug: 'curry-leaves', name: 'Curry Leaves', botanical: 'Murraya koenigii', category: 'Kitchen',
    tagline: 'Aromatic. Flavorful. Essential.',
    light: 'Bright sun, 4–6 hrs', water: 'When topsoil dry', height: 'Up to ~6 ft (potted)',
    benefits: ['Authentic Indian aroma', 'Continuous harvest', 'Good for hair & digestion'],
    fact: 'Curry leaves keep their aroma even after cooking.',
  },
  {
    slug: 'coriander', name: 'Coriander', botanical: 'Coriandrum sativum', category: 'Kitchen',
    tagline: 'Fresh. Aromatic. Easy.',
    light: 'Bright sun, 4–6 hrs', water: 'Keep moist', height: '1–1.5 ft',
    benefits: ['Multiple harvests', 'Rich in antioxidants', 'Garnish for everything'],
    fact: 'Both its leaves and seeds are prized in cuisines worldwide.',
  },
];
