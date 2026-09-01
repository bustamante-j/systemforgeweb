import { Link } from 'react-router-dom'
import { siteConfig } from '../data/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          <strong>{siteConfig.brandName}</strong>
          <p>Portfolio templates today. More web-based systems on the way.</p>
          <small>© {new Date().getFullYear()} System Forge</small>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/license">Licensing</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href={siteConfig.tiktokUrl} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </nav>
      </div>
    </footer>
  )
}
