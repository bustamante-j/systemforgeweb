export default function LivePreview({ template, large = false }) {
  const className = large ? 'preview-frame preview-frame-large' : 'preview-frame'

  return (
    <div className={className}>
      <p className="preview-fallback">Live preview for {template.name}</p>
      <iframe
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-same-origin allow-scripts"
        src={template.demoUrl}
        tabIndex="-1"
        title={`${template.name} live preview`}
      />
    </div>
  )
}
