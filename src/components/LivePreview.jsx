import { useCallback, useEffect, useRef, useState } from 'react'

// The demos are desktop layouts with full-viewport heroes, so the iframe is
// rendered at a real desktop viewport and scaled down to fit the frame.
// Stretching it taller would blow up every 100vh section inside the demo.
// Kept in step with --preview-width / --preview-height in the stylesheet.
const FRAME_WIDTH = 1280

// A preview is not an image — it is a whole third-party site, with its own
// scripts, fonts and images. Half a dozen of them starting at once is the most
// expensive thing this catalog can hand a phone, so they go through a queue:
// nearest to the viewport first, only one or two ever in flight.
const LOAD_TIMEOUT = 15000

function connection() {
  return (typeof navigator === 'undefined' ? null : navigator.connection) ?? null
}

// Data Saver and 2g are the visitor saying "don't spend my bandwidth". Those
// cards show a label instead, and tapping through to the detail page loads the
// one demo they actually asked for.
function prefersDeferredLoad() {
  const link = connection()
  if (!link) {
    return false
  }

  return Boolean(link.saveData) || /(^|-)2g$/.test(link.effectiveType ?? '')
}

function maxInFlight() {
  const link = connection()
  if (link && link.effectiveType === '3g') {
    return 1
  }

  const cores = (typeof navigator === 'undefined' ? 0 : navigator.hardwareConcurrency) || 4
  return cores <= 4 ? 1 : 2
}

// A phone should not fetch a demo it may never scroll to; a desktop can afford
// to run further ahead.
function rootMargin() {
  const narrow =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 850px)').matches

  return narrow ? '200px 0px' : '600px 0px'
}

const waiting = new Set()
let inFlight = 0

function pump() {
  while (inFlight < maxInFlight() && waiting.size > 0) {
    let next = null
    let nearest = Infinity

    for (const entry of waiting) {
      const distance = entry.distance()
      if (distance < nearest) {
        nearest = distance
        next = entry
      }
    }

    waiting.delete(next)
    inFlight += 1
    next.start()
  }
}

// Returns the release, which is idempotent: it cancels a demo still in the
// queue, and hands the slot back for one that already started.
function claimSlot(entry) {
  waiting.add(entry)
  pump()

  let settled = false
  return () => {
    if (settled) {
      return
    }

    settled = true
    if (waiting.delete(entry)) {
      return
    }

    inFlight = Math.max(0, inFlight - 1)
    pump()
  }
}

// One observer for the whole grid, writing the scale straight to the DOM. A
// resize should not re-render six cards to move a number React never reads.
const scaleObserver =
  typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width } = entry.contentRect
          if (width > 0) {
            entry.target.style.setProperty('--preview-scale', width / FRAME_WIDTH)
          }
        }
      })

export default function LivePreview({ template, priority = false }) {
  const frameRef = useRef(null)
  const viewportRef = useRef(null)
  const releaseRef = useRef(null)

  // idle → queued for a slot once near the viewport. deferred → waiting to be
  // asked for. loading → iframe mounted. stalled → taking too long, slot handed
  // back. ready → up.
  const [status, setStatus] = useState(() => {
    if (priority) {
      return 'loading'
    }

    return prefersDeferredLoad() ? 'deferred' : 'idle'
  })

  const release = useCallback(() => {
    releaseRef.current?.()
    releaseRef.current = null
  }, [])

  // Give the slot back on unmount, whether it was granted or still queued.
  useEffect(() => release, [release])

  useEffect(() => {
    const node = viewportRef.current
    if (!node) {
      return undefined
    }

    if (!scaleObserver) {
      const measure = () =>
        node.style.setProperty('--preview-scale', node.clientWidth / FRAME_WIDTH)

      measure()
      window.addEventListener('resize', measure, { passive: true })
      return () => window.removeEventListener('resize', measure)
    }

    scaleObserver.observe(node)
    return () => scaleObserver.unobserve(node)
  }, [])

  // The catalog keeps growing, so a demo only asks for a slot once it is near
  // view — and the detail page's single preview skips the queue entirely.
  useEffect(() => {
    if (status !== 'idle') {
      return undefined
    }

    const enqueue = () => {
      releaseRef.current = claimSlot({
        distance: () => {
          const node = frameRef.current
          return node ? Math.abs(node.getBoundingClientRect().top) : Infinity
        },
        start: () => setStatus('loading'),
      })
    }

    const node = frameRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      enqueue()
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          enqueue()
        }
      },
      { rootMargin: rootMargin() },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [status])

  // A demo that never finishes must not wedge the queue shut for the rest, so
  // the slot goes back on a timer. The frame stays on its loading label until
  // the demo really does arrive.
  useEffect(() => {
    if (status !== 'loading') {
      return undefined
    }

    const timer = setTimeout(() => {
      setStatus('stalled')
      release()
    }, LOAD_TIMEOUT)

    return () => clearTimeout(timer)
  }, [release, status])

  const handleLoad = useCallback(() => {
    setStatus('ready')
    release()
  }, [release])

  const deferred = status === 'deferred'

  return (
    <div className="preview-frame" data-status={status} ref={frameRef}>
      <div className="preview-chrome">
        <span className="preview-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="preview-url">{template.demoUrl.replace(/^https?:\/\//, '')}</span>
      </div>

      <div className="preview-viewport" ref={viewportRef}>
        <p className="preview-fallback">
          {deferred ? `Tap to open — ${template.name}` : `Live preview — ${template.name}`}
        </p>
        {deferred || status === 'idle' ? null : (
          <iframe
            loading="lazy"
            onLoad={handleLoad}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            src={template.demoUrl}
            tabIndex="-1"
            title={`${template.name} live preview`}
          />
        )}
      </div>
    </div>
  )
}
