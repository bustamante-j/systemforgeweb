export default function CatalogStatus({ error, retry, status }) {
  if (status === 'loading') {
    return (
      <div className="status-panel" role="status">
        <h2>Loading templates</h2>
        <p>The latest System Forge catalog is being retrieved.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="status-panel status-panel-error" role="alert">
        <h2>Templates could not be loaded</h2>
        <p>{error}</p>
        <button className="button button-muted" onClick={retry} type="button">
          Try again
        </button>
      </div>
    )
  }

  return null
}
