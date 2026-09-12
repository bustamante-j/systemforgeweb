import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ForgeHero from '../components/ForgeHero'
import Specimen from '../components/Specimen'
import TikTokIcon from '../components/TikTokIcon'
import { siteConfig, templates } from '../data/site'
import { EASE_OUT, gsap, prefersReducedMotion, sectionMotion } from '../lib/motion'

const themeFilters = [
  { value: 'all', label: 'All' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

// Section order is the catalog order: standard first, premium below it.
const tierSections = [
  { value: 'standard', title: 'Standard', note: 'Series A' },
  { value: 'premium', title: 'Premium', note: 'Series B' },
]

// The text each template is matched against, built once at module load instead
// of re-joined for every template on every keystroke.
const searchIndex = new Map(
  templates.map((template) => [
    template.id,
    [
      template.name,
      template.audience,
      template.description,
      template.tier === 'premium' ? 'premium' : 'standard',
      template.status === 'coming-soon' ? 'coming soon upcoming' : 'available',
      ...template.tags,
    ]
      .join(' ')
      .toLowerCase(),
  ]),
)

const available = templates.filter((template) => template.status === 'available')
const upcoming = templates.filter((template) => template.status === 'coming-soon')

// The hero specimen is a data decision, not a hard-coded id: flag one template
// `featured` and it takes the press.
const heroSpecimen = available.find((template) => template.featured) ?? available[0]

const priceOf = (tier) => {
  const prices = available.filter((t) => t.tier === tier).map((t) => t.price)
  return prices.length > 0 ? Math.min(...prices) : 0
}

// A ledger of what the catalog actually contains, read off the data so it can
// never drift from it.
const ledger = [
  { label: 'Templates live', value: available.length, pad: true },
  { label: 'In the forge', value: upcoming.length, pad: true },
  { label: 'Standard build', value: priceOf('standard'), prefix: '₱' },
  { label: 'Premium build', value: priceOf('premium'), prefix: '₱' },
]

export default function HomePage() {
  const root = useRef(null)
  const railRef = useRef(null)
  const firstPass = useRef(true)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('all')

  // Keystrokes land immediately; the rail — and the previews in it — catch up
  // at a lower priority, so the field never feels like it is lagging.
  const deferredQuery = useDeferredValue(query)

  const { matchCount, sections } = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    const matches = templates
      .filter(
        (template) =>
          (theme === 'all' || template.theme === theme) &&
          searchIndex.get(template.id).includes(normalizedQuery),
      )
      // Available templates lead the rail; upcoming ones trail it. Sort is
      // stable, so the order inside each group stays the data order.
      .sort(
        (first, second) =>
          Number(first.status === 'coming-soon') - Number(second.status === 'coming-soon'),
      )

    return {
      matchCount: matches.length,
      // A tier only gets a series when the current search and filter leave
      // something in it.
      sections: tierSections
        .map((section) => ({
          ...section,
          matches: matches.filter((template) => template.tier === section.value),
        }))
        .filter((section) => section.matches.length > 0),
    }
  }, [deferredQuery, theme])

  // Page-wide scroll choreography. Everything it drives is declared in markup
  // with data-reveal / data-parallax / data-count attributes.
  useGSAP(() => sectionMotion(root.current), { scope: root })

  // Filtering is a re-composition, not a page load, so the rail re-forms rather
  // than blinking. Skipped on the first pass, where the scroll reveals above
  // already own the entrance.
  useGSAP(
    () => {
      if (firstPass.current) {
        firstPass.current = false
        return
      }

      if (prefersReducedMotion()) {
        return
      }

      const specimens = railRef.current?.querySelectorAll('.specimen')
      if (!specimens?.length) {
        return
      }

      gsap.fromTo(
        specimens,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.55, ease: EASE_OUT, stagger: 0.05, overwrite: true },
      )
    },
    { dependencies: [deferredQuery, theme] },
  )

  // A pointer-following chip on each frame, telling you the picture is a door.
  // Coarse pointers never see it, and it writes through quickTo so a pointermove
  // never reaches React.
  useGSAP(
    (context, contextSafe) => {
      // A pointer affordance, so it is gated on having a pointer — and on the
      // visitor not having asked for stillness, since it is a thing that moves.
      const media = window.matchMedia(
        '(pointer: fine) and (prefers-reduced-motion: no-preference)',
      )
      if (!media.matches) {
        return undefined
      }

      const links = gsap.utils.toArray(root.current.querySelectorAll('.preview-link'))
      const teardown = links.map((link) => {
        const chip = link.querySelector('.specimen-cursor')
        if (!chip) {
          return () => {}
        }

        const x = gsap.quickTo(chip, 'x', { duration: 0.45, ease: 'power3' })
        const y = gsap.quickTo(chip, 'y', { duration: 0.45, ease: 'power3' })

        const onMove = contextSafe((event) => {
          const box = link.getBoundingClientRect()
          x(event.clientX - box.left)
          y(event.clientY - box.top)
        })
        const onEnter = contextSafe(() => gsap.to(chip, { scale: 1, opacity: 1, duration: 0.32 }))
        const onLeave = contextSafe(() => gsap.to(chip, { scale: 0.6, opacity: 0, duration: 0.26 }))

        link.addEventListener('pointermove', onMove)
        link.addEventListener('pointerenter', onEnter)
        link.addEventListener('pointerleave', onLeave)

        return () => {
          link.removeEventListener('pointermove', onMove)
          link.removeEventListener('pointerenter', onEnter)
          link.removeEventListener('pointerleave', onLeave)
        }
      })

      return () => teardown.forEach((off) => off())
    },
    { dependencies: [sections], scope: root },
  )

  return (
    <div ref={root}>
      <ForgeHero plates={available} specimen={heroSpecimen} />

      <section aria-labelledby="catalog-heading" className="catalog" id="catalog">
        <div className="catalog-bar">
          <div className="container catalog-bar-inner">
            <h2 className="catalog-bar-label marker" id="catalog-heading">
              The catalog
            </h2>

            <div className="search-input">
              <Search aria-hidden="true" size={15} strokeWidth={1.5} />
              <input
                aria-label="Search templates"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                type="search"
                value={query}
              />
            </div>

            <div className="segmented" role="group" aria-label="Filter by theme">
              {themeFilters.map((filter) => (
                <button
                  aria-pressed={theme === filter.value}
                  key={filter.value}
                  onClick={() => setTheme(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <p className="results-note catalog-count" aria-hidden="true">
              {String(matchCount).padStart(2, '0')} / {String(templates.length).padStart(2, '0')}
            </p>
            {/* The visible count is a readout; this is the one screen readers
                hear, phrased as a sentence and kept through the mobile
                collapse that hides its visible twin. */}
            <p className="sr-only" aria-live="polite">
              {matchCount} of {templates.length} templates shown
            </p>
          </div>
        </div>

        <div className="container" ref={railRef}>
          {sections.length > 0 ? (
            sections.map((section) => (
              <section aria-label={`${section.title} templates`} className="series" key={section.value}>
                <div className="series-head">
                  <h3 className="series-title marker">
                    {section.title} <em>Series</em>
                  </h3>
                  <p className="readout series-note">
                    {section.note} — {String(section.matches.length).padStart(2, '0')} templates
                  </p>
                </div>

                <div className="specimens">
                  {section.matches.map((template, index) => (
                    <Specimen
                      index={index + 1}
                      key={template.id}
                      side={index % 2 === 0 ? 'left' : 'right'}
                      template={template}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state series">
              <p>Nothing in the catalog matches that.</p>
              <button
                className="button button-ghost"
                onClick={() => {
                  setQuery('')
                  setTheme('all')
                }}
                type="button"
              >
                <span>Clear filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="ledger-heading" className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">02</span>
            <h2 className="section-marker-label marker" id="ledger-heading">
              Specification
            </h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <div className="spec-sheet">
            {ledger.map((row, index) => (
              <div className="spec-row" key={row.label}>
                <span className="spec-row-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="spec-row-label marker">{row.label}</span>
                <span className="spec-row-value">
                  <span
                    data-count={row.value}
                    data-count-pad={row.pad ? 'true' : 'false'}
                    data-count-prefix={row.prefix ?? ''}
                  >
                    {row.prefix ?? ''}
                    {row.pad ? String(row.value).padStart(2, '0') : row.value.toLocaleString('en-PH')}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container cta-panel">
          <h2 className="cta-title display" data-reveal="lines">
            Pick one. <em>We build it.</em>
          </h2>

          <div className="cta-foot">
            <p data-reveal="up">
              Send the template name and your details on TikTok. Half up front, the rest
              when you have seen the preview.
            </p>

            <div className="cta-actions" data-stagger>
              <a
                className="button"
                href={siteConfig.tiktokUrl}
                rel="noreferrer"
                target="_blank"
              >
                <TikTokIcon size={13} />
                <span>Order on TikTok</span>
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </a>
              <Link className="button button-secondary" to="/contact">
                <span>How ordering works</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
