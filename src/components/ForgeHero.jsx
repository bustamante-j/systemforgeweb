import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { EASE_PRESS, gsap } from '../lib/motion'
import LivePreview from './LivePreview'

// THE SIGNATURE.
//
// A billet of blueprint plates falls in out of depth, the press squares them
// up and closes them into a single plane, it strikes — and what comes out is
// not a picture of a website. It is the website, live and running, opening
// from the seam while the wordmark parts around it like a pair of dies.
//
// Two timelines, deliberately. The billet loading into the press plays on its
// own the moment the page opens, because the first frame a visitor gets has to
// be composed rather than empty. Everything from the press closing onwards is
// scrubbed, because that is the part they should feel themselves driving.
//
// The scroll beats are written on a 0-1 scale so they read as fractions of the
// scroll rather than as seconds that stop meaning anything once scrub takes
// over.
const BEAT = {
  draw: 0,
  open: 0.08,
  compress: 0.14,
  strike: 0.44,
  part: 0.5,
  output: 0.56,
  settle: 0.86,
}

// What the readout claims the press is running at. It is theatre — but it is
// the kind of theatre a real machine shop has on the wall.
const TEMP_COLD = 340
const TEMP_FORGE = 1480

export default function ForgeHero({ plates, specimen }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()

      media.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          narrow: '(max-width: 850px)',
        },
        (context) => {
          const { motion, narrow } = context.conditions

          // Reduced motion gets no sequence at all. The stylesheet composes the
          // last frame statically under the same query, so the visitor still
          // lands on the lockup above a running site — just without the press.
          if (!motion) {
            return
          }

          const scope = root.current
          const plateEls = gsap.utils.toArray(scope.querySelectorAll('.forge-plate'))
          const output = scope.querySelector('.forge-output')
          const outputLink = output.querySelector('a')
          const shock = scope.querySelector('.forge-shock')
          const billet = scope.querySelector('.forge-billet')
          const lineA = scope.querySelector('.forge-line-a')
          const lineB = scope.querySelector('.forge-line-b')
          const tempEl = scope.querySelector('[data-temp]')
          const stateEl = scope.querySelector('[data-state]')

          // A phone gets a shallower stack and a shorter fall: less depth to
          // composite, and a pin that does not hold the screen for as long.
          const depth = narrow ? 900 : 1750
          const gap = narrow ? 92 : 140
          const tilt = narrow ? 34 : 42

          const heat = { value: TEMP_COLD }
          const setState = (label, hot) => {
            if (!stateEl) {
              return
            }

            stateEl.textContent = label
            stateEl.dataset.hot = hot ? 'true' : 'false'
          }

          // The composed state the page lands on: plates loaded into the press,
          // exploded and tilted, waiting. Both timelines are written against
          // this, the intro arriving at it and the scroll leaving from it.
          // The specimen is invisible until the press opens, so for that whole
          // stretch its link must be unreachable by pointer *and* by keyboard —
          // a focusable link nobody can see is a trap. Both come back at the
          // settle, and both reverse correctly when the scrub runs backwards.
          gsap.set(output, { pointerEvents: 'none' })
          gsap.set(outputLink, { attr: { tabindex: -1 } })
          gsap.set(plateEls, {
            z: (i) => -i * gap,
            y: (i) => (i - (plateEls.length - 1) / 2) * (gap * 0.46),
            rotationX: tilt,
            rotationY: -18,
            opacity: 1,
          })

          // --- Boot: plays on load, so the first frame is never empty -------
          gsap
            .timeline({ defaults: { ease: EASE_PRESS } })
            .to('.forge-grid', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
            .from(
              '.forge-line > span',
              { yPercent: 118, duration: 1.15, stagger: 0.09 },
              0.1,
            )
            .from(
              plateEls,
              {
                z: (i) => -depth - i * 300,
                y: (i) => i * 120 - 200,
                opacity: 0,
                duration: 1.3,
                stagger: 0.08,
                ease: 'power3.out',
              },
              0.16,
            )
            .from(
              ['.forge-eyebrow', '.forge-sub'],
              { opacity: 0, y: 22, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
              0.55,
            )
            .from(
              '.forge-readout > *',
              { opacity: 0, y: 12, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
              0.8,
            )

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: scope,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.65,
              pin: '.forge-stage',
              // The track already reserves the scroll distance, so a spacer
              // would add it twice.
              pinSpacing: false,
              anticipatePin: 1,
              // Half a dozen elements doing continuous 3D work earn a
              // compositor hint — but only while the press is on screen.
              onToggle: (self) =>
                gsap.set([...plateEls, output], {
                  willChange: self.isActive ? 'transform, opacity' : 'auto',
                }),
            },
          })

          // --- Draw: the press takes hold of the billet ---------------------
          tl.to(billet, { z: narrow ? 70 : 130, rotationY: -8, duration: 0.14 }, BEAT.draw)

          // --- Open: the dies separate far enough to watch through ----------
          // The lockup is the biggest thing on the screen, and if it stays put
          // it hides the one thing this section exists to show. So it parts in
          // two stages: here it slides back and dims to a frame around the
          // work, and only at the strike does it leave altogether.
          tl.to(lineA, { yPercent: -46, opacity: 0.22, duration: 0.26 }, BEAT.open)
            .to(lineB, { yPercent: 46, opacity: 0.22, duration: 0.26 }, BEAT.open)
            .to(['.forge-eyebrow', '.forge-sub'], { opacity: 0, duration: 0.14 }, BEAT.open)

          // --- Press: the stack squares up to the viewer and closes ---------
          tl.to(
            plateEls,
            {
              z: (i) => -i * 1.5,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              duration: 0.3,
              ease: EASE_PRESS,
            },
            BEAT.compress,
          )
            .to(billet, { rotationY: 0, z: 0, duration: 0.3, ease: EASE_PRESS }, BEAT.compress)
            .to('.forge-heat', { opacity: 0.55, duration: 0.3 }, BEAT.compress)
            .to(
              heat,
              {
                value: TEMP_FORGE,
                duration: 0.3,
                onStart: () => setState('Pressing', false),
                onReverseComplete: () => setState('Cold', false),
                onUpdate: () => {
                  if (tempEl) {
                    tempEl.textContent = `${Math.round(heat.value)}°C`
                  }
                },
              },
              BEAT.compress,
            )

          // --- Strike: the one loud frame on the whole site -----------------
          tl.to(
            '.forge-heat',
            {
              opacity: 1,
              duration: 0.015,
              onStart: () => setState('Forged', true),
              onReverseComplete: () => setState('Pressing', false),
            },
            BEAT.strike,
          )
            .to('.forge-heat', { opacity: 0.34, duration: 0.09 }, BEAT.strike + 0.015)
            .to(billet, { scaleY: 0.93, scaleX: 1.03, duration: 0.015 }, BEAT.strike)
            .to(
              billet,
              { scaleY: 1, scaleX: 1, duration: 0.07, ease: 'elastic.out(1, 0.45)' },
              BEAT.strike + 0.015,
            )
            .fromTo(
              shock,
              { scale: 0.72, opacity: 0.9 },
              {
                scale: narrow ? 1.55 : 1.85,
                opacity: 0,
                duration: 0.11,
                ease: 'power2.out',
                // Without this the ring's "from" values land the moment the
                // timeline is built and it sits on screen at scroll 0, waiting
                // for a strike that has not happened.
                immediateRender: false,
              },
              BEAT.strike,
            )

          // --- Part: the dies finish opening, the plates give up their place -
          tl.to(lineA, { yPercent: -175, opacity: 0, duration: 0.16, ease: EASE_PRESS }, BEAT.part)
            .to(lineB, { yPercent: 175, opacity: 0, duration: 0.16, ease: EASE_PRESS }, BEAT.part)
            .to(plateEls, { opacity: 0, duration: 0.12, stagger: 0.014 }, BEAT.part + 0.04)

          // --- Output: the live site opens from the seam --------------------
          tl.fromTo(
            output,
            { clipPath: 'inset(50% 0% 50% 0%)', opacity: 0, scale: 0.96 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              scale: 1,
              duration: 0.24,
              ease: EASE_PRESS,
              immediateRender: false,
            },
            BEAT.output,
          )
            .to('.forge-heat', { opacity: 0.12, duration: 0.2 }, BEAT.output)
            .to('.forge-caption', { opacity: 1, duration: 0.1 }, BEAT.settle)
            .set(output, { pointerEvents: 'auto' }, BEAT.settle)
            .set(outputLink, { attr: { tabindex: 0 } }, BEAT.settle)
            // Pads the timeline out to a full 1, which buys a beat of stillness
            // on the finished frame before the pin releases.
            .set(shock, { opacity: 0 }, 1)
        },
      )

      return () => media.revert()
    },
    { scope: root },
  )

  return (
    <section className="forge" ref={root}>
      <div className="forge-track">
        <div className="forge-stage">
          <div className="forge-grid" aria-hidden="true" />
          <div className="forge-heat" aria-hidden="true" />

          <div className="forge-inner">
            <div className="forge-lockup">
              <p className="forge-eyebrow">
                <span>Portfolio templates</span>
                <b>Live, not mocked up</b>
              </p>

              <h1 className="forge-title display">
                <span className="forge-line">
                  {/* The trailing space is collapsed away visually by the block
                      box, but it keeps the accessible name "System Forge"
                      rather than "SystemForge". */}
                  <span className="forge-line-a">System </span>
                </span>
                <span className="forge-line">
                  <span className="forge-line-b">Forge</span>
                </span>
              </h1>

              <p className="forge-sub">
                Not screenshots. Not mockups. Every template below is a real website,
                running right here on the page.
              </p>
            </div>
          </div>

          <div className="forge-scene">
            {/* The plates are a drawing of the catalog, not part of it — they
                carry no information a screen reader needs. */}
            <div className="forge-billet" aria-hidden="true">
              {plates.map((plate, index) => (
                <div className="forge-plate" key={plate.id}>
                  <div className="forge-plate-head">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{plate.name}</span>
                    <b>{plate.tier === 'premium' ? 'PRM' : 'STD'}</b>
                  </div>
                  <div className="forge-plate-body">
                    <span className="forge-plate-bar" />
                    <span className="forge-plate-stack">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="forge-plate-cells">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="forge-shock" aria-hidden="true" />

            <div className="forge-output">
              <Link
                aria-label={`View ${specimen.name}`}
                className="preview-link"
                to={`/templates/${specimen.id}`}
              >
                <LivePreview priority template={specimen} />
              </Link>
            </div>
          </div>

          <p className="forge-caption" aria-hidden="true">
            <b>{specimen.name}</b>
            <i>Live</i>
            <span>{specimen.audience}</span>
          </p>

          <div className="forge-readout" aria-hidden="true">
            <dl>
              <dt>Temp</dt>
              <dd data-temp>{TEMP_COLD}°C</dd>
            </dl>
            <dl>
              <dt>State</dt>
              <dd data-state data-hot="false">
                Cold
              </dd>
            </dl>
            <p className="forge-cue">Scroll</p>
          </div>
        </div>
      </div>
    </section>
  )
}
