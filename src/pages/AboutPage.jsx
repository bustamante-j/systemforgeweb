import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Built to make good work look ready.">
        <p>
          System Forge creates web-based products that help people present their
          work and run their ideas online.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container two-column">
          <div className="content-block">
            <h2>Starting with portfolio websites</h2>
            <p>
              The current catalog focuses on portfolio templates: complete website
              styles that potential clients can explore before starting a
              conversation.
            </p>
            <p>
              System Forge will grow beyond portfolios into more capable web-based
              systems. The goal remains the same: build practical digital products
              that are easy to understand and ready to use.
            </p>
            <Link className="button" to="/templates">
              View the current catalog
              <ArrowRight aria-hidden="true" size={14} strokeWidth={2} />
            </Link>
          </div>

          <div className="content-block">
            <h2>How the work is done</h2>
            <ul className="plain-list">
              <li>Every template ships as a complete, responsive layout</li>
              <li>Live demos stay public so you can inspect before ordering</li>
              <li>Content, sections, and details are discussed one to one</li>
              <li>The catalog grows as new systems are finished</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
