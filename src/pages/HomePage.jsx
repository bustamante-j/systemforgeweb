import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Search } from 'lucide-react'
import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import TemplateCard from '../components/TemplateCard'
import TikTokIcon from '../components/TikTokIcon'
import { categories, categoryOf, orderSummary, siteConfig, templates } from '../data/site'
import { EASE_OUT, gsap, prefersReducedMotion, sectionMotion } from '../lib/motion'

const themeFilters = [
  { value: 'all', label: 'All' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

// The shelves the catalog can actually show, in the order declared in the data,
// with any category a template carries but the list does not know about
// appended after them. Built once: the set of shelves only changes when the
// data does, never when someone types.
const shelfOrder = [
  ...categories.map((category) => category.value),
  ...templates
    .map((template) => template.category)
    .filter(
      (value, index, all) =>
        !categories.some((category) => category.value === value) &&
        all.indexOf(value) === index,
    ),
].filter((value) => templates.some((template) => template.category === value))

const categoryFilters = [
  { value: 'all', label: 'Everything' },
  ...shelfOrder.map((value) => ({ value, label: categoryOf(value).label })),
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
      categoryOf(template.category).label,
      template.tier === 'premium' ? 'premium' : 'standard',
      template.status === 'coming-soon' ? 'coming soon upcoming' : 'available',
      ...template.tags,
    ]
      .join(' ')
      .toLowerCase(),
  ]),
)

const available = templates.filter((template) => template.status === 'available')
const lowestPrice = Math.min(...available.map((template) => template.price))

// Read off the data so the counter under the title can never drift from what is
// actually on the shelves.
const stats = [
  { label: 'Templates live', value: available.length, pad: true },
  { label: 'Categories', value: shelfOrder.length, pad: true },
  { label: 'Starting at', value: lowestPrice, prefix: '₱' },
]

export default function HomePage() {
  const root = useRef(null)
  const shelvesRef = useRef(null)
  const firstPass = useRef(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [theme, setTheme] = useState('all')

  // Keystrokes land immediately; the shelves — and the previews on them — catch
  // up at a lower priority, so the field never feels like it is lagging.
  const deferredQuery = useDeferredValue(query)

  const { matchCount, shelves } = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()
    const matches = templates
      .filter(
        (template) =>
          (category === 'all' || template.category === category) &&
          (theme === 'all' || template.theme === theme) &&
          searchIndex.get(template.id).includes(normalizedQuery),
      )
      // Available templates lead each shelf; upcoming ones trail it. Sort is
      // stable, so the order inside each group stays the data order.
      .sort(
        (first, second) =>
          Number(first.status === 'coming-soon') - Number(second.status === 'coming-soon'),
      )

    return {
      matchCount: matches.length,
      // A shelf is only set out when the current search and filters leave
      // something to put on it.
      shelves: shelfOrder
        .map((value) => ({
          ...categoryOf(value),
          matches: matches.filter((template) => template.category === value),
        }))
        .filter((shelf) => shelf.matches.length > 0),
    }
  }, [category, deferredQuery, theme])

  // Page-wide scroll choreography. Everything it drives is declared in markup
  // with data-reveal / data-stagger / data-count attributes.
  useGSAP(() => sectionMotion(root.current), { scope: root })

  // Filtering re-stocks the shelves rather than blinking them. Skipped on the
  // first pass, where the scroll reveals already own the entrance.
  useGSAP(
    () => {
      if (firstPass.current) {
        firstPass.current = false
        return
      }

      if (prefersReducedMotion()) {
        return
      }

      const cards = shelvesRef.current?.querySelectorAll('.card')
      if (!cards?.length) {
        return
      }

      gsap.fromTo(
        cards,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: EASE_OUT, stagger: 0.035, overwrite: true },
      )
    },
    { dependencies: [category, deferredQuery, theme] },
  )

  return (
    <div ref={root}>
      <section className="catalog-intro">
        <div className="container catalog-intro-inner">
          <div>
            <p className="eyebrow">The catalog</p>
            <h1 className="catalog-title">Ready-made websites, running live.</h1>
            <p className="catalog-lede">
              Finished, responsive sites you can look at before you buy — every card on
              this page is the real thing, loaded in the frame. Pick one and we set it up
              with your content.
            </p>
          </div>

          <dl className="catalog-stats" data-stagger>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="readout">{stat.label}</dt>
                <dd>
                  <span
                    data-count={stat.value}
                    data-count-pad={stat.pad ? 'true' : 'false'}
                    data-count-prefix={stat.prefix ?? ''}
                  >
                    {stat.prefix ?? ''}
                    {stat.pad
                      ? String(stat.value).padStart(2, '0')
                      : stat.value.toLocaleString('en-PH')}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bar and shelves share one section, which is what keeps the sticky bar
          inside the catalog instead of riding down over the footer. */}
      <section aria-label="Template catalog" className="catalog">
        <div className="catalog-bar">
          <div className="container catalog-bar-inner">
            <div className="search-input">
              <Search aria-hidden="true" size={15} strokeWidth={1.5} />
              <input
                aria-label="Search templates"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates"
                type="search"
                value={query}
              />
            </div>

            {/* The primary organisation of the shop, so it gets the primary
                control: one chip per shelf that has anything on it. */}
            <div className="chip-row" role="group" aria-label="Filter by category">
              {categoryFilters.map((filter) => (
                <button
                  aria-pressed={category === filter.value}
                  className="chip"
                  key={filter.value}
                  onClick={() => setCategory(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
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
                hear, phrased as a sentence and kept through the mobile collapse
                that hides its visible twin. */}
            <p className="sr-only" aria-live="polite">
              {matchCount} of {templates.length} templates shown
            </p>
          </div>
        </div>

        <div className="container catalog-body" ref={shelvesRef}>
          {shelves.length > 0 ? (
            shelves.map((shelf) => (
              <section
                aria-labelledby={`shelf-${shelf.value}`}
                className="shelf"
                key={shelf.value}
              >
                <div className="shelf-head">
                  <h2 className="shelf-title" id={`shelf-${shelf.value}`}>
                    {shelf.label}
                  </h2>
                  <p className="readout shelf-count">
                    {String(shelf.matches.length).padStart(2, '0')}{' '}
                    {shelf.matches.length === 1 ? 'template' : 'templates'}
                  </p>
                  {shelf.blurb ? <p className="shelf-blurb">{shelf.blurb}</p> : null}
                </div>

                <div className="card-grid">
                  {shelf.matches.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="empty-state">
              <p>Nothing in the catalog matches that.</p>
              <button
                className="button button-ghost"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
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

      <section aria-labelledby="ordering-heading" className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">01</span>
            <h2 className="section-marker-label marker" id="ordering-heading">
              How ordering works
            </h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <ol className="step-cards" data-stagger>
            {orderSummary.map((step, index) => (
              <li key={step.title}>
                <span className="readout">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>

          <Link className="text-link step-cards-link" to="/contact">
            The full seven steps
            <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <section>
        <div className="container cta-panel">
          <h2 className="cta-title" data-reveal="lines">
            Pick one. We build it.
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
