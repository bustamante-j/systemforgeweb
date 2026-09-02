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

**Content is data, not markup.** `src/data/site.js` is the single source of truth: `siteConfig` (brand name, TikTok handle/URL used across Header, Footer, HomePage, TemplateDetailPage) and the `templates` array consumed by HomePage and `getTemplateById`. Adding or editing a template means editing that array only — no new routes or components. Each template's `id` is the `/templates/:templateId` URL segment, `theme` (`light` | `dark`) drives the theme filter, `tier` (`standard` | `premium`) picks which catalog section the card lands in, and `name`/`audience`/`description`/`tags` are the fields the search box matches against.

A previous commit moved this catalog to Supabase and was reverted (`79ace8c`); the static data module is the intended design. Don't reintroduce a backend unless asked.

**Routing** lives entirely in [src/App.jsx](src/App.jsx): every route nests under `Layout` (skip link → Header → `<Outlet>` in `<main id="main-content">` → Footer), plus a `ScrollToTop` listener that resets scroll on pathname change. `HomePage` *is* the catalog (search + theme filter + grid); `/` and `/templates` both render it, so deep links and the detail page's back link stay valid. Unknown template ids render `NotFoundPage` inline from `TemplateDetailPage` (URL preserved) rather than redirecting. `vercel.json` rewrites all paths to `index.html`, which is what makes deep links to detail/legal pages work in production.

**Live previews** (`LivePreview`) embed third-party demo sites from `template.demoUrl` in a sandboxed `<iframe>` with `tabIndex="-1"` and a visible fallback line behind it. Keep the sandbox/referrerPolicy attributes when touching it. The iframe is fixed at a real 1280×800 desktop viewport and scaled down — the demos use `100vh` heroes, so a taller frame renders them as empty voids.

Each preview is a whole third-party site, so the catalog is the one page here with a real performance ceiling, and the component is built around not blowing through it. Easy-to-break details:

- A **module-level queue** grants load slots one or two at a time (fewer on a 3g/low-core phone), nearest-to-viewport first, so a grid of demos never starts at once. `priority` (used only by `TemplateDetailPage`, which shows a single demo) skips the queue. A slot is released on `onLoad` or after a 15s timeout, so one dead demo cannot wedge the queue.
- `data-status` on `.preview-frame` drives the CSS: `idle` → `loading` (skeleton sweep) → `ready` (iframe fades in), plus `deferred` for Data Saver / 2g visitors, whose cards stay a label until they tap through to the detail page, and `stalled` for a demo that timed out.
- The scale factor is written straight to the DOM as `--preview-scale` by **one shared ResizeObserver**, never through React state — resizing must not re-render the grid. 1280 lives in both `FRAME_WIDTH` and `.preview-viewport iframe`; keep them in step.
- `.preview-viewport iframe` needs `max-width: none` to escape the global `iframe { max-width: 100% }` reset, and `.preview-viewport` carries `contain` + `content-visibility: auto` so scrolled-past demos stop costing anything. Its `aspect-ratio` is what holds the box open under `content-visibility` — don't remove it.

## Conventions

- **Fonts** are self-hosted from [public/fonts/](public/fonts/), not fetched from Google, which keeps two origins and a stylesheet round trip off the critical path. The `@font-face` block at the top of [src/index.css](src/index.css) declares *only the weights the stylesheet uses* — Archivo 700, Space Grotesk 400–600, JetBrains Mono 400–500 — and the two text families are variable, so each ships one file per subset. `latin-ext` is split out behind its `unicode-range` purely for the ₱ in `PriceTag`. Two things to keep in mind: the filenames are unhashed and `vercel.json` caches them `immutable` for a year, so **rename the file if you ever swap a font**, and [index.html](index.html) preloads the two that carry first paint.
- **Mobile is the primary target** — most visitors arrive from TikTok on a phone. Things that look arbitrary but are not: the search input must stay at `16px` (iOS zooms the page in on focus below that), the sticky header drops `backdrop-filter` under 850px (re-blurring every scrolled frame is expensive on a phone GPU), `.nav-scrim` is a *sibling* of `<header>` so it dims the page without dimming the header, and `.template-card-body` collapses to one column under 600px so badges stop squeezing the title.
- **Styling**: one global stylesheet, [src/index.css](src/index.css) — hand-written CSS, no Tailwind or CSS modules. Colors, text, surface, border, and `--container` width are custom properties on `:root`; reuse those tokens instead of literal hex values. Class names are flat and semantic (`.section`, `.container`, `.content-block`, `.button`/`.button-secondary`/`.button-muted`, `.template-grid`, `.preview-frame`). Responsive breakpoints are 850px and 600px, plus a `prefers-reduced-motion` block.
- **Page shape**: content pages render `<PageHeader title>` followed by `<section className="section"><div className="container">…`. Text stays minimal on purpose — the catalog is the page, not the copy around it.
- **Accessibility is load-bearing** and applied consistently: `aria-label` on every nav, tag list, and preview link, `aria-live="polite"` on the filtered results count, and `:focus-visible` outlines (including on `.preview-link`, which wraps each card's preview). Preserve this when adding UI.
- **Code style**: no semicolons, single quotes, 2-space indent, `export default function` components, imports and JSX props kept roughly alphabetical.
