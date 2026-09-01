import PageHeader from '../components/PageHeader'

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy">
        <p>System Forge does not collect customer information through this website.</p>
      </PageHeader>
      <section className="section section-compact">
        <div className="container content-block">
          <h2>Information collection</h2>
          <p>
            This version of the website has no accounts, contact forms, database, or
            analytics configured by System Forge. If those features are added, this
            notice should be updated before they go live.
          </p>
          <h2>External services</h2>
          <p>
            Live demos are hosted on GitHub Pages, the website is intended for Vercel,
            and contact links open TikTok. Those services may process technical data
            under their own privacy policies when you load or visit them.
          </p>
          <h2>Contact</h2>
          <p>
            Any information you send through TikTok is handled through TikTok and is
            used only to respond to your inquiry and discuss a possible order.
          </p>
        </div>
      </section>
    </>
  )
}
