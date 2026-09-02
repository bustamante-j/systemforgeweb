import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import TikTokIcon from '../components/TikTokIcon'
import { siteConfig } from '../data/site'

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Order a template">
        <p>
          Message <strong>{siteConfig.tiktokHandle}</strong> with the template name
          or a screenshot.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container content-block">
          <ul className="plain-list">
            <li>The template you want</li>
            <li>What the portfolio is for</li>
            <li>Your deadline</li>
            <li>Any changes or extra pages</li>
          </ul>
          <a className="button" href={siteConfig.tiktokUrl} rel="noreferrer" target="_blank">
            <TikTokIcon size={14} />
            Message on TikTok
            <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
          </a>
        </div>
      </section>
    </>
  )
}
