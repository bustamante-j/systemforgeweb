import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container content-block">
        <p className="eyebrow">Error 404</p>
        <h1 className="page-title display">Nothing here</h1>
        <p>That page does not exist. The catalog does.</p>
        <Link className="button" to="/templates">
          <span>Browse templates</span>
          <ArrowRight aria-hidden="true" size={13} strokeWidth={1.75} />
        </Link>
      </div>
    </section>
  )
}
