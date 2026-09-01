import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ComingSoonBadge from '../components/ComingSoonBadge'
import LivePreview from '../components/LivePreview'
import ThemeBadge from '../components/ThemeBadge'
import { getTemplateById, siteConfig } from '../data/site'
import NotFoundPage from './NotFoundPage'

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const template = getTemplateById(templateId)

  if (!template) {
    return <NotFoundPage />
  }

  // The catalog does not link upcoming templates, but their route still
  // resolves — there is no demo or feature list to show for them yet.
  const isComingSoon = template.status === 'coming-soon'

  return (
    <section className="section section-compact">
      <div className="container">
        <Link className="back-link" to="/">
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={2} />
          All templates
        </Link>

        <div className="detail-headline">
          <div>
            {isComingSoon ? <ComingSoonBadge /> : null}
            <h1>{template.name}</h1>
            <p className="template-audience">{template.audience}</p>
          </div>
          <ThemeBadge theme={template.theme} />
        </div>

        {isComingSoon ? (
          <div className="upcoming-panel upcoming-panel-detail">
            <p>{template.description}</p>
          </div>
        ) : (
          <LivePreview template={template} />
        )}

        <div className="detail-actions">
          {isComingSoon ? (
            <a
              aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok for ${template.name} updates`}
              className="button"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              Follow on TikTok
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </a>
          ) : (
            <>
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
                Order on TikTok
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </a>
            </>
          )}
        </div>

        <div className="detail-meta">
          {isComingSoon ? null : (
            <div>
              <p className="eyebrow">Includes</p>
              <ul className="feature-list">
                {template.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" size={15} strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="eyebrow">Tags</p>
            <ul className="tag-list" aria-label={`${template.name} categories`}>
              {template.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
