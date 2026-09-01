import PageHeader from '../components/PageHeader'

export default function LicensePage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Template licensing">
        <p>Licensing terms are confirmed with each customer before purchase.</p>
      </PageHeader>
      <section className="section section-compact">
        <div className="container content-block">
          <p className="notice">
            No template files or ownership rights are granted merely by viewing a
            demo. Your final written agreement with System Forge controls your use.
          </p>
          <h2>Before you buy</h2>
          <p>
            Ask which files are included, how many websites the template may be used
            for, whether client or commercial use is allowed, and what customization
            or support is included.
          </p>
          <h2>Unless separately agreed</h2>
          <p>
            Template demos, source code, branding, and design materials remain the
            property of their respective owner. They may not be copied, redistributed,
            resold, or claimed as your own before a license is granted.
          </p>
        </div>
      </section>
    </>
  )
}
