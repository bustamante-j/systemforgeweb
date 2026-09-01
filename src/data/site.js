export const siteConfig = {
  brandName: 'System Forge',
  tiktokHandle: '@systemforge1',
  tiktokUrl: 'https://www.tiktok.com/@systemforge1',
}

// `price` is in Philippine pesos; only 'available' templates have one.
// `status` is 'available' (live preview + order) or 'coming-soon' (teaser card:
// no demoUrl, no features — those templates are announced on TikTok first).
export const templates = [
  {
    id: 'neat-aesthetic',
    name: 'Neat Aesthetic',
    audience: 'Virtual assistants and service professionals',
    theme: 'light',
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
    audience: 'Architects, designers, and visual professionals',
    theme: 'dark',
    status: 'available',
    price: 100,
    description:
      'A navy-and-gold portfolio inspired by expedition journals and architectural drafting, suited to detailed visual work.',
    demoUrl: 'https://systemforge1.github.io/adventuredark/',
    tags: ['Dark', 'Editorial', 'Architecture portfolio'],
    features: [
      'Project-led portfolio structure',
      'About, services, process, praise, skills, and contact sections',
      'Responsive single-page layout',
      'Distinct architectural and field-journal presentation',
    ],
  },
  {
    id: 'soft-studio',
    name: 'Soft Studio',
    audience: 'Photographers and creative studios',
    theme: 'light',
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
    status: 'coming-soon',
    description:
      'A neon-lit dark layout with a grid-driven project wall for work that needs a bit more energy.',
    tags: ['Dark', 'Neon', 'Showcase portfolio'],
  },
]

export function getTemplateById(templateId) {
  return templates.find((template) => template.id === templateId)
}
