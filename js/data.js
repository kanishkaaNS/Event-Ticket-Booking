// ==========================================================================
// OVATION — Events Data & Helpers
// ==========================================================================

const CATEGORIES = [
  "Music",
  "Conference",
  "Comedy",
  "Arts",
  "Food",
  "Sports",
  "Theater",
  "Nightlife",
];

const EVENTS = [
  {
    slug: "aurora-nights-festival",
    title: "Aurora Nights Festival",
    category: "Music",
    date: "2026-07-18T19:00:00",
    doors: "7:00 PM",
    venue: "Riverside Grounds",
    city: "Portland, OR",
    image: "images/event-festival.png",
    summary: "Two stages, one unforgettable night under the open sky.",
    description: [
      "Aurora Nights returns for its sixth year with a headline lineup spanning indie, electronic, and live orchestral sets.",
      "Set across the Riverside Grounds, the festival features two stages, a curated food village, and an immersive light installation that comes alive after sundown.",
    ],
    lineup: ["Nova Hart", "The Glass Animals", "Kaelo", "Midnight Theory", "Lumen"],
    featured: true,
    tiers: [
      { id: "ga", name: "General Admission", description: "Standing access to both stages", price: 89, available: 240 },
      { id: "vip", name: "VIP", description: "Front section, dedicated bar, fast entry", price: 189, available: 60 },
      { id: "platinum", name: "Platinum", description: "Backstage lounge, artist meet & greet", price: 349, available: 12 },
    ],
  },
  {
    slug: "frontier-tech-summit",
    title: "Frontier Tech Summit",
    category: "Conference",
    date: "2026-09-09T09:00:00",
    doors: "8:30 AM",
    venue: "Metro Convention Center",
    city: "Austin, TX",
    image: "images/event-conference.png",
    summary: "A full day of keynotes from the people building what's next.",
    description: [
      "Frontier brings together founders, engineers, and designers for a single day of sharp talks on AI, infrastructure, and product craft.",
      "Includes access to all keynote sessions, breakout workshops, and the evening networking reception.",
    ],
    lineup: ["Keynote: The Next Interface", "Scaling to a Billion Requests", "Design in the Age of AI"],
    featured: true,
    tiers: [
      { id: "standard", name: "Standard", description: "All talks and breakout sessions", price: 249, available: 180 },
      { id: "pro", name: "Pro", description: "Reserved seating + workshop track", price: 449, available: 80 },
      { id: "exec", name: "Executive", description: "Speaker dinner + lounge access", price: 899, available: 20 },
    ],
  },
  {
    slug: "midnight-laughs",
    title: "Midnight Laughs: Live Stand-Up",
    category: "Comedy",
    date: "2026-06-27T21:00:00",
    doors: "8:30 PM",
    venue: "The Cellar Room",
    city: "Chicago, IL",
    image: "images/event-comedy.png",
    summary: "A late-night lineup of the city's sharpest comedians.",
    description: [
      "Five comics. One mic. An intimate basement room where anything can happen.",
      "Hosted by a rotating cast of headliners, Midnight Laughs is the after-dark show locals can't stop talking about.",
    ],
    lineup: ["Dani Cross", "Marco Reyes", "The Late Set Crew"],
    tiers: [
      { id: "ga", name: "General Seating", description: "First-come table seating", price: 35, available: 90 },
      { id: "front", name: "Front Row", description: "Reserved seats by the stage", price: 65, available: 24 },
    ],
  },
  {
    slug: "form-and-light",
    title: "Form & Light: Modern Art Exhibition",
    category: "Arts",
    date: "2026-08-02T11:00:00",
    doors: "11:00 AM",
    venue: "Hartwell Gallery",
    city: "New York, NY",
    image: "images/event-art.png",
    summary: "A month-long survey of contemporary sculpture and light.",
    description: [
      "Form & Light gathers more than forty works exploring space, shadow, and material from a new generation of artists.",
      "Your timed-entry ticket includes the full exhibition and the accompanying audio guide.",
    ],
    tiers: [
      { id: "day", name: "Day Pass", description: "Timed entry, valid all day", price: 28, available: 300 },
      { id: "patron", name: "Patron", description: "Priority entry + catalog", price: 75, available: 50 },
    ],
  },
  {
    slug: "harvest-food-fair",
    title: "Harvest Food & Wine Fair",
    category: "Food",
    date: "2026-10-04T16:00:00",
    doors: "4:00 PM",
    venue: "Market Square",
    city: "Napa, CA",
    image: "images/event-food.png",
    summary: "Taste your way through the season's best kitchens and cellars.",
    description: [
      "An open-air evening of tastings from acclaimed chefs and local wineries under a canopy of lights.",
      "Tickets include a tasting glass and tokens redeemable across all stalls.",
    ],
    tiers: [
      { id: "taster", name: "Taster", description: "10 tasting tokens + glass", price: 55, available: 200 },
      { id: "gourmet", name: "Gourmet", description: "Unlimited tastings + chef demo", price: 120, available: 70 },
    ],
  },
  {
    slug: "city-classic-basketball",
    title: "City Classic: Championship Game",
    category: "Sports",
    date: "2026-11-15T18:30:00",
    doors: "5:30 PM",
    venue: "Summit Arena",
    city: "Denver, CO",
    image: "images/event-basketball.png",
    summary: "The season finale. Two rivals. One title on the line.",
    description: [
      "Witness the championship decider live as the city's two top teams meet for the trophy.",
      "All seating is reserved. Arrive early for the pre-game show.",
    ],
    tiers: [
      { id: "upper", name: "Upper Bowl", description: "Elevated end seating", price: 45, available: 500 },
      { id: "lower", name: "Lower Bowl", description: "Sideline seating", price: 110, available: 220 },
      { id: "court", name: "Courtside", description: "Front-row courtside seats", price: 380, available: 16 },
    ],
  },
  {
    slug: "the-velvet-stage",
    title: "The Velvet Stage: A Theatrical Revival",
    category: "Theater",
    date: "2026-09-21T20:00:00",
    doors: "7:15 PM",
    venue: "Grand Royale Theatre",
    city: "Boston, MA",
    image: "images/event-theater.png",
    summary: "A reimagined classic, staged in full period grandeur.",
    description: [
      "A celebrated director returns with a lavish revival, complete with a live orchestra and an award-winning cast.",
      "Performances run for a limited six-week season.",
    ],
    tiers: [
      { id: "balcony", name: "Balcony", description: "Upper-level seating", price: 60, available: 150 },
      { id: "orchestra", name: "Orchestra", description: "Main floor, center", price: 130, available: 120 },
      { id: "box", name: "Private Box", description: "Premium box for up to four", price: 420, available: 8 },
    ],
  },
  {
    slug: "pulse-after-dark",
    title: "Pulse: After Dark",
    category: "Nightlife",
    date: "2026-07-04T22:00:00",
    doors: "10:00 PM",
    venue: "Warehouse 9",
    city: "Miami, FL",
    image: "images/event-club.png",
    summary: "An all-night warehouse set from international headline DJs.",
    description: [
      "Pulse takes over Warehouse 9 for a single night of pounding sound and a custom light rig.",
      "21+. Doors at 10 PM, music until sunrise.",
    ],
    lineup: ["DJ Vesper", "Sonic Bloom", "Resident: KIRA"],
    tiers: [
      { id: "ga", name: "General Admission", description: "Main floor access", price: 40, available: 400 },
      { id: "vip", name: "VIP Table", description: "Reserved table + bottle service", price: 600, available: 18 },
    ],
  },
];

// Helper to get a specific event by slug
function getEvent(slug) {
  return EVENTS.find((e) => e.slug === slug);
}

// Helper to get featured events
function getFeaturedEvents() {
  return EVENTS.filter((e) => e.featured);
}

// Format an ISO date string into useful parts
function formatEventDate(iso) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

// Export for module usage (if using type="module"), or just leave in global scope
window.OvationData = {
  CATEGORIES,
  EVENTS,
  getEvent,
  getFeaturedEvents,
  formatEventDate,
};
