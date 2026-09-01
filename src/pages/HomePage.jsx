import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LivePreview from '../components/LivePreview'
import Reveal from '../components/Reveal'
import TemplateShowcase from '../components/TemplateShowcase'
import ThemeBadge from '../components/ThemeBadge'
import { siteConfig, templates } from '../data/site'

const featured = templates[0]

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="container hero">
          <div>
            <p className="eyebrow">Portfolio website templates</p>
            <h1 className="hero-title">
              Show your work on a site that <em>already looks finished.</em>
            </h1>
            <p className="hero-copy">
              Every System Forge template is a complete, responsive website you can
              inspect live before you order. Pick the one that fits your work.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/templates">
                Browse the catalog
                <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
              </Link>
              <a
                className="button button-secondary"
                href={siteConfig.tiktokUrl}
                rel="noreferrer"
                target="_blank"
              >
                Message on TikTok
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </a>
            </div>

            <dl className="hero-stats">
              <div>
                <dt>{String(templates.length).padStart(2, '0')}</dt>
                <dd>Templates ready</dd>
              </div>
              <div>
                <dt>Live</dt>
                <dd>Preview on every card</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>Responsive layouts</dd>
              </div>
            </dl>
          </div>

          <div className="showcase-media">
            <div className="hero-showcase-meta">
              <span className="template-index">Featured — {featured.name}</span>
              <ThemeBadge theme={featured.theme} />
            </div>
            <LivePreview template={featured} />
          </div>
        </div>
      </section>

      <section className="section section-surface" aria-labelledby="catalog-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The catalog</p>
              <h2 id="catalog-title">Every template, running live.</h2>
            </div>
            <p>
              Hover a preview to scroll through the page, or open the full demo in a
              new tab.
            </p>
          </div>

          <div className="showcase-list">
            {templates.map((template, index) => (
              <Reveal key={template.id}>
                <TemplateShowcase index={index} template={template} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ordering-title">
        <div className="container two-column">
          <div className="content-block">
            <p className="eyebrow">Ordering</p>
            <h2 id="ordering-title">Four steps from preview to launch.</h2>
            <ol className="steps-list">
              <li>Browse a template and open its full live demo.</li>
              <li>Take a screenshot of the style you want.</li>
              <li>Send the screenshot to System Forge on TikTok.</li>
              <li>Discuss your content, requirements, price, and delivery.</li>
            </ol>
            <Link className="text-link" to="/templates">
              Start browsing
              <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
            </Link>
          </div>

          <div className="content-block">
            <p className="eyebrow">Roadmap</p>
            <h2>More systems are coming.</h2>
            <p>
              System Forge currently focuses on portfolio websites. The catalog is
              structured to expand into more complex web-based systems later.
            </p>
            <ul className="plain-list">
              <li>Complete, responsive single-page layouts</li>
              <li>Sections written for real client work</li>
              <li>Customization discussed directly with you</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="container cta-band">
          <div>
            <h2>Found the one?</h2>
            <p>
              Send the template name or a screenshot to {siteConfig.tiktokHandle} and
              we can talk through your content, timeline, and price.
            </p>
          </div>
          <div className="button-row">
            <a
              className="button button-secondary"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              Message on TikTok
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
