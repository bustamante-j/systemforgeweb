import { Link } from 'react-router-dom'
import TemplateCard from '../components/TemplateCard'
import { siteConfig, templates } from '../data/site'

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="container hero">
          <div>
            <h1>Choose a portfolio that fits your work.</h1>
            <p className="hero-copy">
              System Forge creates ready-to-use portfolio website templates for
              professionals who want a clear place to present their work online.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/templates">
                Browse all templates
              </Link>
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

          <aside className="hero-summary" aria-label="How System Forge works">
            <h2>Simple ordering</h2>
            <p>Browse the live demos and choose the style you prefer.</p>
            <p>
              Take a screenshot, then message {siteConfig.tiktokHandle} on TikTok
              to discuss your website.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section-surface" aria-labelledby="available-title">
        <div className="container">
          <div className="section-heading">
            <h2 id="available-title">Available templates</h2>
            <p>Open any template to inspect the full live website.</p>
          </div>
          <div className="template-grid">
            {templates.map((template) => (
              <TemplateCard headingLevel={3} key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div className="content-block">
            <h2>How to order</h2>
            <ol className="steps-list">
              <li>Browse a template and open its full live demo.</li>
              <li>Take a screenshot of the style you want.</li>
              <li>Send the screenshot to System Forge on TikTok.</li>
              <li>Discuss your content, requirements, price, and delivery.</li>
            </ol>
          </div>
          <div className="content-block">
            <h2>More systems are coming</h2>
            <p>
              System Forge currently focuses on portfolio websites. The catalog is
              structured to expand into more complex web-based systems later.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
