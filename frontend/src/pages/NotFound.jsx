import React from 'react';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:      #0a1f0b;
    --cream:    #f7faf7;
    --mist:     #e4ede4;
    --kelly:    #4caf50;
    --kelly-dk: #388e3c;
    --kelly-lt: #81c784;
  }

  .nf-page {
    min-height: 100vh;
    background: var(--ink);
    display: grid;
    place-items: center;
    padding: 2rem;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Background glows */
  .nf-page::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 50% 100%, rgba(56,142,60,.4) 0%, transparent 60%),
      radial-gradient(ellipse 30% 30% at 10% 15%,  rgba(76,175,80,.1) 0%, transparent 55%),
      radial-gradient(ellipse 25% 25% at 90% 20%,  rgba(76,175,80,.08) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Vertical accent lines */
  .nf-line {
    position: absolute; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg, transparent, rgba(76,175,80,.25), transparent);
  }
  .nf-line:nth-child(1) { left: 15%; }
  .nf-line:nth-child(2) { left: 50%; }
  .nf-line:nth-child(3) { left: 85%; }

  /* ── Card ── */
  .nf-inner {
    position: relative; z-index: 1;
    text-align: center;
    max-width: 480px; width: 100%;
  }

  /* Logo */
  .nf-logo {
    text-decoration: none;
    display: inline-flex; align-items: center;
    margin-bottom: 3.5rem;
    opacity: .7;
    transition: opacity .2s;
  }
  .nf-logo:hover { opacity: 1; }
  .nf-logo-cozy {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: var(--kelly-lt);
  }
  .nf-logo-casa {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 400; font-style: italic;
    color: rgba(255,255,255,.65);
  }
  .nf-logo-leaf {
    font-size: .85rem; margin-left: 4px;
    display: inline-block;
    transition: transform .35s cubic-bezier(.23,1,.32,1);
  }
  .nf-logo:hover .nf-logo-leaf { transform: rotate(20deg); }

  /* 404 number */
  .nf-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(7rem, 20vw, 12rem);
    font-weight: 600;
    line-height: .9;
    margin-bottom: 1.5rem;
    /* Kelly green gradient with a glow */
    background: linear-gradient(135deg, var(--kelly-lt) 0%, var(--kelly) 50%, var(--kelly-dk) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 40px rgba(76,175,80,.3));
  }

  /* Eyebrow */
  .nf-eyebrow {
    display: inline-flex; align-items: center; gap: .65rem;
    font-size: .62rem; letter-spacing: .22em; text-transform: uppercase;
    color: var(--kelly); margin-bottom: 1rem;
  }
  .nf-eyebrow::before, .nf-eyebrow::after {
    content: ''; display: block;
    width: 1.5rem; height: 1px; background: var(--kelly);
  }

  /* Heading */
  .nf-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 300; color: #fff;
    line-height: 1.2; margin-bottom: .9rem;
  }
  .nf-heading em { font-style: italic; color: var(--kelly-lt); }

  .nf-sub {
    font-size: .85rem; color: rgba(255,255,255,.4);
    line-height: 1.7; max-width: 320px;
    margin: 0 auto 2.5rem;
  }

  /* Buttons */
  .nf-actions {
    display: flex; align-items: center; justify-content: center;
    gap: .85rem; flex-wrap: wrap;
  }
  .nf-btn-primary {
    display: inline-block;
    padding: .75rem 2rem;
    background: var(--kelly-dk);
    color: #fff; text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 500;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .nf-btn-primary:hover {
    background: var(--kelly);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(56,142,60,.35);
  }
  .nf-btn-ghost {
    display: inline-block;
    padding: .75rem 2rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,.18);
    color: rgba(255,255,255,.6); text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 400;
    transition: border-color .2s, color .2s;
  }
  .nf-btn-ghost:hover {
    border-color: var(--kelly-lt);
    color: var(--kelly-lt);
  }

  /* Bottom hint */
  .nf-hint {
    margin-top: 3rem;
    font-size: .68rem; color: rgba(255,255,255,.18);
    letter-spacing: .05em;
  }
  .nf-hint a {
    color: rgba(76,175,80,.5); text-decoration: none;
    transition: color .2s;
  }
  .nf-hint a:hover { color: var(--kelly); }
`;

const NotFound = () => (
  <>
    <style>{styles}</style>
    <div className="nf-page">
      <div className="nf-line" /><div className="nf-line" /><div className="nf-line" />

      <div className="nf-inner">

        <Link to="/" className="nf-logo">
          <span className="nf-logo-cozy">Cozy</span>
          <span className="nf-logo-casa">Casa</span>
          <span className="nf-logo-leaf">🌿</span>
        </Link>

        <div className="nf-number">404</div>

        <p className="nf-eyebrow">Lost Your Way?</p>
        <h1 className="nf-heading">Page <em>Not Found</em></h1>
        <p className="nf-sub">
          The page you're looking for has moved, been removed, or never existed. Let's get you back somewhere familiar.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">← Back to Home</Link>
          <Link to="/properties" className="nf-btn-ghost">Browse Properties</Link>
        </div>

        <p className="nf-hint">
          Need help? <a href="mailto:hello@cozycasa.com">hello@cozycasa.com</a>
        </p>

      </div>
    </div>
  </>
);

export default NotFound;