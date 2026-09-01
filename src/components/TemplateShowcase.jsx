import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LivePreview from './LivePreview'
import ThemeBadge from './ThemeBadge'

export default function TemplateShowcase({ template, index = 0 }) {
  return (
    <article className="template-showcase">
      <div className="showcase-media">
        <div className="hero-showcase-meta">
          <span className="template-index">
            {String(index + 1).padStart(2, '0')} / {template.id}
          </span>
          <ThemeBadge theme={template.theme} />
        </div>
        <LivePreview template={template} />
      </div>

      <div className="showcase-body">
        <h3>{template.name}</h3>
        <p>{template.description}</p>

        <dl className="showcase-specs">
          <div>
            <dt>Built for</dt>
            <dd>{template.audience}</dd>
          </div>
          <div>
            <dt>Includes</dt>
            <dd>{template.features.length} documented sections</dd>
          </div>
          <div>
            <dt>Tags</dt>
            <dd>{template.tags.join(' · ')}</dd>
          </div>
        </dl>

        <div className="button-row">
          <Link className="button" to={`/templates/${template.id}`}>
            View template
            <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
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
