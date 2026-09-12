import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig, visibleTags } from '../data/site'
import ComingSoonBadge from './ComingSoonBadge'
import LivePreview from './LivePreview'
import PremiumBadge from './PremiumBadge'
import PriceTag from './PriceTag'
import ThemeBadge from './ThemeBadge'
import TikTokIcon from './TikTokIcon'

// One template, presented at the size the work deserves. The stage takes seven
// of twelve columns and swaps sides down the rail, so no two read the same way
// and the eye never settles into a grid.
export default function Specimen({ index, side, template }) {
  const isPremium = template.tier === 'premium'
  const isComingSoon = template.status === 'coming-soon'
  const plate = String(index).padStart(2, '0')

  return (
    <article className="specimen" data-side={side}>
      <div className="specimen-stage">
        {/* Drifts against the scroll, which is what separates the plate number
            from the plate it is stamped on. */}
        <span className="specimen-index" aria-hidden="true" data-parallax="-26">
          {plate}
        </span>

        {isComingSoon ? (
          <div className="specimen-upcoming" data-reveal="wipe">
            <ComingSoonBadge />
            <p>{template.description}</p>
          </div>
        ) : (
          <Link
            aria-label={`View ${template.name}`}
            className="preview-link"
            data-reveal="wipe"
            to={`/templates/${template.id}`}
          >
            <LivePreview template={template} />
            {/* Follows the pointer across the frame. The demo inside is inert,
                so without this there is nothing telling you the picture is a
                door. */}
            <span className="specimen-cursor" aria-hidden="true">
              Open
            </span>
          </Link>
        )}
      </div>

      <div className="specimen-spec">
        <p className="readout">
          Plate {plate} — {isComingSoon ? 'Unfinished' : 'Live'}
        </p>

        <h4 className="specimen-name">
          {isComingSoon ? (
            template.name
          ) : (
            <Link to={`/templates/${template.id}`}>{template.name}</Link>
          )}
        </h4>

        <p className="specimen-audience">{template.audience}</p>

        <div className="specimen-meta badge-row">
          {isPremium ? <PremiumBadge /> : null}
          {isComingSoon ? null : <PriceTag price={template.price} />}
          <ThemeBadge theme={template.theme} />
        </div>

        {isComingSoon ? null : <p className="specimen-desc">{template.description}</p>}

        <ul className="tag-list" aria-label={`${template.name} categories`}>
          {visibleTags(template).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="specimen-actions">
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
              <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
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
                Full demo
                <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} />
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
