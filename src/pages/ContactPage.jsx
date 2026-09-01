import PageHeader from '../components/PageHeader'
import { siteConfig } from '../data/site'

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact System Forge">
        <p>
          Found a template you like? Send its name or a screenshot to System Forge
          on TikTok.
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
            <a className="button" href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
              Open System Forge on TikTok
            </a>
          </div>
          <div className="content-block">
            <h2>Include in your message</h2>
            <ul>
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
