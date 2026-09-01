insert into public.templates (
  slug,
  name,
  audience,
  theme,
  description,
  demo_url,
  tags,
  features,
  is_published,
  display_order
)
values
  (
    'neat-aesthetic',
    'Neat Aesthetic',
    'Virtual assistants and service professionals',
    'light',
    'A warm, editorial portfolio built for professionals who want their services, process, and experience to feel organized and approachable.',
    'https://systemforge1.github.io/neataesthetic/',
    array['Light', 'Editorial', 'Service portfolio'],
    array[
      'Strong introduction and service overview',
      'About, process, testimonials, skills, and contact sections',
      'Responsive single-page layout',
      'Clear calls to action for inquiries'
    ],
    true,
    10
  ),
  (
    'dark-techy',
    'Dark Techy',
    'Developers, IT students, and technical creatives',
    'dark',
    'A sharp, dark portfolio with high-contrast typography and a technical feel for people who want a confident digital presence.',
    'https://systemforge1.github.io/darktechy/',
    array['Dark', 'Technical', 'Developer portfolio'],
    array[
      'High-contrast dark presentation',
      'Project, skill, profile, and contact content',
      'Responsive single-page layout',
      'Interactive details and motion in the live demo'
    ],
    true,
    20
  ),
  (
    'adventure-dark',
    'Adventure Dark',
    'Architects, designers, and visual professionals',
    'dark',
    'A navy-and-gold portfolio inspired by expedition journals and architectural drafting, suited to detailed visual work.',
    'https://systemforge1.github.io/adventuredark/',
    array['Dark', 'Editorial', 'Architecture portfolio'],
    array[
      'Project-led portfolio structure',
      'About, services, process, praise, skills, and contact sections',
      'Responsive single-page layout',
      'Distinct architectural and field-journal presentation'
    ],
    true,
    30
  )
on conflict (slug) do update
set
  name = excluded.name,
  audience = excluded.audience,
  theme = excluded.theme,
  description = excluded.description,
  demo_url = excluded.demo_url,
  tags = excluded.tags,
  features = excluded.features,
  is_published = excluded.is_published,
  display_order = excluded.display_order;
