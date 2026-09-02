export const siteConfig = {
  brandName: 'System Forge',
  tiktokHandle: '@system_forgeee',
  tiktokUrl: 'https://www.tiktok.com/@system_forgeee',
}

// `price` is in Philippine pesos; only 'available' templates have one.
// `status` is 'available' (live preview + order) or 'coming-soon' (teaser card:
// no demoUrl, no features — those templates are announced on TikTok first).
// `tier` is 'standard' or 'premium' — it picks the catalog section the template
// lands in; premium cards also carry a badge on the card and detail page.
export const templates = [
  {
    id: 'neat-aesthetic',
    name: 'Neat Aesthetic',
    audience: 'Virtual assistants and service professionals',
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
