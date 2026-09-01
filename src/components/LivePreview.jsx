import { useEffect, useRef, useState } from 'react'

// The demos are desktop layouts with full-viewport heroes, so the iframe is
// rendered at a real desktop viewport and scaled down to fit the frame.
// Stretching it taller would blow up every 100vh section inside the demo.
const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 800

export default function LivePreview({ template }) {
  const frameRef = useRef(null)
  const viewportRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const [loaded, setLoaded] = useState(false)

  // The catalog keeps growing, so a demo is only mounted once it is near view.
  useEffect(() => {
    const node = frameRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = viewportRef.current
    if (!node || typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="preview-frame"
      data-loaded={loaded}
      ref={frameRef}
      style={{
        '--preview-scale': width ? width / FRAME_WIDTH : 0,
        '--preview-width': `${FRAME_WIDTH}px`,
        '--preview-height': `${FRAME_HEIGHT}px`,
      }}
    >
      <div className="preview-chrome">
        <span className="preview-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="preview-url">{template.demoUrl.replace(/^https?:\/\//, '')}</span>
      </div>

      <div className="preview-viewport" ref={viewportRef}>
        <p className="preview-fallback">Live preview — {template.name}</p>
        {inView ? (
          <iframe
            loading="lazy"
            onLoad={() => setLoaded(true)}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            src={template.demoUrl}
            tabIndex="-1"
            title={`${template.name} live preview`}
          />
        ) : null}
      </div>
    </div>
  )
}
