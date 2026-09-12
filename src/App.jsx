import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { EASE_OUT, gsap, prefersReducedMotion, ScrollTrigger } from './lib/motion'
import AboutPage from './pages/AboutPage'
import CatalogPage from './pages/CatalogPage'
import ContactPage from './pages/ContactPage'
import LandingPage from './pages/LandingPage'
import LicensePage from './pages/LicensePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import TemplateDetailPage from './pages/TemplateDetailPage'
import TermsPage from './pages/TermsPage'

function RouteTransition() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })

    // The page that just mounted is a different height than the one that left,
    // so every trigger position on it is stale until this runs.
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())

    if (prefersReducedMotion()) {
      return () => cancelAnimationFrame(refresh)
    }

    const main = document.getElementById('main-content')
    const sweep = document.querySelector('.route-sweep')

    // Opacity only on <main>: a transform there would make it the containing
    // block for the hero's pinned stage and quietly break the forge.
    const tl = gsap
      .timeline()
      .fromTo(
        main,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: EASE_OUT, clearProps: 'opacity' },
      )
      .fromTo(
        sweep,
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.42, ease: 'power2.in' },
        0,
      )
      .to(sweep, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.42, ease: EASE_OUT })

    return () => {
      cancelAnimationFrame(refresh)
      tl.kill()
    }
  }, [pathname])

  return <div className="route-sweep" aria-hidden="true" />
}

function App() {
  return (
    <BrowserRouter>
      <RouteTransition />
      <Routes>
        <Route element={<Layout />}>
          {/* The front door is the landing page now; the catalog is a
              destination you navigate to rather than the thing you land on. */}
          <Route index element={<LandingPage />} />
          <Route path="templates" element={<CatalogPage />} />
          <Route path="templates/:templateId" element={<TemplateDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="license" element={<LicensePage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
