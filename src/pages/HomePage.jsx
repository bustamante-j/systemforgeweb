import { Search } from 'lucide-react'
import { useState } from 'react'
import TemplateCard from '../components/TemplateCard'
import { templates } from '../data/site'

const themeFilters = [
  { value: 'all', label: 'All' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

// Section order is the catalog order: standard first, premium below it.
const tierSections = [
  { value: 'standard', title: 'Standard templates' },
  { value: 'premium', title: 'Premium templates' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleTemplates = templates
    .filter((template) => {
      const matchesTheme = theme === 'all' || template.theme === theme
      const searchableText = [
        template.name,
        template.audience,
        template.description,
        template.tier === 'premium' ? 'premium' : 'standard',
        template.status === 'coming-soon' ? 'coming soon upcoming' : 'available',
        ...template.tags,
      ]
        .join(' ')
        .toLowerCase()

      return matchesTheme && searchableText.includes(normalizedQuery)
    })
    // Available templates lead the grid; upcoming ones trail it. Sort is stable,
    // so the order inside each group stays the data order.
    .sort(
      (first, second) =>
        Number(first.status === 'coming-soon') - Number(second.status === 'coming-soon'),
    )

  // A tier only gets a section when the current search and filter leave
  // something in it.
  const visibleSections = tierSections
    .map((section) => ({
      ...section,
      matches: visibleTemplates.filter((template) => template.tier === section.value),
    }))
    .filter((section) => section.matches.length > 0)

  return (
    <section className="section section-compact">
      <div className="container">
        <div className="catalog-head">
          <h1>Portfolio templates</h1>
          <p>Live previews. Pick one and message us to order.</p>
        </div>

        <div className="catalog-controls">
          <div className="search-input">
            <Search aria-hidden="true" size={16} strokeWidth={1.75} />
            <input
              aria-label="Search templates"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search templates"
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

          <p className="results-note" aria-live="polite">
            {visibleTemplates.length} / {templates.length}
          </p>
        </div>

        {visibleSections.length > 0 ? (
          visibleSections.map((section) => (
            <section
              aria-label={section.title}
              className="catalog-section"
              key={section.value}
            >
              <div className="catalog-section-head">
                <h2>{section.title}</h2>
                <p className="results-note">{section.matches.length}</p>
              </div>

              <div className="template-grid">
                {section.matches.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-state">
            <p>No templates match that search.</p>
            <button
              className="button button-muted"
              onClick={() => {
                setQuery('')
                setTheme('all')
              }}
              type="button"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
