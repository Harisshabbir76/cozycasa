import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX, FiHome, FiGrid, FiMail, FiLogIn, FiArrowRight } from 'react-icons/fi';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --kelly: #4CBB17;
    --kelly-dark: #3a9912;
    --kelly-light: #6fd43a;
    --kelly-muted: rgba(76, 187, 23, 0.12);
    --kelly-glow: rgba(76, 187, 23, 0.35);
    --ink: #0f1a0a;
    --ink-soft: #2b3d22;
    --cream: #f8faf5;
    --white: #ffffff;
    --border: rgba(76, 187, 23, 0.2);
    --shadow-sm: 0 2px 8px rgba(15, 26, 10, 0.08);
    --shadow-md: 0 4px 24px rgba(15, 26, 10, 0.14);
  }

  /* ── ROOT ───────────────────────────────── */
  .nav-root {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease;
  }

  .nav-solid {
    background: rgba(38, 110, 10, 0.97);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: 0 4px 24px rgba(15, 26, 10, 0.30);
    border-bottom: 1px solid rgba(76, 187, 23, 0.30);
  }

  /* ── INNER LAYOUT ───────────────────────── */
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 28px;
  }

  /* ── LOGO ───────────────────────────────── */
  .nav-logo {
    text-decoration: none;
    display: flex;
    align-items: baseline;
    gap: 1px;
    letter-spacing: -0.5px;
    line-height: 1;
    flex-shrink: 0;
  }

  .nav-logo-cozy {
    font-family: 'DM Serif Display', serif;
    font-size: 1.45rem;
    color: var(--white);
    transition: color 0.2s;
  }

  .nav-logo-casa {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 1.45rem;
    color: var(--kelly-light);
    transition: color 0.2s;
  }

  .nav-logo:hover .nav-logo-cozy { color: rgba(255,255,255,0.75); }
  .nav-logo:hover .nav-logo-casa { color: var(--white); }

  /* ── DESKTOP LINKS ──────────────────────── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nav-link {
    position: relative;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255,255,255,0.80);
    padding: 6px 14px;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.01em;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 14px;
    right: 14px;
    height: 2px;
    background: var(--kelly-light);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-link:hover {
    color: var(--white);
    background: rgba(255,255,255,0.10);
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    transform: scaleX(1);
  }

  .nav-link.active {
    color: var(--white);
    font-weight: 600;
  }

  /* ── AUTH AREA ──────────────────────────── */
  .nav-auth {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--kelly);
    color: var(--white);
    font-size: 0.78rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--kelly);
    transition: box-shadow 0.2s;
    letter-spacing: 0.04em;
  }

  .nav-logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(255,255,255,0.70);
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }

  .nav-logout:hover {
    background: rgba(220, 38, 38, 0.18);
    color: #fca5a5;
    transform: scale(1.08);
  }

  .btn-signin {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 20px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.02em;
    background: var(--white);
    color: var(--kelly-dark);
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.20);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }

  .btn-signin:hover {
    background: var(--kelly-light);
    color: var(--white);
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    transform: translateY(-1px);
  }

  /* ── MOBILE HAMBURGER ───────────────────── */
  .mobile-menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: rgba(255,255,255,0.10);
    border-radius: 8px;
    color: var(--white);
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
    /* critical: ensure it is always on top and tappable */
    position: relative;
    z-index: 1001;
  }

  .mobile-menu-btn:hover { background: rgba(255,255,255,0.18); }

  /* ── SIDEBAR OVERLAY ────────────────────── */
  .nb-sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 2000;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: nb-fadeIn 0.25s ease;
  }

  @keyframes nb-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── SIDEBAR PANEL ──────────────────────── */
  .nb-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100dvh;
    background: linear-gradient(160deg, #1a3310 0%, #0f2209 100%);
    box-shadow: -4px 0 32px rgba(0,0,0,0.40);
    z-index: 2001;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    animation: nb-slideIn 0.28s cubic-bezier(0.4,0,0.2,1);
    border-left: 1px solid rgba(76,187,23,0.3);
    overflow-y: auto;
  }

  @keyframes nb-slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .nb-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(76,187,23,0.25);
    flex-shrink: 0;
  }

  .nb-sidebar-logo {
    text-decoration: none;
    display: flex;
    align-items: baseline;
    gap: 1px;
  }

  .nb-sidebar-logo-cozy {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: var(--white);
  }

  .nb-sidebar-logo-casa {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 1.3rem;
    color: var(--kelly-light);
  }

  .nb-sidebar-close {
    background: rgba(255,255,255,0.08);
    border: none;
    color: rgba(255,255,255,0.8);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .nb-sidebar-close:hover {
    background: rgba(255,255,255,0.15);
    color: var(--white);
  }

  .nb-sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .nb-sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    text-decoration: none;
    background: transparent;
    color: rgba(255,255,255,0.80);
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    width: 100%;
    cursor: pointer;
    text-align: left;
  }

  .nb-sidebar-link:hover {
    background: rgba(76,187,23,0.20);
    color: var(--white);
    transform: translateX(4px);
  }

  .nb-sidebar-link.active {
    background: var(--kelly);
    color: var(--white);
    box-shadow: 0 2px 8px rgba(76,187,23,0.3);
  }

  .nb-sidebar-link svg { font-size: 1.1rem; flex-shrink: 0; }

  .nb-sidebar-divider {
    height: 1px;
    background: rgba(76,187,23,0.2);
    margin: 12px 0;
    flex-shrink: 0;
  }

  .nb-sidebar-user {
    padding: 16px;
    background: rgba(76,187,23,0.10);
    border-radius: 12px;
    border: 1px solid rgba(76,187,23,0.20);
    flex-shrink: 0;
  }

  .nb-sidebar-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .nb-sidebar-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--kelly);
    color: var(--white);
    font-size: 0.9rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--kelly);
    flex-shrink: 0;
  }

  .nb-sidebar-user-name {
    font-weight: 600;
    color: var(--white);
    font-size: 0.9rem;
  }

  .nb-sidebar-user-email {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.65);
    margin-top: 2px;
    word-break: break-all;
  }

  .nb-sidebar-logout {
    width: 100%;
    padding: 10px;
    background: rgba(220,38,38,0.18);
    border: 1px solid rgba(220,38,38,0.30);
    border-radius: 8px;
    color: #fca5a5;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nb-sidebar-logout:hover {
    background: rgba(220,38,38,0.30);
    transform: translateY(-1px);
  }

  .nb-sidebar-login-btn {
    width: 100%;
    padding: 13px;
    background: var(--white);
    border: none;
    border-radius: 10px;
    color: var(--kelly-dark);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .nb-sidebar-login-btn:hover {
    background: var(--kelly-light);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(76,187,23,0.3);
  }

  /* ── RESPONSIVE ─────────────────────────── */
  @media (max-width: 768px) {
    .nav-links       { display: none !important; }
    .mobile-menu-btn { display: flex !important; }
    .nav-inner       { padding: 0 16px; }

    /* hide desktop auth avatar+logout on mobile, keep only hamburger */
    .nav-user,
    .btn-signin { display: none !important; }
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  /* Inject styles once */
  useEffect(() => {
    const id = 'navbar-kelly-v2-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = styles;
      document.head.appendChild(tag);
    }
  }, []);

  /* Close sidebar on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Lock body scroll when sidebar open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="nav-root nav-solid">
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span className="nav-logo-cozy">Cozy</span>
            <span className="nav-logo-casa">Casa</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>Properties</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </div>

          {/* Desktop auth */}
          <div className="nav-auth">
            {isAuthenticated ? (
              <div className="nav-user">
                <div className="nav-avatar" title={user?.name}>{getInitials(user?.name)}</div>
                <button className="nav-logout" onClick={handleLogout} title="Logout">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-signin">Sign In</Link>
            )}

            {/* Hamburger — always visible on mobile */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile sidebar ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="nb-sidebar-overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="nb-sidebar" role="dialog" aria-modal="true" aria-label="Navigation menu">

            <div className="nb-sidebar-header">
              <Link to="/" className="nb-sidebar-logo" onClick={() => setMenuOpen(false)}>
                <span className="nb-sidebar-logo-cozy">Cozy</span>
                <span className="nb-sidebar-logo-casa">Casa</span>
              </Link>
              <button className="nb-sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <FiX />
              </button>
            </div>

            <div className="nb-sidebar-nav">
              <button className={`nb-sidebar-link ${isActive('/') ? 'active' : ''}`} onClick={() => go('/')}>
                <FiHome /><span>Home</span>
              </button>
              <button className={`nb-sidebar-link ${isActive('/properties') ? 'active' : ''}`} onClick={() => go('/properties')}>
                <FiGrid /><span>Properties</span>
              </button>
              <button className={`nb-sidebar-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => go('/contact')}>
                <FiMail /><span>Contact</span>
              </button>

              <div className="nb-sidebar-divider" />

              {isAuthenticated ? (
                <div className="nb-sidebar-user">
                  <div className="nb-sidebar-user-info">
                    <div className="nb-sidebar-avatar">{getInitials(user?.name)}</div>
                    <div>
                      <div className="nb-sidebar-user-name">{user?.name}</div>
                      <div className="nb-sidebar-user-email">{user?.email}</div>
                    </div>
                  </div>
                  <button className="nb-sidebar-logout" onClick={handleLogout}>
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              ) : (
                <button className="nb-sidebar-login-btn" onClick={() => go('/login')}>
                  <FiLogIn /> Sign In <FiArrowRight />
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default Navbar;