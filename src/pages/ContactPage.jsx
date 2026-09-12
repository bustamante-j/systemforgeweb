import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import OrderSteps from '../components/OrderSteps'
import PageHeader from '../components/PageHeader'
import TikTokIcon from '../components/TikTokIcon'
import { siteConfig } from '../data/site'
import { sectionMotion } from '../lib/motion'

export default function ContactPage() {
  const root = useRef(null)
  useGSAP(() => sectionMotion(root.current), { scope: root })

  return (
    <div ref={root}>
      <PageHeader eyebrow="Contact" title="Order a template">
        <p>
          Message <strong>{siteConfig.tiktokHandle}</strong> with the template name or a
          screenshot. Seven steps, start to finished link.
        </p>
      </PageHeader>

      <section aria-labelledby="how-to-order" className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">01</span>
            <h2 className="section-marker-label marker" id="how-to-order">
              How ordering works
            </h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <OrderSteps />

          <div className="notice">
            <p>
              You can also send the whole amount at the start — steps 3 and 6 then become a
              single payment.
            </p>
          </div>

          <a className="button" href={siteConfig.tiktokUrl} rel="noreferrer" target="_blank">
            <TikTokIcon size={13} />
            <span>Message on TikTok</span>
            <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
          </a>
        </div>
      </section>
    </div>
  )
}
