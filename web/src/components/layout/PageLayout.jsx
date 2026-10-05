export default function PageLayout({ children, className = '' }) {
  return <div className={`page-layout ${className}`}>{children}</div>;
}

export function DataTable({ children }) {
  return <div className="data-table-wrap"><table className="data-table">{children}</table></div>;
}
