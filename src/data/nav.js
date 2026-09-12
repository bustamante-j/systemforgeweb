// The primary navigation, shared by the header bar and the mobile takeover so
// the two can never drift apart.
//
// `/templates` is deliberately not `end`: a template detail page is still the
// catalog as far as the reader is concerned, so the tab stays lit down there.
export const navItems = [
  { to: '/', label: 'Home', index: '01', end: true },
  { to: '/templates', label: 'Templates', index: '02' },
  { to: '/about', label: 'About', index: '03' },
  { to: '/contact', label: 'Contact', index: '04' },
]
