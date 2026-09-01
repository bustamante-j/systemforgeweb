import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About System Forge">
        <p>
          System Forge creates web-based products that help people present their
          work and run their ideas online.
        </p>
      </PageHeader>
      <section className="section section-compact">
        <div className="container content-block">
          <h2>Starting with portfolio websites</h2>
          <p>
            The current catalog focuses on portfolio templates: complete website
            styles that potential clients can explore before starting a conversation.
          </p>
          <p>
            System Forge will grow beyond portfolios into more capable web-based
            systems. The goal remains the same: build practical digital products
            that are easy to understand and ready to use.
          </p>
          <Link className="button" to="/templates">
            View the current catalog
          </Link>
        </div>
      </section>
    </>
  )
}
