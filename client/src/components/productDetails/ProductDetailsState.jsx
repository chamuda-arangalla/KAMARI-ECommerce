export function ProductDetailsLoading() {
  return (
    <main className="pd-page">
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Loading product...</p>
      </div>
    </main>
  );
}

export function ProductDetailsError({ error, onBack }) {
  return (
    <main className="pd-page">
      <div className="pd-loading">
        <p className="pd-error">{error || "Product not found"}</p>
        <button className="pd-back-btn" onClick={onBack}>
          Go Back
        </button>
      </div>
    </main>
  );
}
