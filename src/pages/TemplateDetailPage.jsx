import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ComingSoonBadge from '../components/ComingSoonBadge'
import LivePreview from '../components/LivePreview'
import PremiumBadge from '../components/PremiumBadge'
import PriceTag from '../components/PriceTag'
import ThemeBadge from '../components/ThemeBadge'
import TikTokIcon from '../components/TikTokIcon'
import {
  categoryOf,
  getTemplateById,
  siteConfig,
  templates,
  visibleTags,
} from '../data/site'
import { sectionMotion } from '../lib/motion'
import NotFoundPage from './NotFoundPage'

// The next template to look at, so the detail page has somewhere to go that is
// not the back button. Prefers the next one on the same shelf and only then
// wraps into the rest of the catalog, so browsing stays inside a category.
function nextTemplate(current) {
  const order = templates.filter((template) => template.status === 'available')
  const sameShelf = order.filter((template) => template.category === current.category)
  const within = sameShelf.length > 1 ? sameShelf : order
  const at = within.findIndex((template) => template.id === current.id)
  return within[(at + 1) % within.length] ?? order[0]
}

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const root = useRef(null)
  const template = getTemplateById(templateId)

  useGSAP(() => (template ? sectionMotion(root.current) : undefined), {
    dependencies: [templateId],
    revertOnUpdate: true,
    scope: root,
  })

  if (!template) {
    return <NotFoundPage />
  }

  // The catalog does not link upcoming templates, but their route still
  // resolves — there is no demo or feature list to show for them yet.
  const isComingSoon = template.status === 'coming-soon'
  const isPremium = template.tier === 'premium'
  const shelf = categoryOf(template.category)
  const next = nextTemplate(template)

  return (
    <div ref={root}>
      <div className="container case-head">
        <Link className="text-link back-link" to="/">
          <ArrowLeft aria-hidden="true" size={12} strokeWidth={1.75} />
          All templates
        </Link>

        <div className="badge-row case-badges">
          <span className="badge badge-category">{shelf.label}</span>
          {isPremium ? <PremiumBadge /> : null}
          {isComingSoon ? <ComingSoonBadge /> : null}
        </div>

        <h1 className="case-title" data-reveal="lines">
          {template.name}
        </h1>

        <div className="case-lede">
          <p>{template.description}</p>
          <div className="case-lede-meta">
            {isComingSoon ? null : <PriceTag price={template.price} />}
            <ThemeBadge theme={template.theme} />
            <ul className="tag-list" aria-label={`${template.name} categories`}>
              {visibleTags(template).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container case-stage">
        {isComingSoon ? (
          <div className="case-placeholder" data-reveal="wipe">
            <ComingSoonBadge />
            <p>No demo yet — this one is still being built.</p>
          </div>
        ) : (
          <div data-reveal="wipe">
            <LivePreview priority template={template} />
          </div>
        )}
      </div>

      <div className="container">
        <div className="case-actions" data-stagger>
          {isComingSoon ? (
            <a
              aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok for ${template.name} updates`}
              className="button"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              <TikTokIcon size={13} />
              <span>Follow for updates</span>
              <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
            </a>
          ) : (
            <>
              <a
                className="button"
                href={siteConfig.tiktokUrl}
                rel="noreferrer"
                target="_blank"
              >
                <TikTokIcon size={13} />
                <span>Order this template</span>
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </a>
              <a
                className="button button-secondary"
                href={template.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <span>Open the full demo</span>
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </a>
            </>
          )}
        </div>

        <div className="case-meta">
          <div>
            <p className="eyebrow">{isComingSoon ? 'Status' : 'What you get'}</p>
            {isComingSoon ? (
              <p>
                Still being built. New templates are announced on TikTok first, demo
                included.
              </p>
            ) : (
              <ul className="feature-list">
                {template.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="case-side">
            <div>
              <p className="eyebrow">Built for</p>
              <p className="case-audience">{template.audience}</p>
            </div>

            <div>
              <p className="eyebrow">Category</p>
              <p className="case-category">
                <Link to="/">{shelf.label}</Link>
                {shelf.blurb ? <span>{shelf.blurb}</span> : null}
              </p>
            </div>
          </div>
        </div>

        <Link className="case-next" to={`/templates/${next.id}`}>
          <span className="case-next-body">
            <span className="readout">Next template</span>
            <span className="case-next-name">{next.name}</span>
          </span>
          <ArrowRight aria-hidden="true" size={28} strokeWidth={1.25} />
        </Link>
      </div>
    </div>
  )
}
