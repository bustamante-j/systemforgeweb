import { Link } from 'react-router-dom'
import LivePreview from './LivePreview'

export default function TemplateCard({ template, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`

  return (
    <article className="template-card">
      <LivePreview template={template} />
      <div className="template-card-body">
        <Heading>{template.name}</Heading>
        <p>{template.description}</p>
        <ul className="tag-list" aria-label={`${template.name} categories`}>
          {template.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button" to={`/templates/${template.id}`}>
            View details
          </Link>
          <a className="button button-secondary" href={template.demoUrl} target="_blank" rel="noreferrer">
            Open demo
          </a>
        </div>
      </div>
    </article>
  )
}
