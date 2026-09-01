import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container content-block">
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link className="button" to="/templates">
          Browse templates
        </Link>
      </div>
    </section>
  )
}
