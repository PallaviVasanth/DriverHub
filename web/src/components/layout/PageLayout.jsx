export default function PageLayout({ children }) { return <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>; }
export function DataTable({ children }) { return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200">{children}</table></div>; }
