import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import TikTokIcon from '../components/TikTokIcon'
import { siteConfig, templates } from '../data/site'
import { sectionMotion } from '../lib/motion'

const live = templates.filter((template) => template.status === 'available').length

// Three facts, so three statements — set at display scale rather than padded
// out into paragraphs that say the same thing at greater length. They are
// labelled rather than numbered: they are not a sequence, and a second 01
// under the section's own 01 reads as a mistake.
const claims = [
  {
    label: 'Build',
    text: 'A complete, responsive website — not a page mockup.',
  },
  {
    label: 'Proof',
    text: 'Public demos — you see the real thing before you pay.',
  },
  {
    label: 'Process',
    text: 'Content and changes, worked out over TikTok.',
  },
]

export default function AboutPage() {
  const root = useRef(null)
  useGSAP(() => sectionMotion(root.current), { scope: root })

  return (
    <div ref={root}>
      <PageHeader eyebrow="About" title="System Forge">
        <p>
          Finished websites, sold as templates. <strong>{live} live</strong> right now,
          each one running on the catalog page.
        </p>
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">01</span>
            <h2 className="section-marker-label marker">How this works</h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <ul className="claims">
            {claims.map((claim) => (
              <li key={claim.label}>
                <b>{claim.label}</b>
                <p>{claim.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="container cta-panel">
          <h2 className="cta-title" data-reveal="lines">
            Have a look.
          </h2>

          <div className="cta-foot">
            <p data-reveal="up">
              {live} finished websites, running rather than described.
            </p>

            <div className="cta-actions" data-stagger>
              <Link className="button" to="/templates">
                <span>Browse templates</span>
              </Link>
              <a
                aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
                className="button button-secondary"
                href={siteConfig.tiktokUrl}
                rel="noreferrer"
                target="_blank"
              >
                <TikTokIcon size={13} />
                <span>{siteConfig.tiktokHandle}</span>
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
