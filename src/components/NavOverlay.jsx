import { useGSAP } from '@gsap/react'
import { ArrowUpRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { EASE_OUT, gsap } from '../lib/motion'
import { navItems } from '../data/nav'
import { siteConfig } from '../data/site'
import TikTokIcon from './TikTokIcon'

// A full takeover rather than a dropdown panel: the links are set at display
// size, so there is nothing for them to drop into. Layout marks the rest of the
// page inert while this is open, which keeps focus inside it without a
// hand-rolled trap.
export default function NavOverlay({ open, onClose }) {
  const root = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    // A scroll that starts on the overlay must not carry on into the catalog
    // behind it.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  useGSAP(
    () => {
      if (!open) {
        return
      }

      gsap
        .timeline({ defaults: { ease: EASE_OUT } })
        .from('.nav-overlay-head', { opacity: 0, duration: 0.4 })
        .from(
          '.nav-overlay-link a',
          { yPercent: 110, duration: 0.62, stagger: 0.055 },
          0.04,
        )
        .from('.nav-overlay-foot > *', { opacity: 0, y: 16, stagger: 0.06 }, 0.26)
    },
    { dependencies: [open], scope: root, revertOnUpdate: true },
  )

  return (
    <div
      className="nav-overlay"
      data-open={open}
      id="nav-overlay"
      ref={root}
      // The overlay stays mounted so the close button keeps its identity for
      // assistive tech; display:none while shut keeps it out of the tab order.
      inert={!open}
    >
      <div className="nav-overlay-inner">
        <div className="nav-overlay-head">
          <p className="readout">Menu</p>
          <button
            aria-label="Close navigation menu"
            className="nav-toggle"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>

        <nav aria-label="Main navigation">
          {navItems.map(({ to, label, index, end }) => (
            <div className="nav-overlay-link" key={to}>
              <NavLink end={end} onClick={onClose} to={to}>
                {label}
                <span>{index}</span>
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="nav-overlay-foot">
          <a
            aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
            className="button"
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
  )
}
