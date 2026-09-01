export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="page-header container">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {children ? <div className="page-intro">{children}</div> : null}
    </header>
  )
}
