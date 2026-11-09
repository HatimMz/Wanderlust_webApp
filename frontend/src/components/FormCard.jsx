function FormCard({ title, error, children }) {
  return <div className="form-card"><span className="eyebrow">WanderLust</span><h1>{title}</h1>{error && <p className="alert">{error}</p>}{children}</div>
}

export default FormCard
