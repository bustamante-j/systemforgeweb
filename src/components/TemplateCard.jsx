import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig, visibleTags } from '../data/site'
import ComingSoonBadge from './ComingSoonBadge'
import LivePreview from './LivePreview'
import ThemeBadge from './ThemeBadge'
import TikTokIcon from './TikTokIcon'

// "Developers, IT students" has to survive being read as "For developers, IT
// students" — only the first letter comes down, never the whole line.
function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

// One template on the shelf. Every card is the same shape — picture, name,
// who it is for, then the two ways out of it — so a shelf of them reads
// as a catalog you can scan rather than a series of set pieces.
export default function TemplateCard({ template }) {
  const isPremium = template.tier === 'premium'
  const isComingSoon = template.status === 'coming-soon'

  return (
    <article className="card" data-soon={isComingSoon}>
      <div className="card-media">
        {isComingSoon ? (
          <div className="card-placeholder">
            <ComingSoonBadge />
          </div>
        ) : (
          <Link
            aria-label={`View ${template.name}`}
            className="preview-link"
            to={`/templates/${template.id}`}
          >
            <LivePreview template={template} />
            {/* The demo inside the frame is inert, so nothing about it says
                "this is a link". This does, on hover and on focus. */}
            <span className="card-open" aria-hidden="true">
              View template
            </span>
          </Link>
        )}

        {isPremium ? <span className="card-flag">Premium</span> : null}
      </div>

      <div className="card-body">
        <div className="card-head">
          <h3 className="card-name">
            {isComingSoon ? (
              template.name
            ) : (
              <Link to={`/templates/${template.id}`}>{template.name}</Link>
            )}
          </h3>
          {isComingSoon ? <span className="card-soon readout">Soon</span> : null}
        </div>

        <p className="card-audience">For {lowerFirst(template.audience)}</p>
        <p className="card-desc">{template.description}</p>

        <div className="card-meta">
          <ThemeBadge theme={template.theme} />
          <ul className="tag-list" aria-label={`${template.name} categories`}>
            {visibleTags(template).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="card-actions">
          {isComingSoon ? (
            <a
              aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok for ${template.name} updates`}
              className="button button-ghost"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              <TikTokIcon size={13} />
              <span>Follow for updates</span>
            </a>
          ) : (
            <>
              <Link className="button button-secondary" to={`/templates/${template.id}`}>
                <span>View template</span>
              </Link>
              <a
                className="text-link"
                href={template.demoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Live demo
                <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} />
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
