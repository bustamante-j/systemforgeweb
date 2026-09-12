export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="container page-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="page-title display" data-reveal="lines">
        {title}
      </h1>
      {children ? <div className="page-intro">{children}</div> : null}
    </header>
  )
}
