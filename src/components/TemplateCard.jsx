import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LivePreview from './LivePreview'
import ThemeBadge from './ThemeBadge'

export default function TemplateCard({ template, headingLevel = 2, index = 0 }) {
  const Heading = `h${headingLevel}`

  return (
    <article className="template-card">
      <div className="template-card-head">
        <span className="template-index">{String(index + 1).padStart(2, '0')}</span>
        <ThemeBadge theme={template.theme} />
      </div>

      <LivePreview template={template} />

      <div className="template-card-body">
        <Heading>{template.name}</Heading>
        <p className="template-audience">{template.audience}</p>
        <p>{template.description}</p>
        <ul className="tag-list" aria-label={`${template.name} categories`}>
          {template.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button" to={`/templates/${template.id}`}>
            View template
          </Link>
          <a
            className="button button-secondary"
            href={template.demoUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open demo
            <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  )
}
