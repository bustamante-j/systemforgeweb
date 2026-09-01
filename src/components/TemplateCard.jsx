import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LivePreview from './LivePreview'
import ThemeBadge from './ThemeBadge'

export default function TemplateCard({ template }) {
  return (
    <article className="template-card">
      <Link
        aria-label={`View ${template.name}`}
        className="preview-link"
        to={`/templates/${template.id}`}
      >
        <LivePreview template={template} />
      </Link>

      <div className="template-card-body">
        <h2>
          <Link to={`/templates/${template.id}`}>{template.name}</Link>
        </h2>
        <ThemeBadge theme={template.theme} />
        <p className="template-audience">{template.audience}</p>
        <a
          className="demo-link"
          href={template.demoUrl}
          rel="noreferrer"
          target="_blank"
        >
          Demo
          <ArrowUpRight aria-hidden="true" size={13} strokeWidth={2} />
        </a>
      </div>
    </article>
  )
}
