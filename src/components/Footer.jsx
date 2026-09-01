import { Link } from 'react-router-dom'
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
          <a href={siteConfig.tiktokUrl} rel="noreferrer" target="_blank">
            {siteConfig.tiktokHandle}
          </a>
        </nav>
      </div>
    </footer>
  )
}
