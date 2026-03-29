import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

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

  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
  }

  @media (max-width: 768px) {
    .login-page {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
    .login-panel {
      display: none !important;
    }
  }

  /* ── Left decorative panel ── */
  .login-panel {
    background: var(--ink);
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 3rem;
    text-align: center;
  }
  .login-panel::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 30%, rgba(56,142,60,.55) 0%, transparent 65%),
      radial-gradient(ellipse 50% 50% at 20% 90%, rgba(76,175,80,.18) 0%, transparent 60%);
  }
  .login-panel-line {
    position: absolute;
    background: linear-gradient(180deg, transparent, rgba(76,175,80,.3), transparent);
    width: 1px; top: 0; bottom: 0;
  }
  .login-panel-line:nth-child(1) { left: 25%; }
  .login-panel-line:nth-child(2) { left: 75%; }
  .login-panel-inner { position: relative; z-index: 1; }
  .login-panel-logo {
    text-decoration: none;
    display: inline-flex; align-items: center;
    margin-bottom: 3rem;
  }
  .login-panel-cozy {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: var(--kelly-lt);
  }
  .login-panel-casa {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 400; font-style: italic;
    color: rgba(255,255,255,.8);
  }
  .login-panel-leaf { font-size: 1.1rem; margin-left: 5px; margin-bottom: 2px; }
  .login-panel-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 300; color: #fff; line-height: 1.15;
    margin-bottom: 1.25rem;
  }
  .login-panel-heading em { font-style: italic; color: var(--kelly-lt); }
  .login-panel-sub {
    font-size: .82rem; color: rgba(255,255,255,.4);
    line-height: 1.7; max-width: 280px; margin: 0 auto 2.5rem;
  }
  .login-panel-stats {
    display: flex; gap: 2rem; justify-content: center;
  }
  .login-panel-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600; color: var(--kelly-lt);
    line-height: 1;
  }
  .login-panel-stat-label {
    font-size: .6rem; letter-spacing: .15em; text-transform: uppercase;
    color: rgba(255,255,255,.3); margin-top: .3rem;
  }

  /* ── Right form side ── */
  .login-form-side {
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    padding: 3rem 2rem;
  }
  .login-card {
    width: 100%; max-width: 420px;
  }

  /* Mobile logo */
  .login-mobile-logo {
    display: none;
    text-decoration: none;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  .login-mobile-cozy {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 600; color: var(--kelly-dk);
  }
  .login-mobile-casa {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 400; font-style: italic; color: var(--ink);
  }
  .login-mobile-leaf { font-size: .95rem; margin-left: 4px; }
  @media (max-width: 768px) {
    .login-mobile-logo { display: flex; }
  }

  .login-eyebrow {
    font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
    color: var(--kelly); margin-bottom: .75rem;
    display: flex; align-items: center; gap: .5rem;
  }
  .login-eyebrow::before {
    content: ''; display: block;
    width: 1.5rem; height: 1px; background: var(--kelly);
  }
  .login-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem; font-weight: 300; color: var(--ink);
    line-height: 1.1; margin-bottom: .5rem;
  }
  .login-heading em { font-style: italic; color: var(--kelly-dk); }
  .login-sub {
    font-size: .82rem; color: #888; margin-bottom: 2.5rem;
  }

  /* ── Form fields ── */
  .login-field { margin-bottom: 1.1rem; }
  .login-field-label {
    display: block;
    font-size: .6rem; letter-spacing: .15em; text-transform: uppercase;
    color: #999; margin-bottom: .4rem; font-weight: 400;
  }
  .login-input-wrap { position: relative; }
  .login-input-icon {
    position: absolute; left: .9rem; top: 50%; transform: translateY(-50%);
    color: #bbb; font-size: .85rem; pointer-events: none;
    transition: color .2s;
  }
  .login-input {
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
  .login-input::placeholder { color: #ccc; }
  .login-input:focus {
    border-color: var(--kelly);
    box-shadow: 0 0 0 3px rgba(76,175,80,.1);
  }

  /* Password toggle */
  .login-password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #bbb;
    cursor: pointer;
    font-size: .85rem;
    padding: .2rem;
    border-radius: 50%;
    transition: color .2s, opacity .2s;
    pointer-events: auto;
  }
  .login-password-toggle:hover {
    color: var(--kelly);
    opacity: .8;
  }
  .login-field:focus-within .login-password-toggle {
    color: var(--kelly);
  }
  .login-field:focus-within .login-input-icon { color: var(--kelly); }
  .login-field:focus-within .login-field-label { color: var(--kelly-dk); }

  /* ── Submit ── */
  .login-btn {
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
  .login-btn:hover:not(:disabled) {
    background: var(--kelly);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(56,142,60,.3);
  }
  .login-btn:disabled { opacity: .65; cursor: not-allowed; }

  .login-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .login-divider {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.75rem 0;
  }
  .login-divider::before,
  .login-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--mist);
  }
  .login-divider span {
    font-size: .62rem; letter-spacing: .12em; text-transform: uppercase;
    color: #ccc;
  }

  /* ── Register link ── */
  .login-register {
    text-align: center;
    font-size: .8rem; color: #999;
  }
  .login-register a {
    color: var(--kelly-dk); font-weight: 500; text-decoration: none;
    border-bottom: 1px solid rgba(56,142,60,.3);
    padding-bottom: 1px;
    transition: color .2s, border-color .2s;
  }
  .login-register a:hover {
    color: var(--kelly);
    border-color: var(--kelly);
  }

  /* ── Error banner ── */
  .login-error {
    background: rgba(231,76,60,.07);
    border: 1px solid rgba(231,76,60,.2);
    color: #c0392b;
    font-size: .78rem; padding: .7rem 1rem;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: .5rem;
  }
`;

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeSlash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 10.41 5a3.94 3.94 0 0 0 1.18.59 2 2 0 1 1 0 4 2 2 0 0 0-1.18.59L2 19l1.59-1.59A2 2 0 1 1 5 17.41a3.94 3.94 0 0 0-.59-1.18L19 5 17.41 3.41 13 8a2 2 0 1 1-.59-1.18 2 2 0 0 0-.59 1.18l-1.18-.59z"/>
  </svg>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'newpass'
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const { login }               = useAuth();
  const navigate                = useNavigate();

  // Forgot password handlers
  const handleForgotToggle = (e) => {
    e.preventDefault();
    setShowForgot(!showForgot);
    setForgotError('');
    if (!showForgot) {
      setForgotEmail(formData.email); // Prefill with login email if available
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      await API.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStep('otp');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      await API.post('/auth/verify-otp', { email: forgotEmail, otp });
      setForgotStep('newpass');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      const res = await API.post('/auth/reset-password', { 
        email: forgotEmail, 
        otp, 
        password: newPassword 
      });
      // Auto login after reset
      localStorage.setItem('token', res.token);
      navigate(res.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Reset failed');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    setShowForgot(false);
    setForgotStep('email');
    setForgotError('');
  };

  const handleForgotEmailChange = (e) => setForgotEmail(e.target.value);

  const handleOtpChange = (e) => setOtp(e.target.value.replace(/\\D/g, '')); // Numbers only

  const handleNewPassChange = (e) => setNewPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(formData);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      setError('Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">

        {/* ── Left panel (desktop only) ── */}
        <div className="login-panel">
          <div className="login-panel-line" />
          <div className="login-panel-line" />
          <div className="login-panel-inner">
            <Link to="/" className="login-panel-logo">
              <span className="login-panel-cozy">Cozy</span>
              <span className="login-panel-casa">Casa</span>
              <span className="login-panel-leaf">🌿</span>
            </Link>
            <h2 className="login-panel-heading">
              Premium Stays,<br /><em>Effortlessly</em> Booked
            </h2>
            <p className="login-panel-sub">
              Join thousands of guests who trust CozyCasa for verified, beautiful properties across Pakistan.
            </p>
            <div className="login-panel-stats">
              {[['1,200+', 'Properties'], ['4.9★', 'Rating'], ['8,400+', 'Bookings']].map(([n, l]) => (
                <div className="login-panel-stat" key={l}>
                  <div className="login-panel-stat-num">{n}</div>
                  <div className="login-panel-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form ── */}
        <div className="login-form-side">
          <div className="login-card">

            {/* Mobile logo — only visible on small screens */}
            <Link to="/" className="login-mobile-logo">
              <span className="login-mobile-cozy">Cozy</span>
              <span className="login-mobile-casa">Casa</span>
            </Link>

            <p className="login-eyebrow">Welcome Back</p>
            <h1 className="login-heading">Sign <em>In</em></h1>
            <p className="login-sub">Enter your credentials to access your account.</p>

            {error && (
              <div className="login-error">⚠ {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-field-label">Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><IconMail /></span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={set('email')}
                    className="login-input"
                    required
                  />
                </div>
              </div>

                <div className="login-field">
                <label className="login-field-label">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><IconLock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={set('password')}
                    className="login-input"
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IconEyeSlash /> : <IconEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <><span className="login-spinner" /> Signing in…</> : 'Sign In'}
              </button>
            </form>

            {!showForgot ? (
              <p className="login-forgot" style={{textAlign: 'center', marginTop: '1rem', fontSize: '.82rem', color: '#999'}}>
                <button onClick={handleForgotToggle} style={{color: 'var(--kelly-dk)', cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid rgba(56,142,60,.3)', paddingBottom: '1px', background: 'none', border: 'none', font: 'inherit'}}>
                  Forgot Password?
                </button>
              </p>
            ) : null}

            <div className="login-divider"><span>or</span></div>

{showForgot ? (
              <>
                <h3 style={{fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: '300', color: 'var(--ink)', marginBottom: '.5rem', marginTop: '1rem'}}>
                  Reset Password
                </h3>
                {forgotError && (
                  <div className="login-error" style={{marginBottom: '1rem'}}>⚠ {forgotError}</div>
                )}
                {forgotStep === 'email' && (
                  <form onSubmit={handleSendOTP}>
                    <div className="login-field">
                      <label className="login-field-label">Email Address</label>
                      <div className="login-input-wrap">
                        <span className="login-input-icon"><IconMail /></span>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={forgotEmail}
                          onChange={handleForgotEmailChange}
                          className="login-input"
                          required
                        />
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button type="button" className="login-btn" style={{flex: 1, background: 'var(--mist)' , color: 'var(--ink)'}} onClick={handleBackToLogin}>
                        Back
                      </button>
                      <button type="submit" className="login-btn" disabled={forgotLoading} style={{flex: 1}}>
                        {forgotLoading ? <><span className="login-spinner" /> Sending...</> : 'Send OTP'}
                      </button>
                    </div>
                  </form>
                )}
                {forgotStep === 'otp' && (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="login-field">
                      <label className="login-field-label">Enter OTP</label>
                      <div className="login-input-wrap">
                        <span className="login-input-icon">🔑</span>
                        <input
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={handleOtpChange}
                          maxLength="6"
                          className="login-input"
                          required
                        />
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button type="button" className="login-btn" style={{flex: 1, background: 'var(--mist)', color: 'var(--ink)'}} onClick={handleBackToLogin}>
                        Back
                      </button>
                      <button type="submit" className="login-btn" disabled={forgotLoading} style={{flex: 1}}>
                        {forgotLoading ? <><span className="login-spinner" /> Verifying...</> : 'Verify OTP'}
                      </button>
                    </div>
                  </form>
                )}
                {forgotStep === 'newpass' && (
                  <form onSubmit={handleResetPassword}>
                    <div className="login-field">
                      <label className="login-field-label">New Password</label>
                      <div className="login-input-wrap">
                        <span className="login-input-icon"><IconLock /></span>
                        <input
                          type="password"
                          placeholder="New secure password"
                          value={newPassword}
                          onChange={handleNewPassChange}
                          className="login-input"
                          required
                          minLength="6"
                        />
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '1rem'}}>
                      <button type="button" className="login-btn" style={{flex: 1, background: 'var(--mist)', color: 'var(--ink)'}} onClick={handleBackToLogin}>
                        Back
                      </button>
                      <button type="submit" className="login-btn" disabled={forgotLoading} style={{flex: 1}}>
                        {forgotLoading ? <><span className="login-spinner" /> Resetting...</> : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <p className="login-register">
                Don't have an account?{' '}
                <Link to="/register">Create one free</Link>
              </p>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;