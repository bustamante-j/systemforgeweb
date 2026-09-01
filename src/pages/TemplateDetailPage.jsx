import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CatalogStatus from '../components/CatalogStatus'
import LivePreview from '../components/LivePreview'
import { siteConfig } from '../data/site'
import { useTemplates } from '../hooks/useTemplates'
import NotFoundPage from './NotFoundPage'

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const { error, retry, status, templates } = useTemplates()
  const template = templates.find((item) => item.id === templateId)
  const [copyState, setCopyState] = useState('Copy template name')

  if (status === 'loading' || status === 'error') {
    return (
      <section className="section">
        <div className="container">
          <CatalogStatus error={error} retry={retry} status={status} />
        </div>
      </section>
    )
  }

  if (!template) {
    return <NotFoundPage />
  }

  async function copyTemplateName() {
    try {
      await navigator.clipboard.writeText(template.name)
      setCopyState('Copied')
    } catch {
      setCopyState(`Copy: ${template.name}`)
    }
  }

  return (
    <>
      <section className="section">
        <div className="container detail-header">
          <div>
            <Link className="back-link" to="/templates">
              ← Back to templates
            </Link>
            <h1>{template.name}</h1>
            <p className="page-intro">{template.description}</p>
            <p>
              <strong>Best suited for:</strong> {template.audience}
            </p>
            <ul className="tag-list" aria-label={`${template.name} categories`}>
              {template.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className="button-row">
              <a className="button" href={template.demoUrl} target="_blank" rel="noreferrer">
                Open full live demo
              </a>
              <a
                className="button button-secondary"
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noreferrer"
              >
                Message on TikTok
              </a>
            </div>
          </div>
          <LivePreview large template={template} />
        </div>
      </section>

      <section className="section section-surface">
        <div className="container two-column">
          <div className="content-block">
            <h2>Included in this style</h2>
            <ul className="feature-list">
              {template.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="content-block">
            <h2>Request this template</h2>
            <ol className="steps-list">
              <li>Open the live demo and review the complete page.</li>
              <li>Take a screenshot of this template or the section you like.</li>
              <li>Copy the template name below.</li>
              <li>Message {siteConfig.tiktokHandle} on TikTok to continue.</li>
            </ol>
            <div className="button-row">
              <button className="button button-muted" onClick={copyTemplateName} type="button">
                {copyState}
              </button>
              <a className="button" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
                Go to TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
