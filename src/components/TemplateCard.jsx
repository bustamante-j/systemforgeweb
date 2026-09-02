import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../data/site'
import ComingSoonBadge from './ComingSoonBadge'
import LivePreview from './LivePreview'
import PremiumBadge from './PremiumBadge'
import PriceTag from './PriceTag'
import ThemeBadge from './ThemeBadge'

export default function TemplateCard({ template }) {
  const isPremium = template.tier === 'premium'

  // Upcoming templates have no demo to preview and nothing to order yet, so the
  // card is a teaser: badge, description, theme, and a follow link.
  if (template.status === 'coming-soon') {
    return (
      <article className="template-card template-card-upcoming">
        <div className="upcoming-panel">
          <div className="badge-row">
            <ComingSoonBadge />
            {isPremium ? <PremiumBadge /> : null}
          </div>
          <p>{template.description}</p>
        </div>

        <div className="template-card-body">
          <h3>{template.name}</h3>
          <ThemeBadge theme={template.theme} />
          <p className="template-audience">{template.audience}</p>
        </div>

        <a
          aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok for ${template.name} updates`}
          className="button button-secondary"
          href={siteConfig.tiktokUrl}
          rel="noreferrer"
          target="_blank"
        >
          Follow on TikTok
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
        </a>
      </article>
    )
  }

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
        <h3>
          <Link to={`/templates/${template.id}`}>{template.name}</Link>
        </h3>
        <div className="template-card-meta">
          {isPremium ? <PremiumBadge /> : null}
          <PriceTag price={template.price} />
          <ThemeBadge theme={template.theme} />
        </div>
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
