import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LandingPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Driver careers, connected
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950">
          Find the next road for your career.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Driver Hub will connect candidates with trusted employers through one
          secure platform.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Join Driver Hub
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

function AuthCard({ mode }) {
  const isLogin = mode === 'login';

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(
    isLogin
      ? { email: '', password: '' }
      : {
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'candidate',
        }
  );

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = isLogin
        ? await login(form)
        : await register(form);

      navigate(`/${result.user.role}/dashboard`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error?.message ||
          'Unable to complete the request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Driver Hub
        </p>

        <h1 className="mt-2 text-2xl font-bold">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          
          {!isLogin && (
            <>
              <label className="block text-sm font-medium">
                Name
                <input
                  required
                  className="form-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label className="block text-sm font-medium">
                Role
                <select
                  className="form-input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                </select>
              </label>
            </>
          )}

          <label className="block text-sm font-medium">
            Email

            <input
              required
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </label>

          {/* Password with show/hide */}
          <label className="block text-sm font-medium">
            Password

            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                minLength="8"
                className="form-input pr-12"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-500"
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword ? '◉' : '👁'}
              </button>
            </div>
          </label>

          {!isLogin && (
            <label className="block text-sm font-medium">
              Phone

              <input
                className="form-input"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
            </label>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            disabled={submitting}
            className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting
              ? 'Please wait…'
              : isLogin
              ? 'Log in'
              : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          {isLogin ? (
            <>
              New to Driver Hub?{' '}
              <Link
                className="font-semibold text-blue-700"
                to="/register"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already registered?{' '}
              <Link
                className="font-semibold text-blue-700"
                to="/login"
              >
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

export function LoginPage() {
  return <AuthCard mode="login" />;
}

export function RegisterPage() {
  return <AuthCard mode="register" />;
}