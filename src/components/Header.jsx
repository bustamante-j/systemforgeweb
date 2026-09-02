import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import TikTokIcon from './TikTokIcon'
import { siteConfig } from '../data/site'

const navItems = [
  { to: '/', label: 'Templates', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link" to="/" aria-label="System Forge home">
          <img className="brand-logo" src="/system-forge-logo.svg" alt="System Forge" />
        </Link>

        <nav
          aria-label="Main navigation"
          className="site-nav"
          data-open={open}
          id="main-nav"
          onClick={() => setOpen(false)}
        >
          {navItems.map(({ to, label, end }) => (
            <NavLink className="nav-link" end={end} key={to} to={to}>
              {label}
            </NavLink>
          ))}
          <a
            aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
            className="nav-link nav-cta"
            href={siteConfig.tiktokUrl}
            rel="noreferrer"
            target="_blank"
          >
            <TikTokIcon size={14} />
            {siteConfig.tiktokHandle}
            <ArrowUpRight aria-hidden="true" size={13} strokeWidth={2} />
          </a>
        </nav>

        <button
          aria-controls="main-nav"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          className="nav-toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? (
            <X aria-hidden="true" size={20} strokeWidth={1.75} />
          ) : (
            <Menu aria-hidden="true" size={20} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </header>
  )
}
