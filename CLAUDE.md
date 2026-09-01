# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Vite dev server
npm run lint     # oxlint (config in .oxlintrc.json)
npm run build    # production build to dist/
npm run preview  # serve the built dist/
```

There is no test runner in this project. `npm run lint` and `npm run build` are the production checks.

## Architecture

Static marketing/catalog SPA: Vite + React 19 + react-router-dom v7, plain JSX (no TypeScript), deployed on Vercel.

**Content is data, not markup.** `src/data/site.js` is the single source of truth: `siteConfig` (brand name, TikTok handle/URL used across Header, Footer, HomePage, TemplateDetailPage) and the `templates` array consumed by HomePage, TemplatesPage, and `getTemplateById`. Adding or editing a template means editing that array only — no new routes or components. Each template's `id` is the `/templates/:templateId` URL segment, `theme` (`light` | `dark`) drives the theme filter, and `name`/`audience`/`description`/`tags` are the fields the search box matches against.

A previous commit moved this catalog to Supabase and was reverted (`79ace8c`); the static data module is the intended design. Don't reintroduce a backend unless asked.

**Routing** lives entirely in [src/App.jsx](src/App.jsx): every route nests under `Layout` (skip link → Header → `<Outlet>` in `<main id="main-content">` → Footer), plus a `ScrollToTop` listener that resets scroll on pathname change. Unknown template ids render `NotFoundPage` inline from `TemplateDetailPage` (URL preserved) rather than redirecting. `vercel.json` rewrites all paths to `index.html`, which is what makes deep links to detail/legal pages work in production.

**Live previews** (`LivePreview`) embed third-party demo sites from `template.demoUrl` in a sandboxed, lazy-loaded `<iframe>` with `tabIndex="-1"` and a visible fallback line behind it. Keep the sandbox/referrerPolicy attributes when touching it.

## Conventions

- **Styling**: one global stylesheet, [src/index.css](src/index.css) — hand-written CSS, no Tailwind or CSS modules. Colors, text, surface, border, and `--container` width are custom properties on `:root`; reuse those tokens instead of literal hex values. Class names are flat and semantic (`.section`, `.container`, `.content-block`, `.button`/`.button-secondary`/`.button-muted`, `.template-grid`). Responsive breakpoints are 850px and 600px, plus a `prefers-reduced-motion` block.
- **Page shape**: content pages render `<PageHeader title>` followed by `<section className="section"><div className="container">…`; `section-surface` alternates background, `two-column` splits content blocks.
- **Accessibility is load-bearing** and applied consistently: `aria-label` on every nav and tag list, `aria-live="polite"` on the filtered results count, `:focus-visible` outlines, and `TemplateCard`'s `headingLevel` prop so cards render `h3` under a section's `h2` (HomePage) but `h2` on TemplatesPage. Preserve this when adding UI.
- **Code style**: no semicolons, single quotes, 2-space indent, `export default function` components, imports and JSX props kept roughly alphabetical.
