import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../ui/Primitives';

export function StatCard({ label, value, accent = 'blue', icon = '✦' }) {
  return <Card className="stat-card"><div className={`stat-icon ${accent}`}>{icon}</div><div><p>{label}</p><strong>{value}</strong></div></Card>;
}

export function JobCard({ job }) {
  return <Card className="job-card">
    <div className="job-card-top"><div className="company-avatar">{(job.company_name || 'D').slice(0, 1).toUpperCase()}</div><div className="job-card-heading"><p>{job.company_name || 'DriverHub Employer'}</p><h3>{job.title}</h3></div>{job.status && <StatusBadge status={job.status} />}</div>
    <div className="job-meta"><span>⌖ {job.location || 'Location flexible'}</span><span>◈ {job.driver_category || 'Driver'}</span><span>₹{job.salary_min || 0}–₹{job.salary_max || 0}</span><span>◷ {job.experience_required || 0}+ yrs</span></div>
    <div className="job-card-footer"><span className="verified-dot">✓ Verified listing</span><Link to={`/jobs/${job.id}`}>View details <span>→</span></Link></div>
  </Card>;
}
