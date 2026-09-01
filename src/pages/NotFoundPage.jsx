import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container content-block">
        <p className="eyebrow">Error 404</p>
        <h1>That page does not exist.</h1>
        <p className="page-intro">
          The link may be out of date. The full template catalog is still one click
          away.
        </p>
        <div className="button-row">
          <Link className="button" to="/templates">
            Browse templates
            <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
          </Link>
          <Link className="button button-secondary" to="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
