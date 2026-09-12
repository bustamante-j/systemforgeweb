export const siteConfig = {
  brandName: 'System Forge',
  tiktokHandle: '@system_forgeee',
  tiktokUrl: 'https://www.tiktok.com/@system_forgeee',
}

// The shelves of the shop, in the order they appear in the catalog. A template
// is filed on exactly one of them through its `category` field, and the catalog
// renders a section per shelf that still has something on it after the search
// and filters run — so an empty shelf costs nothing to declare and a new one
// only needs a row here plus templates pointing at it.
//
// A template carrying a category that is not listed here still shows up: the
// catalog appends the unknown shelf at the end rather than dropping the card.
export const categories = [
  {
    value: 'esports',
    label: 'Esports',
    blurb: 'Team, roster, and gaming creator pages.',
  },
  {
    value: 'interactive',
    label: 'Interactive',
    blurb: 'Scroll- and drag-driven pieces you use.',
  },
  {
    value: 'business',
    label: 'Business',
    blurb: 'Shops and services — what you sell, and where to find you.',
  },
  {
    value: 'portfolio',
    label: 'Portfolio',
    blurb: 'Personal sites for work, experience, and hiring.',
  },
]

export function categoryOf(value) {
  return (
    categories.find((category) => category.value === value) ?? {
      value,
      // An unlisted category still gets a readable shelf title rather than a
      // raw slug.
      label: value.replace(/(^|[\s-])\w/g, (letter) => letter.toUpperCase()),
      blurb: '',
    }
  )
}

// The ordering walkthrough on the contact page, in order. `detail` is the one
// line under a step; `items` is the checklist a step asks the buyer to send.
export const orderSteps = [
  {
    title: 'Screenshot the template you want',
    detail: 'Open its live preview and screenshot it, or just send the name.',
  },
  {
    title: 'Send the screenshot with your details',
    detail: 'Message us on TikTok with everything that goes on the site.',
    items: [
      'Your full name and the title you go by',
      'Photos — profile, work, projects',
      'Email, phone, and the social links you want listed',
      'Skills, tools, and the services you offer',
      'Experience, education, certifications',
      'A short about-me, plus testimonials if you have them',
      'Projects or samples to feature',
      'Your deadline, and any extra pages',
      'Colors, a resume, a domain name',
    ],
  },
  {
    title: 'Send a 50% downpayment',
    detail: 'This is what starts the build.',
  },
  {
    title: 'Wait for the build',
    detail: 'We set the template up with your content.',
  },
  {
    title: 'Review the preview',
    detail: 'We send the finished site for you to check over.',
  },
  {
    title: 'Send the remaining 50%',
    detail: 'Skip this one if you paid in full.',
  },
  {
    title: 'Get your ready-to-use link',
    detail: 'Payment clears, the live link is yours.',
  },
]

// `category` is the shelf the card is filed on — see `categories` above; it is
// the catalog's primary organisation and what the filter chips switch between.
// `status` is 'available' (live preview + order) or 'coming-soon' (teaser card:
// no demoUrl, no features — those templates are announced on TikTok first).
// `tier` is 'standard' or 'premium'; premium cards carry a mark on the card and
// the detail page, and the tier is one of the things search matches on.
//
// `description` is one line and `features` are short phrases on purpose: the
// running demo is the pitch, and the copy around it only has to say which demo
// you are looking at.
export const templates = [
  {
    id: 'neat-aesthetic',
    name: 'Neat Aesthetic',
    audience: 'Virtual assistants and service professionals',
    category: 'portfolio',
    theme: 'light',
    tier: 'standard',
    status: 'available',
    description: 'A warm, editorial portfolio for service work.',
    demoUrl: 'https://systemforge1.github.io/neataesthetic/',
    tags: ['Light', 'Editorial', 'Service portfolio'],
    features: [
      'Intro and service overview',
      'About, process, testimonials, skills, contact',
      'Responsive single page',
      'Clear calls to action for inquiries',
    ],
  },
  {
    id: 'dark-techy',
    name: 'Dark Techy',
    audience: 'Developers, IT students, and technical creatives',
    category: 'portfolio',
    theme: 'dark',
    tier: 'standard',
    status: 'available',
    description: 'A sharp dark portfolio with a technical edge.',
    demoUrl: 'https://systemforge1.github.io/darktechy/',
    tags: ['Dark', 'Technical', 'Developer portfolio'],
    features: [
      'High-contrast dark presentation',
      'Projects, skills, profile, contact',
      'Responsive single page',
      'Motion and interactive detail in the demo',
    ],
  },
  {
    id: 'adventure-dark',
    name: 'Adventure Dark',
    audience: 'Architects, designers, and architecture students',
    category: 'portfolio',
    theme: 'dark',
    tier: 'standard',
    status: 'available',
    description: 'A navy-and-gold portfolio laid out as a drawing set.',
    demoUrl: 'https://systemforge1.github.io/adventuredark/',
    tags: ['Dark', 'Editorial', 'Architecture portfolio'],
    features: [
      'Numbered sheets, A-00 through A-06',
      'Work, process, field notes, contact',
      'Phased timeline and site-section diagrams',
      'Responsive single page',
    ],
  },
  {
    id: 'bnw-aesthetic',
    name: 'BnW Aesthetic',
    audience: 'Photographers and visual storytellers',
    category: 'portfolio',
    theme: 'light',
    tier: 'premium',
    status: 'available',
    description: 'A Swiss-minimal photography portfolio on warm paper.',
    demoUrl: 'https://systemforge1.github.io/bnwaesthetic/',
    tags: ['Light', 'Minimal', 'Photography portfolio'],
    features: [
      'Ten numbered editorial sections',
      'Filterable archive of twelve projects',
      'Rates, process, clients, and FAQ',
      'Journal and inquiry form',
    ],
  },
  {
    id: 'modern-editorial',
    name: 'Modern Editorial',
    audience: 'Game developers and technical creatives',
    category: 'portfolio',
    theme: 'light',
    tier: 'premium',
    status: 'available',
    description: 'A print-inspired portfolio in black, white, and signal yellow.',
    demoUrl: 'https://systemforge1.github.io/moderneditorial/',
    tags: ['Light', 'Editorial', 'Developer portfolio'],
    features: [
      'Five numbered sections, index to contact',
      'Hover-driven project list with a preview card',
      'Toolkit grid and a dated track record',
      'Light, dark, and system themes',
    ],
  },
  {
    id: 'simple-medium',
    name: 'Simple Medium',
    audience: 'Call center agents and customer support professionals',
    category: 'portfolio',
    theme: 'light',
    tier: 'premium',
    status: 'available',
    description: 'A corporate-blue profile site that reads like a hiring brief.',
    demoUrl: 'https://systemforge1.github.io/simplemedium/',
    tags: ['Light', 'Corporate', 'Professional portfolio'],
    features: [
      'Hero with headline stats and a tools marquee',
      'About, services, experience, testimonials, contact',
      'Skill meters and animated counters',
      'Responsive single page with a mobile menu',
    ],
  },
  {
    id: 'blckvoid',
    name: 'BLCKVOID',
    audience: 'Esports clans and competitive gaming teams',
    category: 'esports',
    theme: 'dark',
    tier: 'premium',
    status: 'available',
    description: 'A brutalist team site for a Call of Duty: Mobile division.',
    demoUrl: 'https://systemforge1.github.io/blckvoid/',
    tags: ['Dark', 'Brutalist', 'Esports team'],
    features: [
      'Origin, squad, campaigns, contact',
      'A roster card per operator, with callsign and role',
      'Campaign log with mode and placement',
      'Dark and light themes, responsive',
    ],
  },
  {
    id: 'leanardjude',
    name: 'Tactical Dossier',
    audience: 'Competitive players and gaming creators',
    category: 'esports',
    theme: 'dark',
    tier: 'premium',
    status: 'available',
    description: 'A player dossier laid out like an in-game profile.',
    demoUrl: 'https://systemforge1.github.io/leanardjude/',
    tags: ['Dark', 'Tactical', 'Gaming profile'],
    features: [
      'Profile, rank, role, stats, team, records',
      'Three loadout pages with a gunsmith sheet',
      'Ranked season stats and a major-events log',
      'Responsive single page with a mobile menu',
    ],
  },
  {
    id: 'depth',
    name: 'Depth',
    audience: 'Science communicators and climate educators',
    category: 'interactive',
    theme: 'dark',
    tier: 'premium',
    status: 'available',
    description: 'A 3D sea-level exhibit — raise the water, watch the coast go under.',
    demoUrl: 'https://systemforge1.github.io/depth/',
    tags: ['Dark', 'WebGL', 'Data exhibit'],
    features: [
      'Draggable tide staff, zero to fifty metres',
      'Orbitable 3D archipelago transect',
      'Encroachment and population readouts',
      'Method, sources, and stated limits',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    audience: 'Educators and science storytellers',
    category: 'interactive',
    theme: 'dark',
    tier: 'premium',
    status: 'available',
    description: 'A scroll-driven zoom through eighteen stages of size.',
    demoUrl: 'https://systemforge1.github.io/scale/',
    tags: ['Dark', 'Scroll-driven', 'Science explainer'],
    features: [
      'Eighteen stages on one continuous zoom',
      'A stage counter and fact panel that follow it',
      'Jump to any stage, restart, or mute',
      'Scroll and keyboard navigation',
    ],
  },
  {
    id: 'tile-showroom',
    name: 'Tile Showroom',
    audience: 'Tile shops, hardware stores, and local showrooms',
    category: 'business',
    theme: 'light',
    tier: 'premium',
    status: 'available',
    description: 'A showroom site for a tile and hardware shop, built on its own photos.',
    demoUrl: 'https://randmtiles.vercel.app/',
    tags: ['Light', 'Showroom', 'Local business'],
    features: [
      'Collections by material, shot in the shop',
      'Showroom gallery and browsing by space',
      'Completed orders and the delivery area',
      'Address, phone numbers, and directions',
    ],
  },
  {
    id: 'soft-studio',
    name: 'Soft Studio',
    audience: 'Photographers and creative studios',
    category: 'portfolio',
    theme: 'light',
    tier: 'standard',
    status: 'coming-soon',
    description: 'A gallery-first portfolio with room for large images.',
    tags: ['Light', 'Gallery', 'Studio portfolio'],
  },
  {
    id: 'neon-grid',
    name: 'Neon Grid',
    audience: 'Game developers and motion designers',
    category: 'portfolio',
    theme: 'dark',
    tier: 'standard',
    status: 'coming-soon',
    description: 'A neon-lit dark layout with a grid-driven project wall.',
    tags: ['Dark', 'Neon', 'Showcase portfolio'],
  },
]

// The three templates the landing page puts on the floor, in the order they are
// laid out there. Data, like everything else here: swapping what the front door
// shows is a change to this list and nothing else.
export const featuredIds = ['blckvoid', 'scale', 'depth']

export function featuredTemplates() {
  return featuredIds.map(getTemplateById).filter(Boolean)
}

export function getTemplateById(templateId) {
  return templates.find((template) => template.id === templateId)
}

// The theme already has a badge of its own, so the tag that repeats it is
// dropped from the list. The search index still carries it — filtering the
// display must not make a template unfindable by the word on it.
export function visibleTags(template) {
  return template.tags.filter((tag) => tag.toLowerCase() !== template.theme)
}
