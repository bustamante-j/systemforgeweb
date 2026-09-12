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
    value: 'portfolio',
    label: 'Portfolio',
    blurb: 'Personal sites for showing work, experience, and how to hire you.',
  },
  {
    value: 'business',
    label: 'Business',
    blurb: 'Sites for a company or a service — what you offer and how to buy it.',
  },
  {
    value: 'esports',
    label: 'Esports',
    blurb: 'Team, roster, and gaming creator pages built for a louder audience.',
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

// The short version of the ordering walkthrough, shown under the catalog. The
// full seven steps live on the contact page.
export const orderSummary = [
  {
    title: 'Pick a template',
    detail: 'Browse the live previews and send us the name of the one you want.',
  },
  {
    title: 'Send your details',
    detail: 'Your content and a 50% downpayment, over TikTok messages.',
  },
  {
    title: 'Get your link',
    detail: 'We build it, you review the preview, then the site is yours.',
  },
]

// The ordering walkthrough on the contact page, in order. `detail` is the one
// line under a step; `items` is the checklist a step asks the buyer to send.
export const orderSteps = [
  {
    title: 'Screenshot the template you want',
    detail:
      'Open its live preview here and take a screenshot, or just send the template name.',
  },
  {
    title: 'Send the screenshot with your details',
    detail: 'Message us on TikTok with everything that should end up on the site.',
    items: [
      'Your full name and the title you go by',
      'Photos — a profile shot, plus any work or project images',
      'Contact details: email, phone, and the social links you want listed',
      'Skills, tools, and the services you offer',
      'Work experience, education, and certifications',
      'A short about-me paragraph, and testimonials if you have them',
      'Projects or samples you want featured',
      'Your deadline, plus any changes or extra pages you want',
      'Anything else: preferred colors, a resume or CV, a domain name',
    ],
  },
  {
    title: 'Send a 50% downpayment',
    detail: 'This is what starts the build.',
  },
  {
    title: 'Wait for the build',
    detail: 'We set the template up with your content and keep you updated.',
  },
  {
    title: 'Review the preview',
    detail: 'We send a preview of the finished site so you can check it over.',
  },
  {
    title: 'Send the remaining 50%',
    detail: 'Skip this one if you already paid in full.',
  },
  {
    title: 'Get your ready-to-use link',
    detail: 'Once payment clears, we hand over the live link to your finished website.',
  },
]

// `category` is the shelf the card is filed on — see `categories` above; it is
// the catalog's primary organisation and what the filter chips switch between.
// `price` is in Philippine pesos; only 'available' templates have one.
// `status` is 'available' (live preview + order) or 'coming-soon' (teaser card:
// no demoUrl, no features — those templates are announced on TikTok first).
// `tier` is 'standard' or 'premium'; premium cards carry a mark on the card and
// the detail page, and the tier is one of the things search matches on.
export const templates = [
  {
    id: 'neat-aesthetic',
    name: 'Neat Aesthetic',
    audience: 'Virtual assistants and service professionals',
    category: 'portfolio',
    theme: 'light',
    tier: 'standard',
    status: 'available',
    price: 100,
    description:
      'A warm, editorial portfolio built for professionals who want their services, process, and experience to feel organized and approachable.',
    demoUrl: 'https://systemforge1.github.io/neataesthetic/',
    tags: ['Light', 'Editorial', 'Service portfolio'],
    features: [
      'Strong introduction and service overview',
      'About, process, testimonials, skills, and contact sections',
      'Responsive single-page layout',
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
    price: 100,
    description:
      'A sharp, dark portfolio with high-contrast typography and a technical feel for people who want a confident digital presence.',
    demoUrl: 'https://systemforge1.github.io/darktechy/',
    tags: ['Dark', 'Technical', 'Developer portfolio'],
    features: [
      'High-contrast dark presentation',
      'Project, skill, profile, and contact content',
      'Responsive single-page layout',
      'Interactive details and motion in the live demo',
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
    price: 100,
    description:
      'A navy-and-gold portfolio laid out like an architectural drawing set, with numbered sheets, site sections, and survey coordinates framing detailed visual work.',
    demoUrl: 'https://systemforge1.github.io/adventuredark/',
    tags: ['Dark', 'Editorial', 'Architecture portfolio'],
    features: [
      'Laid out as a numbered drawing set, sheet A-00 through A-06',
      'About, work, process, field notes, skills, and contact sections',
      'Phased project timeline, skill meters, and site-section diagrams',
      'Responsive single-page layout',
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
    price: 200,
    description:
      'A Swiss-minimal photography portfolio on warm paper tones, with an archive-style project grid and editorial display type that keeps the images in front.',
    demoUrl: 'https://systemforge1.github.io/bnwaesthetic/',
    tags: ['Light', 'Minimal', 'Photography portfolio'],
    features: [
      'Numbered editorial sections, 01 Archive through 10 Contact',
      'Filterable work archive with twelve projects and category tabs',
      'Services and rate cards, process, clients, recognition, and FAQ',
      'Journal, recent feed, and an inquiry form on a responsive layout',
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
    price: 200,
    description:
      'A print-inspired portfolio in stark black, white, and signal yellow, built around a numbered index and a hover-driven project list for people who ship technical work.',
    demoUrl: 'https://systemforge1.github.io/moderneditorial/',
    tags: ['Light', 'Editorial', 'Developer portfolio'],
    features: [
      'Numbered sections, 01 Index through 05 Contact',
      'Hover-driven project list with a preview card and animated counters',
      'Toolkit grid, service breakdown, and a dated track record',
      'Light, dark, and system theme toggle on a responsive layout',
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
    price: 200,
    description:
      'A clean, corporate-blue profile site for support, sales, and retention work, with service cards, skill meters, and a dated experience timeline that reads like a hiring brief.',
    demoUrl: 'https://systemforge1.github.io/simplemedium/',
    tags: ['Light', 'Corporate', 'Professional portfolio'],
    features: [
      'Hero with headline stats and a scrolling tools marquee',
      'About, services, experience, testimonials, and contact sections',
      'Skill meters, animated performance counters, and six service cards',
      'Responsive single-page layout with a mobile menu and contact CTA',
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
    description:
      'A gallery-first portfolio with generous whitespace, built to let large images carry the page.',
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
    description:
      'A neon-lit dark layout with a grid-driven project wall for work that needs a bit more energy.',
    tags: ['Dark', 'Neon', 'Showcase portfolio'],
  },
]

export function getTemplateById(templateId) {
  return templates.find((template) => template.id === templateId)
}

// The theme already has a badge of its own, so the tag that repeats it is
// dropped from the list. The search index still carries it — filtering the
// display must not make a template unfindable by the word on it.
export function visibleTags(template) {
  return template.tags.filter((tag) => tag.toLowerCase() !== template.theme)
}
