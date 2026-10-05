import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import { JobCard } from '../../components/data/Cards';
import { Button, Card, Field, SelectField, StatusBadge } from '../../components/ui/Primitives';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/Feedback';
import { candidateService } from '../../services/candidateService';
import { jobService } from '../../services/jobService';
import { notificationService } from '../../services/platformService';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/apiErrors';

const quickActions = [
  ['Find a job', '/jobs', '⌕', 'Browse verified openings'],
  ['Update profile', '/candidate/profile', '♙', 'Improve your visibility'],
  ['Applications', '/candidate/applications', '▤', 'Track your progress'],
];

function formatSalary(min, max) {
  if (!min && !max) return 'Salary disclosed on listing';
  return `₹${Number(min || 0).toLocaleString('en-IN')} – ₹${Number(max || 0).toLocaleString('en-IN')}`;
}

function CandidateDashboardContent({ profile, applications, jobs, notifications }) {
  const { user } = useAuth();
  const applicationRows = applications?.results || [];
  const unread = notifications?.results?.filter((item) => !item.is_read).length || 0;
  const shortlisted = applicationRows.filter((item) => ['shortlisted', 'hired'].includes(item.status)).length;
  const saved = Number(profile?.saved_jobs_count || 0);
  const completionFields = [
    profile?.location,
    profile?.experience_years,
    profile?.license_category,
    profile?.license_number,
    profile?.skills,
    profile?.bio,
    profile?.resume,
    profile?.profile_photo,
  ];
  const completion = Math.min(100, Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100));
  const profileName = profile?.user?.name || user?.name || 'Driver';
  const experience = Number(profile?.experience_years || 0);
  const recommendedJobs = jobs?.results?.slice(0, 3) || [];
  const recentApplications = applicationRows.slice(0, 4);

  return (
    <div className="candidate-dashboard-page">
      <div className="candidate-dashboard-shell">
        <DashboardSidebar user={user} profile={profile} />
        <main className="candidate-dashboard-main">
          <section className="candidate-welcome-card animate-up">
            <div>
              <span className="dashboard-status-pill">● DRIVER ACCOUNT ACTIVE</span>
              <h1>{profile?.license_category || 'Driver'} Specialist <span>•</span> {experience} Years Experience <span>•</span> {profile?.location || 'Add your location'}</h1>
              <p>Keep your profile ready and discover opportunities matched to your experience.</p>
            </div>
            <div className="profile-completion-card">
              <div><span>Profile Completion</span><strong>{completion}%</strong></div>
              <div className="completion-track"><span style={{ width: `${completion}%` }} /></div>
              <small>{completion < 100 ? 'Complete your profile to improve employer visibility.' : 'Your profile is ready for employers.'}</small>
              <Link to="/candidate/profile">{completion < 100 ? 'Complete profile →' : 'Review profile →'}</Link>
            </div>
          </section>

          <section className="dashboard-stat-grid">
            <div className="dashboard-stat-card"><span className="dashboard-stat-icon blue">▤</span><div><small>Total Applications</small><strong>{applications?.count ?? applicationRows.length}</strong><em>Across verified fleets</em></div></div>
            <div className="dashboard-stat-card"><span className="dashboard-stat-icon gold">♙</span><div><small>Shortlisted / Interviews</small><strong>{shortlisted}</strong><em>{shortlisted ? 'Keep your profile ready' : 'Ready for your next trial'}</em></div></div>
            <div className="dashboard-stat-card"><span className="dashboard-stat-icon red">♡</span><div><small>Saved Vacancies</small><strong>{saved}</strong><em><Link to="/jobs">View bookmarks →</Link></em></div></div>
            <div className="dashboard-stat-card"><span className="dashboard-stat-icon green">◇</span><div><small>Uploaded Documents</small><strong>{[profile?.resume, profile?.profile_photo].filter(Boolean).length}</strong><em><Link to="/candidate/profile">Manage files →</Link></em></div></div>
          </section>

          <section className="dashboard-two-column">
            <Card className="dashboard-panel applications-panel">
              <div className="dashboard-panel-heading"><div><span className="panel-kicker">Activity</span><h2>Recent Applications</h2></div><Link to="/candidate/applications">View all ({applications?.count ?? applicationRows.length}) →</Link></div>
              {recentApplications.length ? <div className="application-list">{recentApplications.map((item) => <div className="application-row" key={item.id}><div className="application-company-avatar">{(item.company_name || 'D').slice(0, 1).toUpperCase()}</div><div className="application-copy"><strong>{item.job_title}</strong><span>{item.company_name || 'DriverHub Employer'} • {item.location || 'Location flexible'}</span></div><StatusBadge status={item.status} /><small>{item.applied_at ? new Date(item.applied_at).toLocaleDateString('en-IN') : 'Recent'}</small></div>)}</div> : <div className="dashboard-empty"><span>▤</span><p>You haven't applied to any driver vacancies yet.</p><Link to="/jobs">Explore Open Jobs →</Link></div>}
            </Card>

            <Card className="dashboard-panel updates-panel">
              <div className="dashboard-panel-heading"><div><span className="panel-kicker">Inbox</span><h2>Recent Updates</h2></div><Link to="/candidate/notifications">View inbox →</Link></div>
              {notifications?.results?.length ? <div className="update-list">{notifications.results.slice(0, 4).map((item) => <div className="update-row" key={item.id}><span className="update-dot">●</span><div><strong>{item.title || 'DriverHub update'}</strong><p>{item.message || 'You have a new update.'}</p></div></div>)}</div> : <div className="dashboard-empty compact"><span>♢</span><p>{unread ? `${unread} unread updates` : 'No unread notifications'}</p></div>}
            </Card>
          </section>

          <section className="quick-actions-section">
            <div className="dashboard-panel-heading"><div><span className="panel-kicker">Shortcuts</span><h2>Quick actions</h2></div></div>
            <div className="quick-actions-grid">{quickActions.map(([label, href, icon, description]) => <Link to={href} className="quick-action-card" key={label}><span>{icon}</span><div><strong>{label}</strong><small>{description}</small></div><b>→</b></Link>)}</div>
          </section>

          <section className="recommended-section">
            <div className="dashboard-panel-heading"><div><span className="panel-kicker">Recommended for your profile</span><h2>Jobs worth a look</h2><p>Based on your {profile?.license_category || 'driver'} category and {profile?.location || 'preferred location'}.</p></div><Link to="/jobs">View all vacancies →</Link></div>
            {recommendedJobs.length ? <div className="recommended-grid">{recommendedJobs.map((job) => <div className="recommended-job-card" key={job.id}><div className="recommended-job-top"><span className="company-avatar">{(job.company_name || 'D').slice(0, 1).toUpperCase()}</span><StatusBadge status={job.status || 'approved'} /></div><span className="recommended-company">{job.company_name || 'Verified Employer'}</span><h3>{job.title}</h3><p>{job.location || 'India'} • {job.driver_category || 'Driver'}</p><div className="recommended-job-meta"><strong>{formatSalary(job.salary_min, job.salary_max)}</strong><span>{job.experience_required || 0}+ yrs</span></div><Link to={`/jobs/${job.id}`}>View opportunity →</Link></div>)}</div> : <div className="dashboard-recommendation-empty"><span>✦</span><div><strong>Your recommendations will appear here.</strong><p>Complete your profile and explore jobs to get more relevant opportunities.</p></div><Link to="/jobs">Browse jobs</Link></div>}
          </section>

          <section className="dashboard-insight-banner"><div><span className="dashboard-status-pill">✦ DRIVERHUB TIP</span><h2>Profiles with complete documents are easier for employers to shortlist.</h2><p>Keep your license, resume, experience and skills up to date so your next application starts stronger.</p></div><Link to="/candidate/profile">Review my profile →</Link></section>
        </main>
      </div>
    </div>
  );
}

export function CandidateDashboard() {
  const [state, setState] = useState({ profile: null, applications: null, jobs: null, notifications: null, error: '' });
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      candidateService.getProfile(),
      candidateService.getApplications(),
      jobService.list({}),
      notificationService.list({}),
    ]).then(([profile, applications, jobs, notifications]) => setState({ profile, applications, jobs, notifications, error: '' }))
      .catch((error) => setState((current) => ({ ...current, error: getApiErrorMessage(error) })));
  }, []);

  if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>;
  if (!state.profile) return <LoadingState />;
  return <CandidateDashboardContent {...state} user={user} />;
}

export function JobsPage() { const [filters, setFilters] = useState({ search: '', location: '', category: '', min_salary: '' }); const [data, setData] = useState(null); const [error, setError] = useState(''); const load = () => { setError(''); jobService.list(Object.fromEntries(Object.entries(filters).filter(([, value]) => value))).then(setData).catch((e) => setError(getApiErrorMessage(e))); }; useEffect(load, []); return <PageLayout><div className="jobs-page-hero"><span className="dashboard-status-pill">✦ PAN-INDIA VERIFIED DRIVER RECRUITMENT</span><h1>Browse driving vacancies across India</h1><p>Search approved roles from logistics fleets, corporate employers, and transport operators.</p><div className="popular-location-row"><span>⌖ Major hubs:</span>{['All India','Bengaluru','Mumbai','Delhi NCR','Chennai','Hyderabad','Pune','Kolkata'].map((city) => <button type="button" key={city} onClick={() => setFilters({ ...filters, location: city === 'All India' ? '' : city })}>{city}</button>)}</div></div><Card className="mb-8 p-5"><div className="grid gap-4 md:grid-cols-4"><Field label="Search" placeholder="Driver, logistics…" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><Field label="Location" placeholder="Bengaluru" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} /><SelectField label="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">Any category</option><option>LMV</option><option>Heavy</option><option>Commercial</option></SelectField><Field label="Minimum salary" type="number" placeholder="20000" value={filters.min_salary} onChange={(e) => setFilters({ ...filters, min_salary: e.target.value })} /></div><Button className="mt-4" onClick={load}>Search jobs</Button></Card>{error && <ErrorState message={error} />}{!data ? <LoadingState /> : data.results?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.results.map((job) => <JobCard key={job.id} job={job} />)}</div> : <EmptyState title="No jobs match those filters" description="Try a broader search or check back soon." />}</PageLayout>; }

export function JobDetailPage() { const { id } = useParams(); const navigate = useNavigate(); const [job, setJob] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false); useEffect(() => { jobService.get(id).then(setJob).catch((e) => setError(getApiErrorMessage(e))); }, [id]); if (error) return <PageLayout><ErrorState message={error} /></PageLayout>; if (!job) return <LoadingState />; const apply = async () => { setSubmitting(true); setError(''); try { await jobService.apply(id, { cover_message: message }); navigate('/candidate/applications'); } catch (e) { setError(getApiErrorMessage(e)); } finally { setSubmitting(false); } }; return <PageLayout><Link to="/jobs" className="text-sm font-semibold text-blue-700">← Back to jobs</Link><Card className="mt-6 p-8"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><p className="text-sm font-semibold text-blue-700">{job.company?.name}</p><h1 className="mt-2 text-3xl font-bold">{job.title}</h1><p className="mt-2 text-slate-500">{job.company?.location} · {job.location}</p></div><StatusBadge status={job.status} /></div><div className="mt-8 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-3"><div><p className="text-xs text-slate-500">Salary</p><p className="font-semibold">₹{job.salary_min}–₹{job.salary_max}</p></div><div><p className="text-xs text-slate-500">Experience</p><p className="font-semibold">{job.experience_required} years</p></div><div><p className="text-xs text-slate-500">Hours</p><p className="font-semibold">{job.working_hours}</p></div></div><h2 className="mt-8 text-lg font-bold">About the role</h2><p className="mt-2 whitespace-pre-wrap text-slate-600">{job.description}</p><p className="mt-6 text-sm text-slate-500">Required documents: {job.required_documents?.join(', ') || 'Not specified'}</p><div className="mt-8 border-t border-slate-200 pt-6"><Field label="Cover message" type="textarea" placeholder="Tell the employer why you are a good fit…" value={message} onChange={(e) => setMessage(e.target.value)} />{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<Button className="mt-4" onClick={apply} disabled={submitting}>{submitting ? 'Submitting…' : 'Apply for this job'}</Button></div></Card></PageLayout>; }
