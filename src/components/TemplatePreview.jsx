import { useState } from 'react'

// The picture on a product card is a still of the demo's first screen, shot
// once at a real 1280x800 desktop viewport and served from this origin. The
// demos are desktop layouts with full-viewport heroes, so the shot is taken at
// the width they were designed for and scaled down here rather than rendered
// narrow. Kept in step with the 16/10 .preview-viewport in the stylesheet.
//
// Vite is handed the whole folder at once: each file comes back content-hashed
// into /assets, which is cached immutable for a year, so re-shooting a demo
// under the same name can never leave a visitor on last year's picture.
const shots = import.meta.glob('../assets/previews/*.webp', {
  eager: true,
  import: 'default',
})

const previews = Object.fromEntries(
  Object.entries(shots).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.webp'.length),
    url,
  ]),
)

// A template with no shot on disk yet is not a broken card: the frame keeps its
// label and the two links under it still work.
export default function TemplatePreview({ priority = false, template }) {
  const source = previews[template.id] ?? null

  // loading → the shot is on its way. ready → it is up. missing → there is
  // nothing to show, and the frame stays on its label.
  const [status, setStatus] = useState(source ? 'loading' : 'missing')

  return (
    <div className="preview-frame" data-status={status}>
      <div className="preview-chrome">
        <span className="preview-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="preview-url">{template.demoUrl.replace(/^https?:\/\//, '')}</span>
      </div>

      <div className="preview-viewport">
        <p className="preview-fallback">{template.name}</p>
        {source ? (
          <img
            alt={`${template.name} — the demo's opening screen`}
            decoding="async"
            // The detail page is one preview and it is the page, so it is
            // fetched at once; a shelf of cards waits until it is scrolled to.
            fetchPriority={priority ? 'high' : 'auto'}
            height="800"
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setStatus('missing')}
            onLoad={() => setStatus('ready')}
            src={source}
            width="1280"
          />
        ) : null}
      </div>
    </div>
  )
}
