import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Registered once, at module load, before any component runs a tween.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase)

// The press curve: almost no acceleration, then a hard settle. Used for the
// forge strike and for anything that should feel like it has mass.
export const EASE_PRESS = CustomEase.create('press', '0.16, 0, 0.12, 1')

// Everything else decelerates into place. No browser default appears anywhere.
export const EASE_OUT = 'power3.out'

export { ScrollTrigger, SplitText, gsap }

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Reveals are declared in markup with data attributes rather than wired up per
// component, so a page only ever needs one useGSAP call and adding a section
// does not mean writing another timeline.
//
//   data-reveal="lines"   line-by-line mask reveal (SplitText)
//   data-reveal="up"      the element rises into place
//   data-reveal="rule"    a hairline draws left to right
//   data-reveal="rail"    a vertical hairline draws as the block scrolls
//   data-reveal="wipe"    a frame opens from its own centre line
//   data-stagger          children rise in sequence
//   data-parallax="-80"   scrubbed drift, in pixels, against the scroll
//   data-count="7"        the number counts up when it arrives
//
// Every one of them is transform/opacity/clip-path only.
//
// Under prefers-reduced-motion none of it is created, and that is the whole
// mechanism: every reveal is a `from` or `fromTo`, so with no tween to write a
// start value the element simply renders in its finished state. The one rule
// that follows from this is that no element may hide itself in the stylesheet
// and rely on a tween to bring it back.
export function sectionMotion(root) {
  const media = gsap.matchMedia()

  media.add('(prefers-reduced-motion: no-preference)', () => buildSectionMotion(root))

  return () => media.revert()
}

function buildSectionMotion(root) {
  const q = (selector) => gsap.utils.toArray(root.querySelectorAll(selector))

  // --- Masked line reveals -------------------------------------------------
  // autoSplit re-splits when the font lands or the box changes width, and the
  // tween returned from onSplit is reverted and re-synced with it, so a late
  // font swap can never leave a line stranded at opacity 0.
  const splits = q('[data-reveal="lines"]').map((el) =>
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1,
          ease: EASE_OUT,
          stagger: 0.075,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      },
    }),
  )

  // --- Plain arrivals ------------------------------------------------------
  q('[data-reveal="up"]').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: EASE_OUT,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  q('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: EASE_OUT,
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  })

  // --- Drawn rules ---------------------------------------------------------
  q('[data-reveal="rule"]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    )
  })

  // The one rule that is scrubbed rather than played: it tracks the reader
  // down the ordering steps, so it has to follow the scroll exactly.
  q('[data-reveal="rail"]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: 0.6,
        },
      },
    )
  })

  // --- Frames opening ------------------------------------------------------
  q('[data-reveal="wipe"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(46% 0% 46% 0%)', opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.2,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      },
    )
  })

  // --- Depth ---------------------------------------------------------------
  // Two objects moving at different rates through the same scroll is what
  // separates the plate number from the plate behind it.
  q('[data-parallax]').forEach((el) => {
    const distance = Number(el.dataset.parallax) || 0
    gsap.fromTo(
      el,
      { y: -distance },
      {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      },
    )
  })

  // --- Counters ------------------------------------------------------------
  q('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count)
    if (!Number.isFinite(target)) {
      return
    }

    const prefix = el.dataset.countPrefix ?? ''
    const pad = el.dataset.countPad === 'true'
    const value = { n: 0 }

    gsap.to(value, {
      n: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate() {
        const n = Math.round(value.n)
        el.textContent = prefix + (pad ? String(n).padStart(2, '0') : n.toLocaleString('en-PH'))
      },
    })
  })

  // gsap.context (which useGSAP wraps this in) reverts the tweens but not the
  // DOM SplitText rewrote, so the split instances are handed back explicitly.
  return () => splits.forEach((split) => split.revert())
}
