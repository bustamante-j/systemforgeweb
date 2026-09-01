import PageHeader from '../components/PageHeader'

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms">
        <p>These basic terms apply to the System Forge catalog website.</p>
      </PageHeader>
      <section className="section section-compact">
        <div className="container content-block">
          <h2>Catalog purpose</h2>
          <p>
            This website lets visitors browse template demonstrations. Displaying a
            template does not guarantee availability, a specific price, customization,
            delivery time, or included service.
          </p>
          <h2>Orders</h2>
          <p>
            Orders are arranged separately through TikTok. The final price, scope,
            payment method, delivery, revisions, and license should be agreed in
            writing before work begins or files are delivered.
          </p>
          <h2>Demo content</h2>
          <p>
            Names, projects, testimonials, contact details, and other content shown in
            template demos are sample content. Customers are responsible for providing
            accurate content and confirming they have permission to use it.
          </p>
          <h2>Changes</h2>
          <p>
            Templates and these terms may be updated as System Forge expands. The terms
            agreed for a specific order remain the terms for that order.
          </p>
        </div>
      </section>
    </>
  )
}
