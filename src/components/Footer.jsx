import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig, templates } from '../data/site'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>{siteConfig.brandName}</strong>
            <p>{siteConfig.tagline}</p>
          </div>

          <div className="footer-col">
            <h2>Catalog</h2>
            <nav className="footer-links" aria-label="Template navigation">
              {templates.map((template) => (
                <Link key={template.id} to={`/templates/${template.id}`}>
                  {template.name}
                </Link>
              ))}
              <Link to="/templates">All templates</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h2>Company</h2>
            <nav className="footer-links" aria-label="Footer navigation">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/license">Licensing</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <a href={siteConfig.tiktokUrl} rel="noreferrer" target="_blank">
                TikTok
                <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </a>
            </nav>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} System Forge</span>
          <span>{siteConfig.tiktokHandle}</span>
        </div>
      </div>
    </footer>
  )
}
