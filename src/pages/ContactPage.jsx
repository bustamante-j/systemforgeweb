import { ArrowUpRight } from 'lucide-react'
import OrderSteps from '../components/OrderSteps'
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

      <section aria-labelledby="how-to-order" className="section section-compact">
        <div className="container content-block">
          <h2 id="how-to-order">How to order</h2>

          <OrderSteps />

          <p className="notice">
            You can also send the entire payment at the start — steps 3 and 6
            then become a single payment.
          </p>

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
