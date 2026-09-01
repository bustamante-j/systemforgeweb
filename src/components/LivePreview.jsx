import { useEffect, useRef, useState } from 'react'

// The demo sites are desktop layouts, so the iframe is rendered at a fixed
// desktop viewport and scaled down to fit. The extra height below the fold is
// what the card reveals on hover.
const FRAME_WIDTH = 1440
const FRAME_HEIGHT = 1800

export default function LivePreview({ template, large = false }) {
  const viewportRef = useRef(null)
  const [box, setBox] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const node = viewportRef.current
    if (!node || typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ width, height })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const scale = box.width ? box.width / FRAME_WIDTH : 0
  const overflow = Math.max(0, FRAME_HEIGHT * scale - box.height)

  return (
    <div
      className={large ? 'preview-frame preview-frame-large' : 'preview-frame'}
      style={{
        '--preview-scale': scale,
        '--preview-width': `${FRAME_WIDTH}px`,
        '--preview-height': `${FRAME_HEIGHT}px`,
        '--preview-overflow': `${overflow}px`,
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
        <div className="preview-scroll">
          <iframe
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            src={template.demoUrl}
            tabIndex="-1"
            title={`${template.name} live preview`}
          />
        </div>
      </div>
    </div>
  )
}
