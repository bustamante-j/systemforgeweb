import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Menu } from 'lucide-react'
import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/motion'
import { navItems } from '../data/nav'
import { siteConfig } from '../data/site'
import BrandMark from './BrandMark'
import TikTokIcon from './TikTokIcon'

export default function Header({ navOpen, onToggleNav, toggleRef }) {
  const root = useRef(null)

  useGSAP(
    () => {
      // Read position straight onto a transform. A scroll listener writing
      // width would lay the page out again on every frame; this is one
      // composited scale that the browser can keep off the main thread.
      const progress = root.current.querySelector('.header-progress')

      const trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
      })

      return () => trigger.kill()
    },
    { scope: root },
  )

  return (
    <header className="site-header" ref={root}>
      <div className="container header-inner">
        <Link className="brand-link" to="/" aria-label="System Forge home">
          <BrandMark />
          <span className="brand-wordmark" aria-hidden="true">
            <span>System</span>
            <span>Forge</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="site-nav">
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
            <TikTokIcon size={13} />
            {siteConfig.tiktokHandle}
            <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.75} />
          </a>
        </nav>

        <button
          aria-controls="nav-overlay"
          aria-expanded={navOpen}
          aria-label="Open navigation menu"
          className="nav-toggle"
          onClick={onToggleNav}
          ref={toggleRef}
          type="button"
        >
          <Menu aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="header-progress" aria-hidden="true" />
    </header>
  )
}
