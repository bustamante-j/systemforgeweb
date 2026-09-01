import { useState } from 'react'
import CatalogStatus from '../components/CatalogStatus'
import PageHeader from '../components/PageHeader'
import TemplateCard from '../components/TemplateCard'
import { useTemplates } from '../hooks/useTemplates'

export default function TemplatesPage() {
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('all')
  const { error, retry, status, templates } = useTemplates()

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
      <PageHeader title="Portfolio templates">
        <p>
          Compare the available styles, inspect their live previews, and open any
          template for complete details.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container">
          <CatalogStatus error={error} retry={retry} status={status} />

          {status === 'success' ? (
            <>
              <div className="catalog-controls" aria-label="Template filters">
                <div className="field">
                  <label htmlFor="template-search">Search templates</label>
                  <input
                    id="template-search"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try developer, editorial, or architecture"
                    type="search"
                    value={query}
                  />
                </div>
                <div className="field">
                  <label htmlFor="theme-filter">Theme</label>
                  <select
                    id="theme-filter"
                    onChange={(event) => setTheme(event.target.value)}
                    value={theme}
                  >
                    <option value="all">All themes</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <p className="results-note" aria-live="polite">
                Showing {visibleTemplates.length} of {templates.length} templates
              </p>

              {visibleTemplates.length > 0 ? (
                <div className="template-grid">
                  {visibleTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
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
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
