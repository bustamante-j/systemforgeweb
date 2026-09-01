import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section section-compact">
      <div className="container content-block">
        <p className="eyebrow">Error 404</p>
        <h1>Page not found</h1>
        <Link className="button" to="/">
          Browse templates
          <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
        </Link>
      </div>
    </section>
  )
}
