import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:       #0a1f0b;
    --cream:     #f7faf7;
    --mist:      #e4ede4;
    --kelly:     #4caf50;
    --kelly-dk:  #388e3c;
    --kelly-lt:  #81c784;
    --kelly-dim: rgba(76,175,80,.08);
  }

  .reg-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
  }

  @media (max-width: 768px) {
    .reg-page {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
    .reg-panel {
      display: none !important;
    }
  }

  /* ── Left decorative panel ── */
  .reg-panel {
    background: var(--ink);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 3rem;
    text-align: center;
  }
  .reg-panel::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 70%, rgba(56,142,60,.55) 0%, transparent 65%),
      radial-gradient(ellipse 50% 50% at 80% 10%, rgba(76,175,80,.18) 0%, transparent 60%);
  }
  .reg-panel-line {
    position: absolute;
    background: linear-gradient(180deg, transparent, rgba(76,175,80,.3), transparent);
    width: 1px; top: 0; bottom: 0;
  }
  .reg-panel-line:nth-child(1) { left: 25%; }
  .reg-panel-line:nth-child(2) { left: 75%; }

  .reg-panel-inner { position: relative; z-index: 1; }

  .reg-panel-logo {
    text-decoration: none;
    display: inline-flex; align-items: center;
    margin-bottom: 3rem;
  }
  .reg-panel-cozy {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: var(--kelly-lt);
  }
  .reg-panel-casa {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 400; font-style: italic;
    color: rgba(255,255,255,.8);
  }
  .reg-panel-leaf { font-size: 1.1rem; margin-left: 5px; margin-bottom: 2px; }

  .reg-panel-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 300; color: #fff; line-height: 1.2;
    margin-bottom: 1.25rem;
  }
  .reg-panel-heading em { font-style: italic; color: var(--kelly-lt); }

  .reg-panel-sub {
    font-size: .82rem; color: rgba(255,255,255,.4);
    line-height: 1.7; max-width: 280px; margin: 0 auto 2.5rem;
  }

  .reg-panel-perks {
    display: flex; flex-direction: column; gap: .9rem;
    text-align: left;
  }
  .reg-perk {
    display: flex; align-items: center; gap: .75rem;
  }
  .reg-perk-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    border: 1px solid rgba(76,175,80,.35);
    display: flex; align-items: center; justify-content: center;
    font-size: .75rem; color: var(--kelly-lt);
  }
  .reg-perk-text {
    font-size: .78rem; color: rgba(255,255,255,.5);
    line-height: 1.4;
  }

  /* ── Right form side ── */
  .reg-form-side {
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
    overflow-y: auto;
  }
  .reg-card {
    width: 100%; max-width: 420px;
    padding: 1rem 0;
  }

  /* Mobile logo */
  .reg-mobile-logo {
    display: none;
    text-decoration: none;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  .reg-mobile-cozy {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 600; color: var(--kelly-dk);
  }
  .reg-mobile-casa {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 400; font-style: italic; color: var(--ink);
  }
  @media (max-width: 768px) {
    .reg-mobile-logo { display: flex; }
  }

  .reg-eyebrow {
    font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--kelly); margin-bottom: .75rem;
    display: flex; align-items: center; gap: .5rem;
  }
  .reg-eyebrow::before {
    content: ''; display: block;
    width: 1.5rem; height: 1px; background: var(--kelly);
  }
  .reg-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 300; color: var(--ink);
    line-height: 1.1; margin-bottom: .5rem;
  }
  .reg-heading em { font-style: italic; color: var(--kelly-dk); }
  .reg-sub {
    font-size: .82rem; color: #888; margin-bottom: 2rem;
  }

  /* ── Form fields ── */
  .reg-field { margin-bottom: 1rem; }
  .reg-field-label {
    display: block;
    font-size: .6rem; letter-spacing: .15em; text-transform: uppercase;
    color: #999; margin-bottom: .4rem; font-weight: 400;
  }
  .reg-field:focus-within .reg-field-label { color: var(--kelly-dk); }

  .reg-input-wrap { position: relative; }
  .reg-input-icon {
    position: absolute; left: .9rem; top: 50%; transform: translateY(-50%);
    color: #bbb; font-size: .85rem; pointer-events: none;
    transition: color .2s;
  }
  .reg-field:focus-within .reg-input-icon { color: var(--kelly); }

  .reg-input {
    width: 100%;
    border: 1px solid var(--mist);
    background: #fff;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-size: .88rem;
    padding: .72rem 3.5rem .72rem 2.4rem;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .reg-input::placeholder { color: #ccc; }
  .reg-input:focus {
    border-color: var(--kelly);
    box-shadow: 0 0 0 3px rgba(76,175,80,.1);
  }

  /* Password strength */
  .reg-strength { margin-top: .4rem; display: flex; gap: .3rem; }
  .reg-strength-bar {
    flex: 1; height: 2px; background: var(--mist);
    transition: background .3s;
  }
  .reg-strength-bar.weak   { background: #e74c3c; }
  .reg-strength-bar.medium { background: #f39c12; }
  .reg-strength-bar.strong { background: var(--kelly); }

  /* ── Submit ── */
  .reg-btn {
    width: 100%; margin-top: 1.5rem;
    padding: .85rem 1rem;
    background: var(--kelly-dk);
    border: none; cursor: pointer;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
    font-weight: 500;
    transition: background .2s, transform .2s, box-shadow .2s;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
  }
  .reg-btn:hover:not(:disabled) {
    background: var(--kelly);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(56,142,60,.3);
  }
  .reg-btn:disabled { opacity: .65; cursor: not-allowed; }

  .reg-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .reg-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.75rem 0;
  }
  .reg-divider::before, .reg-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--mist);
  }
  .reg-divider span {
    font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; color: #ccc;
  }

  /* ── Login link ── */
  .reg-login {
    text-align: center;
    font-size: .8rem; color: #999;
  }
  .reg-login a {
    color: var(--kelly-dk); font-weight: 500; text-decoration: none;
    border-bottom: 1px solid rgba(56,142,60,.3); padding-bottom: 1px;
    transition: color .2s, border-color .2s;
  }
  .reg-login a:hover { color: var(--kelly); border-color: var(--kelly); }

  /* ── Error banner ── */
  .reg-error {
    background: rgba(231,76,60,.07);
    border: 1px solid rgba(231,76,60,.2);
    color: #c0392b;
    font-size: .78rem; padding: .7rem 1rem;
    margin-bottom: 1rem;
  }

  /* ── Terms note ── */
  .reg-terms {
    font-size: .68rem; color: #bbb; text-align: center;
    margin-top: 1rem; line-height: 1.5;
  }
  .reg-terms a { color: var(--kelly-dk); text-decoration: none; }
  .reg-terms a:hover { color: var(--kelly); }
`;

/* ── Icons ── */
const IconUser  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IconMail  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

/* password strength */
const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  return s; // 0-3
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(formData.password);
  const strengthClass = ['', 'weak', 'medium', 'strong'][strength];

  return (
    <>
      <style>{styles}</style>
      <div className="reg-page">

        {/* ── Left panel (desktop only) ── */}
        <div className="reg-panel">
          <div className="reg-panel-line" /><div className="reg-panel-line" />
          <div className="reg-panel-inner">
            <Link to="/" className="reg-panel-logo">
              <span className="reg-panel-cozy">Cozy</span>
              <span className="reg-panel-casa">Casa</span>
              <span className="reg-panel-leaf">🌿</span>
            </Link>
            <h2 className="reg-panel-heading">
              Your Home Away<br />From <em>Home</em>
            </h2>
            <p className="reg-panel-sub">
              Create your free account and unlock access to Pakistan's finest verified properties.
            </p>
            <div className="reg-panel-perks">
              {[
                ['✦', 'Instant access to 1,200+ verified listings'],
                ['◈', 'Secure, escrow-protected payments'],
                ['◎', 'Dedicated 24/7 guest concierge'],
                ['⬡', 'Flexible booking & free cancellations'],
              ].map(([icon, text]) => (
                <div className="reg-perk" key={text}>
                  <div className="reg-perk-icon">{icon}</div>
                  <p className="reg-perk-text">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form ── */}
        <div className="reg-form-side">
          <div className="reg-card">

            {/* Mobile logo — only visible on small screens, no emoji */}
            <Link to="/" className="reg-mobile-logo">
              <span className="reg-mobile-cozy">Cozy</span>
              <span className="reg-mobile-casa">Casa</span>
            </Link>

            <p className="reg-eyebrow">Get Started</p>
            <h1 className="reg-heading">Create <em>Account</em></h1>
            <p className="reg-sub">Free forever. No credit card required.</p>

            {error && <div className="reg-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="reg-field">
                <label className="reg-field-label">Full Name</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><IconUser /></span>
                  <input type="text" placeholder="Ahmed Khan" value={formData.name}
                    onChange={set('name')} className="reg-input" required />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-field-label">Email Address</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><IconMail /></span>
                  <input type="email" placeholder="you@example.com" value={formData.email}
                    onChange={set('email')} className="reg-input" required />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-field-label">Password</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><IconLock /></span>
                  <input type="password" placeholder="Min. 6 characters" value={formData.password}
                    onChange={set('password')} className="reg-input" required minLength="6" />
                </div>
                {formData.password && (
                  <div className="reg-strength">
                    {[1,2,3].map(i => (
                      <div key={i} className={`reg-strength-bar ${i <= strength ? strengthClass : ''}`} />
                    ))}
                  </div>
                )}
              </div>

              <div className="reg-field">
                <label className="reg-field-label">Phone <span style={{color:'#ccc',fontWeight:300}}>(optional)</span></label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><IconPhone /></span>
                  <input type="tel" placeholder="+92 300 0000000" value={formData.phone}
                    onChange={set('phone')} className="reg-input" />
                </div>
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading
                  ? <><span className="reg-spinner" /> Creating account…</>
                  : 'Create Account'}
              </button>
            </form>

            <p className="reg-terms">
              By registering you agree to our{' '}
              <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link>.
            </p>

            <div className="reg-divider"><span>or</span></div>

            <p className="reg-login">
              Already have an account?{' '}
              <Link to="/login">Sign in instead</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;