import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { JobCard } from '../../components/data/Cards';
import Reveal from '../../components/ui/Reveal';

const categories = [
  ['Heavy Vehicle', '🚛', 'Long-haul, fleet & commercial driving'],
  ['Delivery Driver', '📦', 'Last-mile and logistics opportunities'],
  ['Cab & Chauffeur', '🚘', 'Personal, taxi and corporate driving'],
  ['School & Staff', '🚌', 'Safe passenger transport roles'],
];

export function LandingPage() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => { jobService.list({}).then((data) => setJobs(data?.results?.slice(0, 3) || [])).catch(() => setJobs([])); }, []);

  return <div className="landing-page">
    <section className="hero-section">
      <div className="hero-grid-lines" />
      <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
      <div className="hero-content">
        <div className="hero-copy animate-up"><div className="hero-badge">✦ The smarter way to hire drivers</div><h1>Drive your career <span>forward.</span></h1><p>Find verified driver jobs, build your professional profile, and connect directly with employers who are ready to hire.</p><div className="hero-actions"><Link to="/jobs" className="hero-primary">Explore driver jobs <span>→</span></Link><Link to="/register" className="hero-secondary">Create your profile</Link></div><div className="hero-trust"><span>✓ Verified employers</span><span>✓ Direct applications</span><span>✓ Secure profiles</span></div></div>
        <div className="hero-visual animate-float"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-road-card"><div className="road-lines" /><div className="hero-truck"><div className="truck-cabin" /><div className="truck-body" /><div className="truck-wheel wheel-one" /><div className="truck-wheel wheel-two" /></div><div className="hero-location-card"><span>●</span><div><strong>Open opportunities</strong><small>Across your city & beyond</small></div></div></div></div>
      </div>
      <div className="hero-wave" />
    </section>

    <Reveal><section className="trust-strip"><div><strong>Built for the complete hiring journey</strong><span>From profile creation to the final hire, everything stays in one place.</span></div><div className="trust-items"><span>01 Search</span><span>02 Apply</span><span>03 Shortlist</span><span>04 Hire</span></div></section></Reveal>

    <Reveal><section className="content-section"><div className="section-heading"><div><div className="eyebrow">Find the right road</div><h2>Driver roles for every journey</h2></div><Link to="/jobs" className="text-link">View all jobs →</Link></div><div className="category-grid">{categories.map(([title, icon, text], index) => <Link to="/jobs" className="category-card" key={title}><span className={`category-number n-${index + 1}`}>0{index + 1}</span><div className="category-icon">{icon}</div><h3>{title}</h3><p>{text}</p><span className="category-arrow">→</span></Link>)}</div></section></Reveal>

    <Reveal><section className="content-section jobs-section"><div className="section-heading"><div><div className="eyebrow">Fresh opportunities</div><h2>Featured driver jobs</h2><p>Explore roles connected to the same hiring workflow used by your dashboard.</p></div><Link to="/jobs" className="text-link">Browse all →</Link></div>{jobs.length ? <div className="jobs-grid">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="empty-preview"><div>🚚</div><h3>Your next opportunity starts here.</h3><p>Once employers publish approved openings, they will appear here automatically.</p><Link to="/jobs">Explore the jobs marketplace →</Link></div>}</section></Reveal>

    <Reveal><section className="stats-band"><div><strong>01</strong><span>Profile</span></div><div><strong>02</strong><span>Discover</span></div><div><strong>03</strong><span>Apply</span></div><div><strong>04</strong><span>Get hired</span></div><div className="stats-band-copy"><b>One clear journey.</b><span>Less friction for drivers and hiring teams.</span></div></section></Reveal>

    <Reveal><section className="split-section"><div className="split-panel dark-panel"><div className="eyebrow light">For drivers</div><h2>Turn your experience into your next opportunity.</h2><p>Create one professional profile, keep your resume ready, discover relevant roles and track every application from one place.</p><ul><li>Profile & resume management</li><li>Job search and smart filters</li><li>Application status tracking</li><li>Employer communication</li></ul><Link to="/register" className="panel-button">Build my profile →</Link></div><div className="split-panel light-panel"><div className="eyebrow">For employers</div><h2>Find capable drivers without the hiring clutter.</h2><p>Publish roles, review candidate applications, open resumes and move the right people through shortlist, rejection or hire.</p><ul><li>Job posting management</li><li>Candidate discovery</li><li>Application review</li><li>End-to-end hiring actions</li></ul><Link to="/register" className="panel-button gold">Start hiring →</Link></div></section></Reveal>

    <Reveal><section className="cta-section"><div><div className="eyebrow light">Ready when you are</div><h2>One platform. Better driver hiring.</h2><p>Whether you are behind the wheel or building a fleet, DriverHub keeps the journey simple.</p></div><div className="cta-actions"><Link to="/register" className="hero-primary">Get started free <span>→</span></Link><Link to="/jobs" className="cta-text">Explore jobs</Link></div></section></Reveal>
  </div>;
}

function AuthCard({ mode }) {
  const isLogin = mode === 'login';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(isLogin ? { email: '', password: '' } : { name: '', email: '', password: '', phone: '', role: 'candidate' });
  const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;
  const submit = async (event) => { event.preventDefault(); setError(''); setSubmitting(true); try { const result = isLogin ? await login(form) : await register(form); navigate(`/${result.user.role}/dashboard`); } catch (err) { setError(err.response?.data?.detail || err.response?.data?.error?.message || 'Unable to complete the request.'); } finally { setSubmitting(false); } };
  return <section className="auth-page"><div className="auth-shell"><div className="auth-visual"><div className="auth-visual-top"><span className="auth-mark">DH</span><span>DriverHub</span></div><div><div className="eyebrow light">Professional driver network</div><h1>{isLogin ? 'Welcome back to the road.' : 'Start your next driving chapter.'}</h1><p>{isLogin ? 'Access your driver profile, employer workspace or fleet tools.' : 'Create a professional profile and connect with better opportunities.'}</p></div><div className="auth-visual-stats"><span><strong>01</strong><small>Profile</small></span><span><strong>02</strong><small>Discover</small></span><span><strong>03</strong><small>Connect</small></span></div></div><div className="auth-form-side"><div className="auth-form-inner"><div className="eyebrow">DriverHub account</div><h1>{isLogin ? 'Sign in' : 'Create your account'}</h1><p className="auth-subtitle">{isLogin ? 'Continue where you left off.' : 'Choose how you want to use DriverHub.'}</p>{!isLogin && <div className="role-switch"><button type="button" className={form.role === 'candidate' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'candidate' })}>Driver</button><button type="button" className={form.role === 'employer' ? 'active' : ''} onClick={() => setForm({ ...form, role: 'employer' })}>Employer</button></div>}<form onSubmit={submit} className="auth-form">{!isLogin && <label className="dh-field"><span>Full name</span><input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></label>}<label className="dh-field"><span>Email address</span><input required type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label><label className="dh-field"><span>Password</span><div className="password-wrap"><input required type={showPassword ? 'text' : 'password'} minLength="8" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{!isLogin && <label className="dh-field"><span>Phone <em>optional</em></span><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" /></label>}{error && <div className="form-error">{error}</div>}<button disabled={submitting} className="auth-submit">{submitting ? 'Please wait…' : isLogin ? 'Sign in to DriverHub →' : 'Create my account →'}</button></form><p className="auth-switch">{isLogin ? <>New to DriverHub? <Link to="/register">Create an account</Link></> : <>Already have an account? <Link to="/login">Sign in</Link></>}</p></div></div></div></section>;
}

export function LoginPage() { return <AuthCard mode="login" />; }
export function RegisterPage() { return <AuthCard mode="register" />; }

function AboutPage() {
  const features = [
    ['🛡️', 'Verified hiring', 'Clear account and listing states help drivers make better decisions.'],
    ['⚡', 'Direct connections', 'Apply directly and let employers manage the process in one workspace.'],
    ['📋', 'Career-ready profiles', 'Keep your experience, resume and documents organized for every opportunity.'],
  ];
  const steps = [['01', 'Create your profile', 'Add your experience, preferred roles and professional documents.'], ['02', 'Discover the right role', 'Search jobs by location, category, salary and keywords.'], ['03', 'Apply with confidence', 'Send applications and keep every status in one place.'], ['04', 'Move toward the hire', 'Employers can shortlist, contact and hire from their workspace.']];
  return <div className="premium-info-page">
    <section className="info-hero about-hero"><Reveal><div className="eyebrow">About DriverHub</div><h1>Empowering commercial drivers.<br /><span>Connecting fleet leaders.</span></h1><p>DriverHub brings drivers and employers together through a focused recruitment experience built around clarity, trust and faster hiring.</p><div className="info-hero-actions"><Link to="/jobs" className="hero-primary">Explore opportunities <span>→</span></Link><Link to="/register" className="hero-secondary">Join DriverHub</Link></div></Reveal><div className="hero-floating-card"><span>✦</span><div><strong>Built around the driver journey</strong><small>Discover → Apply → Connect → Hire</small></div></div></section>
    <Reveal><section className="info-feature-grid">{features.map(([icon, title, text]) => <article className="info-feature-card" key={title}><span className="feature-icon">{icon}</span><h2>{title}</h2><p>{text}</p><span className="feature-arrow">↗</span></article>)}</section></Reveal>
    <Reveal><section className="mission-section"><div><div className="eyebrow light">Our mission</div><h2>Make driver recruitment feel simple, transparent and human.</h2></div><p>Great recruitment should not feel like a maze. DriverHub brings job discovery, professional profiles, applications and employer decisions into one connected experience so every side knows what happens next.</p></section></Reveal>
    <Reveal><section className="journey-section"><div className="section-heading"><div><div className="eyebrow">How it works</div><h2>A clearer journey from search to hire.</h2></div><Link to="/jobs" className="text-link">See open roles →</Link></div><div className="journey-grid">{steps.map(([num, title, text]) => <article className="journey-card" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section></Reveal>
    <Reveal><section className="about-metrics"><div><strong>01</strong><span>Driver-first experience</span></div><div><strong>02</strong><span>Employer-ready workflows</span></div><div><strong>03</strong><span>Responsive by design</span></div><div><strong>04</strong><span>Built for real hiring journeys</span></div></section></Reveal>
    <Reveal><section className="info-cta"><div><div className="eyebrow light">Ready to move forward?</div><h2>Your next opportunity can start here.</h2><p>Build a profile, explore jobs and keep the whole journey in one place.</p></div><Link to="/jobs" className="hero-primary">Find driver jobs <span>→</span></Link></section></Reveal>
  </div>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Driver support', message: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); setSent(true); };
  return <div className="premium-info-page">
    <section className="contact-hero"><Reveal><div className="eyebrow">Get in touch</div><h1>We're here to help<br /><span>drivers & fleets.</span></h1><p>Have a question about jobs, applications, verification or hiring? Choose a support path and send us a message.</p></Reveal></section>
    <Reveal><section className="contact-grid">
      <aside className="contact-support-card"><div className="eyebrow light">Support desk</div><h2>Central Operations & Helpdesk</h2><p>Support for drivers, employers and hiring teams using the DriverHub experience.</p><div className="contact-detail"><span>⌖</span><div><strong>Operations</strong><small>Bengaluru, Karnataka · India</small></div></div><div className="contact-detail"><span>⌕</span><div><strong>Phone</strong><small>+91 80 2200 8899</small></div></div><div className="contact-detail"><span>✉</span><div><strong>Email</strong><small>support@driverhub.in</small></div></div><div className="support-hours"><strong>Support hours</strong><span>Mon – Sat · 9:00 AM – 7:00 PM IST</span></div><div className="support-emergency"><b>✦ Safety & urgent help</b><span>For account or hiring issues that need quick attention.</span></div></aside>
      <div className="contact-form-card"><div className="form-card-heading"><div><div className="eyebrow">Send an inquiry</div><h2>Tell us what you need.</h2><p>We’ll route your message to the right support area.</p></div><span className="form-live-dot">● Online</span></div>{sent ? <div className="contact-success"><div>✓</div><h3>Message received.</h3><p>Thanks for reaching out. Your support request has been captured for this demo experience.</p><button type="button" className="dh-button dh-button-primary" onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', subject: 'Driver support', message: '' }); }}>Send another message</button></div> : <form onSubmit={submit} className="contact-form"><div className="contact-form-row"><label className="dh-field"><span>Full name</span><input required className="form-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label><label className="dh-field"><span>Phone number</span><input className="form-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" /></label></div><div className="contact-form-row"><label className="dh-field"><span>Email address</span><input required type="email" className="form-input" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></label><label className="dh-field"><span>Inquiry type</span><select className="form-input" value={form.subject} onChange={(e) => update('subject', e.target.value)}><option>Driver support</option><option>Job application</option><option>Employer hiring</option><option>Verification & documents</option><option>Technical support</option></select></label></div><label className="dh-field"><span>Message</span><textarea required className="form-input" maxLength="600" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="How can DriverHub help you today?" /><small className="character-count">{form.message.length}/600</small></label><button className="auth-submit" type="submit">Send inquiry <span>→</span></button><small className="privacy-note">By sending this message, you agree to use the contact channel for DriverHub support purposes.</small></form>}</div>
    </section></Reveal>
    <Reveal><section className="contact-options"><div><span>🧑‍✈️</span><strong>I'm a driver</strong><small>Find jobs, manage applications or update your profile.</small><Link to="/jobs">Find jobs →</Link></div><div><span>🏢</span><strong>I'm an employer</strong><small>Post roles, review candidates and manage hiring.</small><Link to="/register">Start hiring →</Link></div><div><span>📄</span><strong>Documents & verification</strong><small>Get help with resumes, licenses and profile information.</small><Link to="/login">Open my account →</Link></div></section></Reveal>
  </div>;
}

export function PublicInfoPage({ type }) {
  if (type === 'about') return <AboutPage />;
  if (type === 'contact') return <ContactPage />;
  return <section className="info-page"><div className="info-card"><div className="eyebrow">Employer network</div><h1>Discover companies building better driver teams.</h1><p>DriverHub gives employers a direct place to publish opportunities and gives drivers a clearer way to evaluate the teams behind the jobs.</p><Link className="hero-primary" to="/jobs">Browse open jobs <span>→</span></Link></div></section>;
}
