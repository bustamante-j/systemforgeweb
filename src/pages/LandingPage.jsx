import { useGSAP } from '@gsap/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ForgeCanvas from '../components/ForgeCanvas'
import TemplateCard from '../components/TemplateCard'
import TikTokIcon from '../components/TikTokIcon'
import { featuredTemplates, siteConfig, templates } from '../data/site'
import { EASE_OUT, gsap, ScrollTrigger, sectionMotion, SplitText } from '../lib/motion'

const featured = featuredTemplates()
const live = templates.filter((template) => template.status === 'available').length

// What the cloud on the canvas is doing, in two words each. The scroll lights
// the current one; with no JS and under reduced motion all three simply read
// as a row, which is why none of them is hidden in the stylesheet.
const stages = [
  { index: '01', label: 'Raw material' },
  { index: '02', label: 'Structure' },
  { index: '03', label: 'Live site' },
]

const steps = [
  { index: '01', label: 'Pick a template' },
  { index: '02', label: 'Send your details' },
  { index: '03', label: 'Get the live link' },
]

export default function LandingPage() {
  const root = useRef(null)
  const hero = useRef(null)
  const stageRow = useRef(null)

  // The scroll position the canvas reads, held in a ref rather than state: the
  // scene has to move every frame and React must never hear about it.
  const progress = useRef(0)

  // Page-wide reveals for everything under the hero.
  useGSAP(() => sectionMotion(root.current), { scope: root })

  useGSAP(
    () => {
      // One trigger over the whole tall hero. The stage inside it is stuck with
      // CSS position: sticky rather than pinned by GSAP — the browser does that
      // for free, off the main thread, and there is no pin-spacer to go stale
      // when the route transition refreshes the triggers.
      const scrub = ScrollTrigger.create({
        trigger: hero.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progress.current = self.progress

          const step = self.progress < 0.32 ? 0 : self.progress < 0.7 ? 1 : 2
          const row = stageRow.current
          if (row && row.dataset.step !== String(step)) {
            row.dataset.step = String(step)
          }
        },
      })

      // The hero arrives on load rather than on scroll, so it gets its own
      // intro instead of the scroll-triggered reveals the sections below use.
      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('.hero-title', {
          autoSplit: true,
          linesClass: 'reveal-line',
          mask: 'lines',
          type: 'lines',
          onSplit: (self) =>
            gsap.from(self.lines, {
              delay: 0.12,
              duration: 1.1,
              ease: EASE_OUT,
              stagger: 0.08,
              yPercent: 115,
            }),
        })

        gsap.from('.forge', { duration: 1.4, ease: EASE_OUT, opacity: 0 })
        gsap.from('.hero-band', {
          delay: 0.3,
          duration: 1,
          ease: EASE_OUT,
          opacity: 0,
          y: 24,
        })
        gsap.fromTo(
          '.hero-band-rule',
          { scaleX: 0 },
          { delay: 0.2, duration: 1.2, ease: EASE_OUT, scaleX: 1 },
        )
        gsap.from('.hero-cue', { delay: 0.9, duration: 0.8, ease: EASE_OUT, opacity: 0 })

        return () => split.revert()
      })

      return () => {
        scrub.kill()
        media.revert()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      {/* The tall block the sticky stage travels through. Its height is the
          length of the sequence — nothing inside it is pinned by script. */}
      <section className="landing-hero" ref={hero}>
        <div className="hero-stage">
          <ForgeCanvas progress={progress} />

          <div className="container hero-band">
            <span className="hero-band-rule" aria-hidden="true" />

            <div className="hero-band-inner">
              {/* The space before the break is load-bearing: without it the
                  accessible name of the heading is one run-together word. */}
              <h1 className="hero-title display">
                Websites,{' '}
                <br />
                forged.
              </h1>

              <div className="hero-side">
                <ol aria-label="Build stages" className="hero-steps" ref={stageRow}>
                  {stages.map((stage) => (
                    <li key={stage.index}>
                      <b className="readout">{stage.index}</b>
                      <span className="readout">{stage.label}</span>
                    </li>
                  ))}
                </ol>

                <div className="hero-actions">
                  <Link className="button" to="/templates">
                    <span>View templates</span>
                    <ArrowRight aria-hidden="true" size={13} strokeWidth={1.75} />
                  </Link>
                  <a
                    aria-label={`Follow ${siteConfig.tiktokHandle} on TikTok (opens in a new tab)`}
                    className="button button-secondary"
                    href={siteConfig.tiktokUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <TikTokIcon size={13} />
                    <span>{siteConfig.tiktokHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="hero-cue readout" aria-hidden="true">
            Scroll
          </p>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">01</span>
            <h2 className="section-marker-label marker" id="featured-heading">
              Selected work
            </h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <div className="card-grid">
            {featured.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          <p className="featured-foot">
            <Link className="text-link" to="/templates">
              All {live} templates
              <ArrowRight aria-hidden="true" size={12} strokeWidth={1.75} />
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="process-heading" className="section">
        <div className="container">
          <div className="section-marker">
            <span className="section-marker-index">02</span>
            <h2 className="section-marker-label marker" id="process-heading">
              How it goes
            </h2>
            <span className="section-marker-rule" data-reveal="rule" />
          </div>

          <ol className="steps" data-stagger>
            {steps.map((step) => (
              <li key={step.index}>
                <b>{step.index}</b>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="container cta-panel">
          <h2 className="cta-title" data-reveal="lines">
            Pick one. <em>Go live.</em>
          </h2>

          <div className="cta-foot">
            <p data-reveal="up">Every template is running live before you order it.</p>

            <div className="cta-actions" data-stagger>
              <Link className="button" to="/templates">
                <span>Browse templates</span>
              </Link>
              <Link className="button button-secondary" to="/contact">
                <span>How to order</span>
                <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
