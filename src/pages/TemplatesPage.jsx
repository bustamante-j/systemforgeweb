import { Search } from 'lucide-react'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TemplateCard from '../components/TemplateCard'
import { templates } from '../data/site'

const themeFilters = [
  { value: 'all', label: 'All' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export default function TemplatesPage() {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleTemplates = templates.filter((template) => {
    const matchesTheme = theme === 'all' || template.theme === theme
    const searchableText = [
      template.name,
      template.audience,
      template.description,
      ...template.tags,
    ]
      .join(' ')
      .toLowerCase()

    return matchesTheme && searchableText.includes(normalizedQuery)
  })

  return (
    <>
      <PageHeader eyebrow="Catalog" title="Portfolio templates">
        <p>
          Compare the available styles, scroll their live previews, and open any
          template for complete details.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container">
          <div className="catalog-controls">
            <div className="field search-field">
              <label htmlFor="template-search">Search templates</label>
              <div className="search-input">
                <Search aria-hidden="true" size={16} strokeWidth={1.75} />
                <input
                  id="template-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try developer, editorial, or architecture"
                  type="search"
                  value={query}
                />
              </div>
            </div>

            <div className="field">
              <span className="field-label" id="theme-filter-label">
                Theme
              </span>
              <div className="segmented" role="group" aria-labelledby="theme-filter-label">
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
            </div>
          </div>

          <p className="results-note" aria-live="polite">
            Showing {visibleTemplates.length} of {templates.length} templates
          </p>

          {visibleTemplates.length > 0 ? (
            <div className="template-grid">
              {visibleTemplates.map((template, index) => (
                <TemplateCard index={index} key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <Reveal className="empty-state">
              <h2>No templates found</h2>
              <p>Try a different search term or theme.</p>
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
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
