import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="System Forge">
        <p>
          We build portfolio website templates you can inspect live before you
          order. The catalog grows as new ones are finished.
        </p>
      </PageHeader>

      <section className="section section-compact">
        <div className="container content-block">
          <ul className="plain-list">
            <li>Every template is a complete, responsive layout</li>
            <li>Demos stay public, so you see the real thing first</li>
            <li>Content and changes are discussed one to one</li>
          </ul>
        </div>
      </section>
    </>
  )
}
