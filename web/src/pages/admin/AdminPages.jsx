import { useEffect, useState } from 'react';
import PageLayout, { DataTable } from '../../components/layout/PageLayout';
import { StatCard } from '../../components/data/Cards';
import { Button, Card, PageHeader, SelectField, StatusBadge } from '../../components/ui/Primitives';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/Feedback';
import { adminService } from '../../services/platformService';
import { getApiErrorMessage } from '../../utils/apiErrors';

function useAdminList(loader) {
  const [state, setState] = useState({
    data: null,
    error: ''
  });

  const load = () =>
    loader()
      .then((data) => setState({ data, error: '' }))
      .catch((e) =>
        setState({
          data: null,
          error: getApiErrorMessage(e)
        })
      );

  useEffect(() => {
    load();
  }, []);

  return [state, load];
}

export function AdminDashboard() { const [state] = useAdminList(adminService.dashboard); if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>; if (!state.data) return <LoadingState />; const d = state.data; return <PageLayout><PageHeader eyebrow="Platform administration" title="Driver Hub overview" description="Monitor the marketplace and moderate platform activity." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><StatCard label="Candidates" value={d.total_candidates} /><StatCard label="Employers" value={d.total_employers} accent="orange" /><StatCard label="Jobs" value={d.total_jobs} /><StatCard label="Applications" value={d.total_applications} accent="orange" /><StatCard label="Pending jobs" value={d.pending_jobs} /></div><Card className="mt-8 p-6"><h2 className="font-bold">Moderation queue</h2><p className="mt-2 text-sm text-slate-500">Use the management sections to review users, jobs, and applications.</p></Card></PageLayout>; }

export function AdminCandidates() { const [state, load] = useAdminList(adminService.candidates); const toggle = async (id, active) => { try { await adminService.updateCandidateActive(id, !active); load(); } catch (e) { alert(getApiErrorMessage(e)); } }; if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>; if (!state.data) return <LoadingState />; return <PageLayout><PageHeader eyebrow="Administration" title="Candidate management" description="Control account availability without exposing private credentials." />{!state.data.results?.length ? <EmptyState title="No candidates" /> : <DataTable><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Account</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">{state.data.results.map((row) => <tr key={row.id}><td className="px-5 py-4 font-semibold">{row.user.name}</td><td className="px-5 py-4">{row.user.email}</td><td className="px-5 py-4">{row.location || '—'}</td><td className="px-5 py-4"><StatusBadge status={row.user.is_active ? 'approved' : 'blocked'} /></td><td className="px-5 py-4"><Button variant={row.user.is_active ? 'danger' : 'secondary'} onClick={() => toggle(row.id, row.user.is_active)}>{row.user.is_active ? 'Block' : 'Unblock'}</Button></td></tr>)}</tbody></DataTable>}</PageLayout>; }

export function AdminEmployers() { const [state, load] = useAdminList(adminService.employers); const toggle = async (id, active) => { try { await adminService.updateEmployerActive(id, !active); load(); } catch (e) { alert(getApiErrorMessage(e)); } }; if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>; if (!state.data) return <LoadingState />; return <PageLayout><PageHeader eyebrow="Administration" title="Employer management" />{!state.data.results?.length ? <EmptyState title="No employers" /> : <DataTable><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-5 py-4">Company</th><th className="px-5 py-4">Contact email</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Account</th><th className="px-5 py-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">{state.data.results.map((row) => <tr key={row.id}><td className="px-5 py-4 font-semibold">{row.company_name || 'Unnamed company'}</td><td className="px-5 py-4">{row.user.email}</td><td className="px-5 py-4">{row.location || '—'}</td><td className="px-5 py-4"><StatusBadge status={row.user.is_active ? 'approved' : 'blocked'} /></td><td className="px-5 py-4"><Button variant={row.user.is_active ? 'danger' : 'secondary'} onClick={() => toggle(row.id, row.user.is_active)}>{row.user.is_active ? 'Block' : 'Unblock'}</Button></td></tr>)}</tbody></DataTable>}</PageLayout>; }

export function AdminJobs() { const [state, load] = useAdminList(adminService.jobs); const update = async (id, status) => { try { await adminService.updateJob(id, { status }); load(); } catch (e) { alert(getApiErrorMessage(e)); } }; if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>; if (!state.data) return <LoadingState />; return <PageLayout><PageHeader eyebrow="Administration" title="Job management" description="Approve, reject, or close job postings." />{!state.data.results?.length ? <EmptyState title="No jobs" /> : <div className="space-y-4">{state.data.results.map((job) => <Card key={job.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="font-bold">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.employer_name} · {job.location}</p></div><div className="flex items-center gap-3"><StatusBadge status={job.status} /><SelectField label="" value={job.status} onChange={(e) => update(job.id, e.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="closed">Closed</option></SelectField></div></Card>)}</div>}</PageLayout>; }

export function AdminApplications() { const [state, load] = useAdminList(adminService.applications); const update = async (id, status) => { try { await adminService.updateApplication(id, { status }); load(); } catch (e) { alert(getApiErrorMessage(e)); } }; if (state.error) return <PageLayout><ErrorState message={state.error} /></PageLayout>; if (!state.data) return <LoadingState />; return <PageLayout><PageHeader eyebrow="Administration" title="Application management" />{!state.data.results?.length ? <EmptyState title="No applications" /> : <DataTable><thead><tr className="text-left text-xs uppercase tracking-wide text-slate-500"><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Update status</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">{state.data.results.map((app) => <tr key={app.id}><td className="px-5 py-4 font-semibold">{app.candidate_name}</td><td className="px-5 py-4">{app.job_title}</td><td className="px-5 py-4"><StatusBadge status={app.status} /></td><td className="px-5 py-4"><SelectField label="" value={app.status} onChange={(e) => update(app.id, e.target.value)}><option value="applied">Applied</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option><option value="hired">Hired</option></SelectField></td></tr>)}</tbody></DataTable>}</PageLayout>; }
