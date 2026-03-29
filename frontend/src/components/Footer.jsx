import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiArrowRight } from 'react-icons/fi';

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  /* ── FOOTER ROOT ─────────────────────────────────── */
  .footer {
    font-family: 'DM Sans', sans-serif;
    background:
      radial-gradient(ellipse 55% 70% at 90% 20%, rgba(76,187,23,0.13) 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 10% 80%, rgba(58,153,18,0.09) 0%, transparent 60%),
      linear-gradient(170deg, #0d1a08 0%, #1a3310 55%, #0f2209 100%);
    color: rgba(255,255,255,0.75);
    padding-top: 80px;
    position: relative;
    overflow: hidden;
  }

  /* Dot-grid texture */
  .footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(76,187,23,0.10) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .footer .container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 28px;
    position: relative;
    z-index: 1;
  }

  /* ── GRID ────────────────────────────────────────── */
  .footer-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.5fr;
    gap: 48px 40px;
    padding-bottom: 64px;
    border-bottom: 1px solid rgba(76,187,23,0.15);
  }

  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 540px) {
    .footer-grid { grid-template-columns: 1fr; gap: 36px; }
  }

  /* ── BRAND ───────────────────────────────────────── */
  .footer-logo {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    text-decoration: none;
    margin-bottom: 18px;
  }

  .footer-brand-cozy {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .footer-brand-casa {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: 1.6rem;
    color: #72d142;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .footer-tagline {
    font-size: 0.875rem;
    line-height: 1.7;
    color: rgba(255,255,255,0.45);
    margin: 0 0 28px;
    max-width: 300px;
    font-weight: 300;
  }

  /* Social icons */
  .footer-socials {
    display: flex;
    gap: 10px;
  }

  .footer-social-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: 1px solid rgba(76,187,23,0.22);
    background: rgba(76,187,23,0.06);
    color: rgba(255,255,255,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
    padding: 9px;
    box-sizing: border-box;
  }

  .footer-social-icon:hover {
    background: #4CBB17;
    border-color: #4CBB17;
    color: #ffffff;
    transform: translateY(-2px);
  }

  /* ── COLUMNS ─────────────────────────────────────── */
  .footer-col-title {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #72d142;
    margin: 0 0 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(76,187,23,0.18);
  }

  .footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-link {
    text-decoration: none;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.50);
    font-weight: 400;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s, gap 0.2s;
  }

  .footer-link::before {
    content: '';
    width: 0;
    height: 1px;
    background: #4CBB17;
    transition: width 0.2s;
    flex-shrink: 0;
  }

  .footer-link:hover {
    color: #72d142;
    gap: 10px;
  }

  .footer-link:hover::before { width: 12px; }

  /* ── CONTACT ─────────────────────────────────────── */
  .footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
  }

  .footer-contact-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(76,187,23,0.1);
    border: 1px solid rgba(76,187,23,0.2);
    color: #4CBB17;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    padding: 8px;
    box-sizing: border-box;
  }

  .footer-contact-label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.30);
    margin: 0 0 3px;
  }

  .footer-contact-value {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.72);
    margin: 0;
    font-weight: 400;
  }

  /* ── NEWSLETTER ──────────────────────────────────── */
  .footer-newsletter {
    margin-top: 4px;
  }

  .footer-newsletter-row {
    display: flex;
    margin-top: 10px;
    border-radius: 9px;
    overflow: hidden;
    border: 1px solid rgba(76,187,23,0.25);
    background: rgba(255,255,255,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .footer-newsletter-row:focus-within {
    border-color: #4CBB17;
    box-shadow: 0 0 0 3px rgba(76,187,23,0.15);
  }

  .footer-newsletter-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    color: #ffffff;
    min-width: 0;
  }

  .footer-newsletter-input::placeholder { color: rgba(255,255,255,0.28); }

  .footer-newsletter-btn {
    padding: 10px 16px;
    background: #4CBB17;
    color: #ffffff;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.03em;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .footer-newsletter-btn:hover { background: #3a9912; }

  /* ── BOTTOM BAR ──────────────────────────────────── */
  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    gap: 16px;
    flex-wrap: wrap;
  }

  .footer-bottom p {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.28);
    margin: 0;
  }

  .footer-bottom p span {
    color: #4CBB17;
  }

  .footer-bottom-links {
    display: flex;
    gap: 20px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.30);
  }

  .footer-bottom-links span {
    cursor: pointer;
    transition: color 0.2s;
  }

  .footer-bottom-links span:hover { color: #72d142; }
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Inject styles once
  if (typeof document !== 'undefined' && !document.getElementById('footer-kelly-styles')) {
    const tag = document.createElement('style');
    tag.id = 'footer-kelly-styles';
    tag.textContent = footerStyles;
    document.head.appendChild(tag);
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-brand-cozy">Cozy</span>
              <span className="footer-brand-casa">Casa</span>
            </Link>
            <p className="footer-tagline">
              Discover your dream home with CozyCasa. We provide premium real estate listings and seamless room booking experiences.
            </p>
            <div className="footer-socials">
              <FiFacebook className="footer-social-icon" />
              <FiInstagram className="footer-social-icon" />
              <FiTwitter className="footer-social-icon" />
              <FiLinkedin className="footer-social-icon" />
            </div>
          </div>

          {/* Navigate */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigate</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/properties" className="footer-link">Properties</Link></li>
              <li><Link to="/login" className="footer-link">Log In</Link></li>
              <li><Link to="/register" className="footer-link">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">FAQs</Link></li>
              <li><Link to="/" className="footer-link">Contact Us</Link></li>
              <li><Link to="/" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get In Touch</h4>

            <div className="footer-contact-item">
              <FiPhone className="footer-contact-icon" />
              <div>
                <p className="footer-contact-label">Call Us</p>
                <p className="footer-contact-value">+92 347 1091917</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <FiMail className="footer-contact-icon" />
              <div>
                <p className="footer-contact-label">Email Us</p>
                <p className="footer-contact-value">hello@cozycasa.com</p>
              </div>
            </div>

            <div className="footer-newsletter">
              <p className="footer-contact-label">Newsletter</p>
              <form onSubmit={handleSubscribe} className="footer-newsletter-row">
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="footer-newsletter-btn">
                  {subscribed ? '✓ Joined' : <><FiArrowRight /></>}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© 2026 CozyCasa — Built with <span>♡</span> for Premium Living.</p>
          <div className="footer-bottom-links">
            <span>English (US)</span>
            <span>Rs. PKR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;