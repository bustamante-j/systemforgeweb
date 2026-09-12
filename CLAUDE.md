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

Static marketing/catalog SPA: Vite + React 19 + react-router-dom v7 + GSAP, plain JSX (no TypeScript), deployed on Vercel.

**Content is data, not markup.** `src/data/site.js` is the single source of truth: `siteConfig` (brand name, TikTok handle/URL used across Header, Footer, HomePage, TemplateDetailPage) and the `templates` array consumed by HomePage and `getTemplateById`. Adding or editing a template means editing that array only — no new routes or components. Each template's `id` is the `/templates/:templateId` URL segment, `theme` (`light` | `dark`) drives the theme filter, `tier` (`standard` | `premium`) picks which catalog series it lands in, `featured` (exactly one template) picks the one the hero forges, and `name`/`audience`/`description`/`tags` are the fields the search box matches against. `visibleTags()` drops the tag that merely repeats the theme badge — the search index keeps it, so filtering the display never makes a template unfindable.

A previous commit moved this catalog to Supabase and was reverted (`79ace8c`); the static data module is the intended design. Don't reintroduce a backend unless asked.

**Routing** lives entirely in [src/App.jsx](src/App.jsx): every route nests under `Layout` (skip link → Header → NavOverlay → `<Outlet>` in `<main id="main-content">` → Footer → grain), plus `RouteTransition`, which resets scroll, fades `<main>` in behind a sweeping hairline, and calls `ScrollTrigger.refresh()` on the next frame because the incoming page is a different height. `HomePage` *is* the catalog (hero + search + theme filter + specimen rail + ledger); `/` and `/templates` both render it. Unknown template ids render `NotFoundPage` inline from `TemplateDetailPage` (URL preserved) rather than redirecting. `vercel.json` rewrites all paths to `index.html`, which is what makes deep links to detail/legal pages work in production.

**Live previews** (`LivePreview`) embed third-party demo sites from `template.demoUrl` in a sandboxed `<iframe>` with `tabIndex="-1"` and a visible fallback line behind it. Keep the sandbox/referrerPolicy attributes when touching it. The iframe is fixed at a real 1280×800 desktop viewport and scaled down — the demos use `100vh` heroes, so a taller frame renders them as empty voids.

Each preview is a whole third-party site, so the catalog is the one page here with a real performance ceiling, and the component is built around not blowing through it. Easy-to-break details:

- A **module-level queue** grants load slots one or two at a time (fewer on a 3g/low-core phone), nearest-to-viewport first, so a rail of demos never starts at once. `priority` (used by `ForgeHero` and `TemplateDetailPage`, which each show a single demo) skips the queue. A slot is released on `onLoad` or after a 15s timeout, so one dead demo cannot wedge the queue.
- `data-status` on `.preview-frame` drives the CSS: `idle` → `loading` (skeleton sweep) → `ready` (iframe fades in), plus `deferred` for Data Saver / 2g visitors, whose frames stay a label until they tap through to the detail page, and `stalled` for a demo that timed out.
- The scale factor is written straight to the DOM as `--preview-scale` by **one shared ResizeObserver**, never through React state — resizing must not re-render the rail. 1280 lives in both `FRAME_WIDTH` and `.preview-viewport iframe`; keep them in step.
- `.preview-viewport iframe` needs `max-width: none` to escape the global `iframe { max-width: 100% }` reset, and `.preview-viewport` carries `contain` + `content-visibility: auto` so scrolled-past demos stop costing anything. Its `aspect-ratio` is what holds the box open under `content-visibility` — don't remove it.

## Motion

All GSAP goes through [src/lib/motion.js](src/lib/motion.js), which registers the plugins once at module load and exports `gsap`, `ScrollTrigger`, `SplitText`, the `EASE_PRESS` / `EASE_OUT` curves, and `sectionMotion`. Import from there, not from `gsap` directly, so registration can never be missed. Components drive animation through `useGSAP` with a `scope` ref; nothing uses a bare `useEffect`.

**`sectionMotion(root)`** is the page-wide choreography, declared in markup with data attributes rather than wired up per component — a page needs one `useGSAP(() => sectionMotion(root.current), { scope: root })` call and nothing more:

`data-reveal="lines"` (SplitText line masks) · `"up"` · `"rule"` (hairline draws across) · `"rail"` (scrubbed vertical draw) · `"wipe"` (a frame opens from its centre line) · `data-stagger` · `data-parallax="-26"` · `data-count="6"`.

**The reduced-motion contract, and the one rule that follows from it.** `sectionMotion` builds nothing at all under `prefers-reduced-motion: reduce`, and every reveal is a `from`/`fromTo` — with no tween to write a start value, the element simply renders finished. So **no element may hide itself in the stylesheet and rely on a tween to bring it back**. `.section-marker-rule` and `.order-rail` were written that way once and disappeared entirely for reduced-motion visitors; they now sit visible in CSS and the tween sets scale 0 itself when it builds. The hero has its own static composition under the same query at the bottom of the stylesheet.

**The signature** is [src/components/ForgeHero.jsx](src/components/ForgeHero.jsx) — a billet of blueprint plates falls out of depth, a press closes and strikes it, and what comes out is the live site opening from the seam while the wordmark parts around it. Two timelines, deliberately:

- The **boot** timeline *plays* on load, because the first frame a visitor gets has to be composed rather than empty. An earlier version bound the title reveal to scroll and the landing screen was blank.
- The **press** timeline is *scrubbed* over a pinned stage. Beats are named in the `BEAT` object on a 0–1 scale; both timelines are written against the same composed mid-state that `gsap.set` establishes.

Things in there that look arbitrary and are not: `pinSpacing: false` because `.forge-track` already reserves the scroll distance; `immediateRender: false` on the late `fromTo`s, or their start values land at build time and the shockwave sits on screen at scroll 0; `will-change` added and removed by the trigger's `onToggle` rather than living in CSS; the plates' `opacity` set in the composed state, since the stylesheet starts them at 0 and a `from(opacity: 0)` would otherwise animate 0 → 0; and the output link's `tabindex` driven to `-1` until the press opens, because a focusable link nobody can see is a trap.

Use `transform`, `opacity` and `clip-path` only. Never put a transform on `<main>` or any ancestor of the hero — it becomes the containing block for the pinned stage and silently breaks the pin. That is why `RouteTransition` fades opacity and nothing else.

## Conventions

- **Type is one width axis.** Archivo is self-hosted as a *width*-variable file pinned to weight 700 (`wdth` 62–125). That axis is the whole system: `.display` runs it Expanded at 118% for the lockups, `.marker` Condensed at 64% for section markers and spec labels, and headings sit at 100%. Two opposite voices, one download. Space Grotesk sets body copy and JetBrains Mono every readout (`.readout`).
- **Fonts** are self-hosted from [public/fonts/](public/fonts/), not fetched from Google, which keeps two origins and a stylesheet round trip off the critical path. `latin-ext` is split out behind its `unicode-range` purely for the ₱ in `PriceTag`. The filenames are unhashed and `vercel.json` caches them `immutable` for a year, so **rename the file if you ever swap a font** (the width-variable cut is `archivo-wdth-*`, renamed from the old static `archivo-*` for exactly this reason). [index.html](index.html) preloads the two that carry first paint.
- **Utility classes land on `<p>` as often as on `<span>`**, and the global `p { max-width: 62ch }` quietly caps them there. `.readout`, `.eyebrow`, `.forge-caption` and `.specimen-audience` reset it explicitly. If a centred label mysteriously strands itself at the left of its box, this is why.
- **Mobile is the primary target** — most visitors arrive from TikTok on a phone. Things that look arbitrary but are not: the search input must stay at `16px` (iOS zooms the page in on focus below that), the fixed header and sticky catalog bar drop `backdrop-filter` under 850px (re-blurring every scrolled frame is expensive on a phone GPU), the catalog bar collapses to a single row under 850px because two rows plus the header ate 28% of a phone screen, and the hero press runs a shallower stack and a shorter pin on narrow viewports via `gsap.matchMedia`.
- **The header is fixed, not sticky.** `.main-content` reserves `--header-h` and `.forge` takes that reservation straight back with a negative margin, so the hero runs full-bleed under the bar. Sticky left the pinned stage starting 68px down and pushed the readout off the first frame.
- **Styling**: one global stylesheet, [src/index.css](src/index.css) — hand-written CSS, no Tailwind or CSS modules. Dark-first. Surfaces, text, the two working colours (`--filament` cold, `--ember` hot and rationed), hairlines, type, rhythm and the `--z-*` layer scale are custom properties on `:root`; reuse those tokens instead of literal hex values, and don't invent a z-index outside the scale. Class names are flat and semantic (`.section`, `.container`, `.button`/`.button-secondary`/`.button-ghost`, `.specimen`, `.preview-frame`, `.spec-row`). Responsive breakpoints are 1080px, 850px and 600px, plus `pointer: coarse` and `prefers-reduced-motion` blocks.
- **Page shape**: content pages render `<PageHeader title>` followed by `<section className="section"><div className="container">…`, and major sections open with the `.section-marker` spine (index, condensed label, drawn rule). Text stays minimal on purpose — the demos are the page, not the copy around them. Numbered markers are for things that are genuinely a sequence (the ordering steps, the feature spec); the About claims are labelled instead, because three independent facts are not a sequence.
- **Accessibility is load-bearing** and applied consistently: one `h1` per route with no heading-level skips (series are `h3`, the templates inside them `h4`), `aria-label` on every nav, tag list, and preview link, `inert` on `<main>`/`<footer>` while the nav overlay is open (which is what contains focus without a hand-rolled trap), an `.sr-only` live region for the filtered results count that survives the mobile collapse hiding its visible twin, and `:focus-visible` outlines throughout. Preserve this when adding UI.
- **Code style**: no semicolons, single quotes, 2-space indent, `export default function` components, imports and JSX props kept roughly alphabetical.
