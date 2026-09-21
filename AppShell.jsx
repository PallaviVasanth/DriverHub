import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = {
  candidate: [['Dashboard', '/candidate/dashboard'], ['Find jobs', '/jobs'], ['Applications', '/candidate/applications'], ['Notifications', '/candidate/notifications'], ['Profile', '/candidate/profile']],
  employer: [['Dashboard', '/employer/dashboard'], ['Jobs', '/employer/jobs'], ['Applications', '/employer/applications'], ['Candidates', '/employer/candidates'], ['Company profile', '/employer/profile']],
  admin: [['Dashboard', '/admin/dashboard'], ['Candidates', '/admin/candidates'], ['Employers', '/admin/employers'], ['Jobs', '/admin/jobs'], ['Applications', '/admin/applications']],
};

export default function AppShell({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navLinks = user ? links[user.role] || [] : [];
  return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4"><Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-800"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-sm text-white">DH</span>Driver Hub</Link>{isAuthenticated ? <><nav className="order-3 flex w-full gap-1 overflow-x-auto border-t border-slate-100 pt-3 text-sm sm:order-none sm:w-auto sm:border-0 sm:p-0">{navLinks.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</NavLink>)}</nav><div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-500 md:inline">{user.name}</span><button type="button" onClick={logout} className="rounded-lg border border-slate-300 px-3 py-2 font-medium hover:bg-slate-50">Log out</button></div></> : <nav className="flex items-center gap-3 text-sm"><Link to="/login" className="font-medium text-slate-600 hover:text-blue-700">Log in</Link><Link to="/register" className="rounded-lg bg-blue-700 px-3 py-2 font-medium text-white hover:bg-blue-800">Create account</Link></nav>}</div></header><main>{children}</main></div>;
}
