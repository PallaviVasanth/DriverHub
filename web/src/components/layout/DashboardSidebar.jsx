import { NavLink } from 'react-router-dom';

const candidateLinks = [
  ['Dashboard', '/candidate/dashboard', '▦'],
  ['Find Jobs', '/jobs', '⌕'],
  ['My Applications', '/candidate/applications', '▤'],
  ['Saved Jobs', '/jobs', '♡'],
  ['Messages', '/candidate/notifications', '▱'],
  ['My Profile', '/candidate/profile', '♙'],
  ['Documents & License', '/candidate/profile', '◇'],
  ['Notifications', '/candidate/notifications', '♢'],
  ['Account Settings', '/candidate/profile', '⚙'],
];

export default function DashboardSidebar({ user, profile }) {
  const name = profile?.user?.name || user?.name || 'Driver';
  const first = name.slice(0, 1).toUpperCase();
  const verified = Boolean(profile?.license_category || profile?.license_number);

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        <span className="sidebar-avatar">{first}</span>
        <div>
          <strong>Driver Portal</strong>
          <small><i className={verified ? 'is-live' : ''} /> {verified ? 'Verified Driver' : 'Profile in progress'}</small>
        </div>
      </div>

      <nav className="dashboard-nav" aria-label="Driver dashboard navigation">
        {candidateLinks.map(([label, to, icon], index) => (
          <NavLink
            key={`${label}-${index}`}
            to={to}
            end={to === '/candidate/dashboard'}
            className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="dashboard-nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-help-card">
        <span>✦</span>
        <div>
          <strong>Need a hand?</strong>
          <small>Ask the DriverHub assistant.</small>
        </div>
      </div>
    </aside>
  );
}
