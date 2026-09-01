import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { siteConfig } from '../data/site'

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Send the template you want.">
        <p>
          Found a style you like? Send its name or a screenshot to System Forge on
          TikTok.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container two-column">
          <div className="content-block">
            <h2>Message on TikTok</h2>
            <p>
              Contact <strong>{siteConfig.tiktokHandle}</strong> to ask about a
              template, pricing, customization, or delivery.
            </p>
            <a
              className="button"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open System Forge on TikTok
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </a>
          </div>

          <div className="content-block">
            <h2>Include in your message</h2>
            <ul className="plain-list">
              <li>The template name or a screenshot</li>
              <li>What kind of portfolio you need</li>
              <li>Your preferred deadline</li>
              <li>Any changes or extra pages you want</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
