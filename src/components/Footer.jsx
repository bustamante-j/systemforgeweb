import { Link } from 'react-router-dom'
import { siteConfig } from '../data/site'
import TikTokIcon from './TikTokIcon'

const legalLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/license', label: 'Licensing' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export default function Footer({ navOpen }) {
  return (
    <footer className="site-footer" inert={navOpen}>
      <div className="container">
        {/* The wordmark finally set at the size it wants to be, clipped by the
            viewport rather than fitted into it. */}
        <span className="footer-wordmark display" aria-hidden="true">
          <span>System</span>
          <span>Forge</span>
        </span>

        <div className="footer-inner">
          <span className="readout">
            © {new Date().getFullYear()} {siteConfig.brandName}
          </span>

          <nav className="footer-links" aria-label="Footer navigation">
            {legalLinks.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
            <a
              aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
              className="footer-tiktok"
              href={siteConfig.tiktokUrl}
              rel="noreferrer"
              target="_blank"
            >
              <TikTokIcon size={12} />
              {siteConfig.tiktokHandle}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
