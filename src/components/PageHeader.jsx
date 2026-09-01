export default function PageHeader({ title, children }) {
  return (
    <header className="page-header container">
      <h1>{title}</h1>
      {children ? <div className="page-intro">{children}</div> : null}
    </header>
  )
}
