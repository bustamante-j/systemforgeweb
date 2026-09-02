import { Link } from 'react-router-dom'
import TikTokIcon from './TikTokIcon'
import { siteConfig } from '../data/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span className="footer-brand">
          © {new Date().getFullYear()} {siteConfig.brandName}
        </span>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/license">Licensing</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a
            aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
            className="footer-tiktok"
            href={siteConfig.tiktokUrl}
            rel="noreferrer"
            target="_blank"
          >
            <TikTokIcon size={13} />
            {siteConfig.tiktokHandle}
          </a>
        </nav>
      </div>
    </footer>
  )
}
