import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SupportAssistant from '../ui/SupportAssistant';

const publicLinks = [
  ['Home', '/'],
  ['Find Jobs', '/jobs'],
  ['Top Employers', '/companies'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const roleLinks = {
  candidate: [
    ['Dashboard', '/candidate/dashboard'],
    ['Find jobs', '/jobs'],
    ['Applications', '/candidate/applications'],
    ['Notifications', '/candidate/notifications'],
    ['Profile', '/candidate/profile'],
  ],
  employer: [
    ['Dashboard', '/employer/dashboard'],
    ['Jobs', '/employer/jobs'],
    ['Applications', '/employer/applications'],
    ['Candidates', '/employer/candidates'],
    ['Company profile', '/employer/profile'],
  ],
  admin: [
    ['Dashboard', '/admin/dashboard'],
    ['Candidates', '/admin/candidates'],
    ['Employers', '/admin/employers'],
    ['Jobs', '/admin/jobs'],
    ['Applications', '/admin/applications'],
  ],
};

function Logo() {
  return (
    <Link to="/" className="dh-logo" aria-label="DriverHub home">
      <span className="dh-logo-mark"><span>DH</span></span>
      <span className="dh-logo-copy">
        <strong>Driver<span>Hub</span></strong>
        <small>Drive careers forward</small>
      </span>
    </Link>
  );
}

export default function AppShell({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const links = publicLinks;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Logo />

          <button
            className={`mobile-menu-button ${open ? 'is-open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>

          <nav className={`site-nav ${open ? 'is-open' : ''}`}>
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="site-actions">
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
              <span className="theme-toggle-track"><span className="theme-toggle-thumb">{isDark ? '☾' : '☀'}</span></span>
              <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link className="header-icon-button" to={`/${user?.role}/dashboard`} aria-label="Dashboard">♧</Link>
                <div className="user-menu">
                  <span className="user-avatar">{(user?.name || 'D').slice(0, 1).toUpperCase()}</span>
                  <div className="user-menu-copy"><strong>{user?.name || 'Account'}</strong><small>+91 ••••••••••</small></div>
                  <span className="user-menu-arrow">⌄</span>
                </div>
                <button className="header-outline-button header-logout" type="button" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-login">Sign in</Link>
                <Link to="/register" className="header-register">Get started <span>→</span></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      {!isAuthenticated && <PublicFooter />}
      <SupportAssistant />
    </div>
  );
}

function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Connecting professional drivers with trusted employers through a modern, direct-hiring experience.</p>
          <div className="footer-pills"><span>✓ Verified hiring</span><span>✓ Direct applications</span></div>
        </div>
        <div>
          <h3>For drivers</h3>
          <Link to="/jobs">Find jobs</Link>
          <Link to="/register">Create profile</Link>
          <Link to="/login">Driver sign in</Link>
        </div>
        <div>
          <h3>For employers</h3>
          <Link to="/register">Post a job</Link>
          <Link to="/login">Employer sign in</Link>
          <Link to="/">Hiring solutions</Link>
        </div>
        <div>
          <h3>DriverHub</h3>
          <Link to="/">About us</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Privacy & terms</Link>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} DriverHub. Built for better hiring.</span><span>Professional driver recruitment platform</span></div>
    </footer>
  );
}
