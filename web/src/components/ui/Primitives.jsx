export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'dh-button-primary',
    secondary: 'dh-button-secondary',
    danger: 'dh-button-danger',
    ghost: 'dh-button-ghost',
  };
  return <button className={`dh-button ${styles[variant] || styles.primary} ${className}`} {...props}>{children}</button>;
}

export function Card({ children, className = '' }) {
  return <div className={`dh-card ${className}`}>{children}</div>;
}

export function Field({ label, error, className = '', ...props }) {
  return <label className={`dh-field ${className}`}><span>{label}</span>{props.type === 'textarea' ? <textarea className="form-input" {...props} /> : <input className="form-input" {...props} />}{error && <small>{error}</small>}</label>;
}

export function SelectField({ label, children, ...props }) {
  return <label className="dh-field"><span>{label}</span><select className="form-input" {...props}>{children}</select></label>;
}

export function StatusBadge({ status }) {
  const styles = { approved: 'is-green', shortlisted: 'is-blue', applied: 'is-gold', pending: 'is-gold', rejected: 'is-red', closed: 'is-muted', hired: 'is-purple' };
  return <span className={`status-badge ${styles[status] || 'is-muted'}`}><i />{status}</span>;
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow || 'DriverHub'}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-header-actions">{actions}</div>}</div>;
}

export function SectionTitle({ children }) { return <h2 className="section-title">{children}</h2>; }
