import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageLayout, { DataTable } from '../../components/layout/PageLayout';
import { JobCard, StatCard } from '../../components/data/Cards';
import {
  Button,
  Card,
  Field,
  PageHeader,
  StatusBadge,
} from '../../components/ui/Primitives';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/Feedback';
import { employerService } from '../../services/employerService';
import { getApiErrorMessage } from '../../utils/apiErrors';


/* =========================================================
   EMPLOYER DASHBOARD
========================================================= */

export function EmployerDashboard() {
  const [jobs, setJobs] = useState(null);
  const [apps, setApps] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      employerService.listJobs(),
      employerService.listApplications(),
    ])
      .then(([j, a]) => {
        setJobs(j);
        setApps(a);
      })
      .catch((e) => setError(getApiErrorMessage(e)));
  }, []);

  if (error) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }

  if (!jobs || !apps) {
    return <LoadingState />;
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Employer workspace"
        title="Build your next great team"
        description="Manage your roles and move the right candidates forward."
        actions={
          <Link
            to="/employer/jobs/create"
            className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Post a job
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your jobs" value={jobs.count} />

        <StatCard
          label="Applications"
          value={apps.count}
          accent="orange"
        />

        <StatCard
          label="Open pipeline"
          value={
            apps.results?.filter(
              (a) => a.status === 'shortlisted'
            ).length || 0
          }
        />
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-lg font-bold">Recent roles</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {jobs.results?.slice(0, 2).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </Card>
    </PageLayout>
  );
}


/* =========================================================
   EMPLOYER PROFILE
========================================================= */

export function EmployerProfile() {
  const [form, setForm] = useState(null);
  const [logo, setLogo] = useState(null);

  const [state, setState] = useState({
    loading: true,
    saving: false,
    error: '',
    success: '',
  });

  useEffect(() => {
    employerService
      .getProfile()
      .then(setForm)
      .catch((e) =>
        setState((s) => ({
          ...s,
          error: getApiErrorMessage(e),
        }))
      )
      .finally(() =>
        setState((s) => ({
          ...s,
          loading: false,
        }))
      );
  }, []);

  if (state.loading) {
    return <LoadingState />;
  }

  if (!form) {
    return (
      <PageLayout>
        <ErrorState message={state.error} />
      </PageLayout>
    );
  }

  const save = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (
        ![
          'id',
          'created_at',
          'updated_at',
          'company_logo',
        ].includes(key) &&
        value !== null &&
        value !== undefined
      ) {
        payload.append(key, value);
      }
    });

    if (logo) {
      payload.append('company_logo', logo);
    }

    setState((s) => ({
      ...s,
      saving: true,
      error: '',
      success: '',
    }));

    try {
      setForm(await employerService.updateProfile(payload));

      setState((s) => ({
        ...s,
        saving: false,
        success: 'Company profile saved.',
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        saving: false,
        error: getApiErrorMessage(err),
      }));
    }
  };

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Employer profile"
        title="Tell candidates about your company"
      />

      <Card className="max-w-3xl p-6">
        <form
          onSubmit={save}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field
            label="Company name"
            value={form.company_name || ''}
            onChange={(e) =>
              setForm({
                ...form,
                company_name: e.target.value,
              })
            }
          />

          <Field
            label="Location"
            value={form.location || ''}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <Field
            label="Phone"
            value={form.phone || ''}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <Field
            label="Website"
            type="url"
            value={form.website || ''}
            onChange={(e) =>
              setForm({
                ...form,
                website: e.target.value,
              })
            }
          />

          <Field
            className="sm:col-span-2"
            label="Company description"
            type="textarea"
            value={form.company_description || ''}
            onChange={(e) =>
              setForm({
                ...form,
                company_description: e.target.value,
              })
            }
          />

          <label className="text-sm font-medium">
            Company logo

            <input
              className="mt-2 block text-sm"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) =>
                setLogo(e.target.files?.[0] || null)
              }
            />
          </label>

          <div className="flex items-end justify-end sm:col-span-2">
            <Button disabled={state.saving}>
              {state.saving
                ? 'Saving…'
                : 'Save profile'}
            </Button>
          </div>
        </form>

        {state.success && (
          <p className="mt-4 text-sm text-emerald-700">
            {state.success}
          </p>
        )}

        {state.error && (
          <p className="mt-4 text-sm text-red-600">
            {state.error}
          </p>
        )}
      </Card>
    </PageLayout>
  );
}


/* =========================================================
   EMPLOYER JOBS
========================================================= */

export function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await employerService.listJobs();

      setJobs(data.results || data || []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Employer workspace"
        title="My jobs"
        description="Create and manage your driver job openings."
        actions={
          <Link
            to="/employer/jobs/create"
            className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Post a job
          </Link>
        }
      />

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <EmptyState
              title="No jobs yet"
              description="Create your first driver job opening."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {job.driver_category}
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-slate-900">
                        {job.title}
                      </h2>
                    </div>

                    <StatusBadge status={job.status} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>📍 {job.location}</p>

                    <p>
                      💰 ₹{job.salary_min}–₹{job.salary_max}
                    </p>

                    <p>
                      🚚 {job.experience_required} years experience
                    </p>

                    <p>
                      🕒 {job.working_hours}
                    </p>
                  </div>

                  <Link
                    to={`/employer/jobs/${job.id}`}
                    className="mt-5 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View job →
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}


/* =========================================================
   EMPLOYER APPLICATIONS
========================================================= */

export function EmployerApplications() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  const [error, setError] = useState('');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      setError('');

      const result =
        await employerService.listApplications();

      setData(result);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const viewApplication = async (id) => {
    try {
      setError('');
      setLoadingDetails(true);

      const result =
        await employerService.getApplication(id);

      setSelected(result);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoadingDetails(false);
    }
  };

  const update = async (id, status) => {
    try {
      setError('');
      setUpdating(true);

      await employerService.updateApplicationStatus(
        id,
        status
      );

      await load();

      const result =
        await employerService.getApplication(id);

      setSelected(result);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setUpdating(false);
    }
  };

  const contactCandidate = async (id) => {
    try {
      setError('');

      const result =
        await employerService.contactCandidate(id);

      if (result?.email) {
        window.location.href =
          `mailto:${result.email}`;
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  if (error) {
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );
  }

  if (!data) {
    return <LoadingState />;
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Employer workspace"
        title="Received applications"
        description="Review candidates and move applications through your hiring process."
      />

      {!data.results?.length ? (
        <EmptyState
          title="No applications yet"
          description="Applications submitted by candidates will appear here."
        />
      ) : (
        <DataTable>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-4">
                Candidate
              </th>

              <th className="px-5 py-4">
                Role
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {data.results.map((app) => (
              <tr key={app.id}>
                <td className="px-5 py-4 font-semibold">
                  {app.candidate_name}
                </td>

                <td className="px-5 py-4">
                  {app.job_title}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={app.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        viewApplication(app.id)
                      }
                    >
                      View
                    </Button>

                    <Button
                      variant="secondary"
                      disabled={updating}
                      onClick={() =>
                        update(
                          app.id,
                          'shortlisted'
                        )
                      }
                    >
                      Shortlist
                    </Button>

                    <Button
                      variant="danger"
                      disabled={updating}
                      onClick={() =>
                        update(
                          app.id,
                          'rejected'
                        )
                      }
                    >
                      Reject
                    </Button>

                    <Button
                      disabled={updating}
                      onClick={() =>
                        update(
                          app.id,
                          'hired'
                        )
                      }
                    >
                      Hire
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}

      {loadingDetails && (
        <div className="mt-8">
          <LoadingState />
        </div>
      )}

      {selected && (
        <Card className="mt-8 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Application details
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {selected.candidate_name ||
                  selected.candidate?.name ||
                  'Candidate'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selected.job_title ||
                  selected.job?.title ||
                  ''}
              </p>
            </div>

            <StatusBadge
              status={selected.status}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            {/* Candidate information */}

            <Card className="p-4">
              <h3 className="font-semibold">
                Candidate information
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Name:</strong>{' '}
                  {selected.candidate_name ||
                    selected.candidate?.name ||
                    'Not available'}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {selected.candidate_email ||
                    selected.candidate?.email ||
                    'Not available'}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {selected.candidate_phone ||
                    selected.candidate?.phone ||
                    'Not available'}
                </p>

                <p>
                  <strong>Location:</strong>{' '}
                  {selected.location ||
                    selected.candidate?.location ||
                    'Not available'}
                </p>

                <p>
                  <strong>Experience:</strong>{' '}
                  {selected.experience_years ??
                    selected.candidate?.experience_years ??
                    0}{' '}
                  years
                </p>

                <p>
                  <strong>License:</strong>{' '}
                  {selected.license_category ||
                    selected.candidate?.license_category ||
                    'Not available'}
                </p>
              </div>
            </Card>


            {/* Professional information */}

            <Card className="p-4">
              <h3 className="font-semibold">
                Professional details
              </h3>

              <div className="mt-3 space-y-3 text-sm text-slate-600">

                <div>
                  <strong>Skills</strong>

                  <p className="mt-1">
                    {selected.skills ||
                      selected.candidate?.skills ||
                      'No skills listed'}
                  </p>
                </div>

                <div>
                  <strong>Bio</strong>

                  <p className="mt-1">
                    {selected.bio ||
                      selected.candidate?.bio ||
                      'No bio provided'}
                  </p>
                </div>

                <div>
                  <strong>Availability</strong>

                  <p className="mt-1">
                    {selected.availability ||
                      selected.candidate?.availability ||
                      'Not specified'}
                  </p>
                </div>

              </div>
            </Card>
          </div>


          {/* Application details */}

          <Card className="mt-4 p-4">
            <h3 className="font-semibold">
              Application
            </h3>

            <p className="mt-3 text-sm text-slate-600">
              {selected.cover_message ||
                'No cover message provided.'}
            </p>

            {selected.resume_snapshot && (
              <a
                href={selected.resume_snapshot}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                View Resume
              </a>
            )}
          </Card>


          {/* Status actions */}

          <div className="mt-6 flex flex-wrap gap-3">

            <Button
              disabled={updating}
              onClick={() =>
                update(
                  selected.id,
                  'shortlisted'
                )
              }
            >
              Shortlist
            </Button>

            <Button
              variant="danger"
              disabled={updating}
              onClick={() =>
                update(
                  selected.id,
                  'rejected'
                )
              }
            >
              Reject
            </Button>

            <Button
              disabled={updating}
              onClick={() =>
                update(
                  selected.id,
                  'hired'
                )
              }
            >
              Mark as Hired
            </Button>

            {selected.status ===
              'shortlisted' && (
              <Button
                variant="secondary"
                onClick={() =>
                  contactCandidate(
                    selected.id
                  )
                }
              >
                Contact Candidate
              </Button>
            )}

          </div>
        </Card>
      )}
    </PageLayout>
  );
}


/* =========================================================
   EMPLOYER CANDIDATES
========================================================= */

export function EmployerCandidates() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experience: '',
    license_category: '',
    skills: '',
  });

  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const search = async () => {
    try {
      setError('');

      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value
        )
      );

      const result =
        await employerService.searchCandidates(
          params
        );

      setData(result);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Talent search"
        title="Find qualified drivers"
        description="Search the backend directory using permitted profile information."
      />

      <Card className="mb-8 p-5">
        <div className="grid gap-4 md:grid-cols-3">

          <Field
            label="Search"
            value={filters.search}
            onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value,
              })
            }
          />

          <Field
            label="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value,
              })
            }
          />

          <Field
            label="Skills"
            value={filters.skills}
            onChange={(e) =>
              setFilters({
                ...filters,
                skills: e.target.value,
              })
            }
          />

          <Field
            label="Minimum experience"
            type="number"
            value={filters.experience}
            onChange={(e) =>
              setFilters({
                ...filters,
                experience: e.target.value,
              })
            }
          />

          <Field
            label="License category"
            value={filters.license_category}
            onChange={(e) =>
              setFilters({
                ...filters,
                license_category:
                  e.target.value,
              })
            }
          />

        </div>

        <Button
          className="mt-4"
          onClick={search}
        >
          Search
        </Button>
      </Card>

      {error && (
        <ErrorState message={error} />
      )}

      {!data ? (
        <LoadingState />
      ) : data.results?.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.results.map((candidate) => (
            <Card
              key={candidate.id}
              className="p-5"
            >
              <h2 className="font-bold">
                {candidate.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {candidate.location} ·{' '}
                {candidate.experience_years} years
              </p>

              <p className="mt-4 text-sm text-slate-600">
                {candidate.skills ||
                  'No skills listed'}
              </p>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {candidate.license_category ||
                  'Category not listed'}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No candidates match" />
      )}
    </PageLayout>
  );
}


/* =========================================================
   EMPLOYER JOB FORM
========================================================= */

export function EmployerJobForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: '',
    description: '',
    driver_category: 'LMV',
    experience_required: 0,
    location: '',
    salary_min: '',
    salary_max: '',
    working_hours: '',
    required_documents: [],
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    employerService
      .listJobs()
      .then((data) => {
        const jobs = data.results || data;

        const job = jobs.find(
          (item) =>
            String(item.id) === String(id)
        );

        if (job) {
          setForm({
            ...job,
            required_documents:
              job.required_documents || [],
          });
        }
      })
      .catch((e) =>
        setError(getApiErrorMessage(e))
      );
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await employerService.updateJob(
          id,
          form
        );
      } else {
        await employerService.createJob(
          form
        );
      }

      navigate('/employer/jobs');
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Employer workspace"
        title={
          id ? 'Edit job' : 'Post a job'
        }
        description="Create or update a driver opportunity."
      />

      <Card className="p-6">
        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <Field
            label="Job title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <Field
            label="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <Field
            label="Description"
            type="textarea"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <Field
            label="Driver category"
            value={form.driver_category}
            onChange={(e) =>
              setForm({
                ...form,
                driver_category:
                  e.target.value,
              })
            }
          />

          <Field
            label="Experience required"
            type="number"
            value={form.experience_required}
            onChange={(e) =>
              setForm({
                ...form,
                experience_required:
                  e.target.value,
              })
            }
          />

          <Field
            label="Minimum salary"
            type="number"
            value={form.salary_min}
            onChange={(e) =>
              setForm({
                ...form,
                salary_min: e.target.value,
              })
            }
          />

          <Field
            label="Maximum salary"
            type="number"
            value={form.salary_max}
            onChange={(e) =>
              setForm({
                ...form,
                salary_max: e.target.value,
              })
            }
          />

          <Field
            label="Working hours"
            value={form.working_hours}
            onChange={(e) =>
              setForm({
                ...form,
                working_hours:
                  e.target.value,
              })
            }
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit">
            {id
              ? 'Update job'
              : 'Post job'}
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
}