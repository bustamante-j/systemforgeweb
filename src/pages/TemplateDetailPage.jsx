import { ArrowLeft, ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LivePreview from '../components/LivePreview'
import ThemeBadge from '../components/ThemeBadge'
import { getTemplateById, siteConfig, templates } from '../data/site'
import NotFoundPage from './NotFoundPage'

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const template = getTemplateById(templateId)
  const [copied, setCopied] = useState(false)

  if (!template) {
    return <NotFoundPage />
  }

  const position = templates.findIndex((item) => item.id === template.id) + 1

  async function copyTemplateName() {
    try {
      await navigator.clipboard.writeText(template.name)
    } catch {
      // Clipboard access can be blocked; the name stays visible in the spec list.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  return (
    <>
      <section className="section section-compact">
        <div className="container">
          <Link className="back-link" to="/templates">
            <ArrowLeft aria-hidden="true" size={14} strokeWidth={2} />
            All templates
          </Link>

          <div className="detail-headline">
            <div>
              <p className="eyebrow">
                Template {String(position).padStart(2, '0')} / {String(templates.length).padStart(2, '0')}
              </p>
              <h1>{template.name}</h1>
              <p className="page-intro">{template.description}</p>
            </div>
            <ThemeBadge theme={template.theme} />
          </div>

          <LivePreview large template={template} />
        </div>
      </section>

      <section className="section section-surface">
        <div className="container detail-body">
          <div className="content-block">
            <h2>Included in this style</h2>
            <ul className="feature-list">
              {template.features.map((feature) => (
                <li key={feature}>
                  <Check aria-hidden="true" size={16} strokeWidth={2} />
                  {feature}
                </li>
              ))}
            </ul>

            <h2>How to request it</h2>
            <ol className="steps-list">
              <li>Open the live demo and review the complete page.</li>
              <li>Take a screenshot of this template or the section you like.</li>
              <li>Copy the template name from the panel.</li>
              <li>Message {siteConfig.tiktokHandle} on TikTok to continue.</li>
            </ol>
          </div>

          <aside className="detail-aside" aria-label={`${template.name} summary`}>
            <h2>Template details</h2>

            <dl className="spec-table">
              <div>
                <dt>Name</dt>
                <dd>{template.name}</dd>
              </div>
              <div>
                <dt>Theme</dt>
                <dd>{template.theme === 'dark' ? 'Dark' : 'Light'}</dd>
              </div>
              <div>
                <dt>Built for</dt>
                <dd>{template.audience}</dd>
              </div>
              <div>
                <dt>Sections</dt>
                <dd>{template.features.length}</dd>
              </div>
            </dl>

            <ul className="tag-list" aria-label={`${template.name} categories`}>
              {template.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className="button-row">
              <a className="button" href={template.demoUrl} rel="noreferrer" target="_blank">
                Open full demo
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </a>
              <a
                className="button button-secondary"
                href={siteConfig.tiktokUrl}
                rel="noreferrer"
                target="_blank"
              >
                Message on TikTok
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </a>
              <button className="button button-muted" onClick={copyTemplateName} type="button">
                {copied ? (
                  <Check aria-hidden="true" size={14} strokeWidth={2} />
                ) : (
                  <Copy aria-hidden="true" size={14} strokeWidth={2} />
                )}
                {copied ? 'Name copied' : 'Copy template name'}
              </button>
            </div>
            <p className="results-note" aria-live="polite" style={{ marginBottom: 0 }}>
              {copied ? `${template.name} copied to clipboard` : ''}
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
