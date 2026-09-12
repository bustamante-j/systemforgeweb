import { useCallback, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import NavOverlay from './NavOverlay'

export default function Layout() {
  const toggleRef = useRef(null)
  const { pathname } = useLocation()

  // The menu remembers which route it was opened on, so any navigation —
  // its own links, the browser's back button — closes it as a matter of
  // derivation rather than an effect that re-renders to catch up.
  const [nav, setNav] = useState({ open: false, at: pathname })
  const navOpen = nav.open && nav.at === pathname

  const closeNav = useCallback(() => {
    setNav((value) => ({ ...value, open: false }))
    // Send focus back where it came from rather than dropping it at the top of
    // the document.
    toggleRef.current?.focus()
  }, [])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Header
        navOpen={navOpen}
        onToggleNav={() => setNav({ open: !navOpen, at: pathname })}
        toggleRef={toggleRef}
      />
      <NavOverlay onClose={closeNav} open={navOpen} />

      {/* While the menu is open the page behind it is genuinely unreachable,
          which is what keeps focus inside the overlay without a manual trap. */}
      <main className="main-content" id="main-content" inert={navOpen}>
        <Outlet />
      </main>
      <Footer navOpen={navOpen} />

      <div className="grain" aria-hidden="true" />
    </div>
  )
}
