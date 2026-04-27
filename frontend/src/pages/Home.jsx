import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { guestAPI } from '../utils/api';
import { slugify } from '../utils/slugify';
import PropertyCard from '../components/PropertyCard';
import FAQs from '../components/FAQs';
import { FiSearch, FiHome, FiMapPin, FiBriefcase, FiAperture, FiArrowRight, FiGrid, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const homeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --kelly:       #4CBB17;
    --kelly-dark:  #3a9912;
    --kelly-deep:  #276b0c;
    --kelly-light: #72d142;
    --kelly-muted: rgba(76, 187, 23, 0.10);
    --kelly-glow:  rgba(76, 187, 23, 0.30);
    --ink:         #0d1a08;
    --ink-soft:    #2e4020;
    --mist:        #f3f8ee;
    --white:       #ffffff;
    --border:      rgba(76, 187, 23, 0.18);
    --font-display: 'DM Serif Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  .home-page { font-family: var(--font-body); color: var(--ink); }

  /* ── HERO ──────────────────────────────────────────── */
  .hero {
    position: relative;
    min-height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 60% at 60% 40%, rgba(76,187,23,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(58,153,18,0.12) 0%, transparent 60%),
      linear-gradient(160deg, #0d1a08 0%, #1a3310 40%, #0f2209 100%);
  }

  /* Dot grid overlay */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(76,187,23,0.18) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  /* Glowing orb */
  .hero::after {
    content: '';
    position: absolute;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(76,187,23,0.22) 0%, transparent 70%);
    top: 10%;
    right: 8%;
    pointer-events: none;
    animation: orb-pulse 6s ease-in-out infinite;
  }

  @keyframes orb-pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50%       { transform: scale(1.12); opacity: 1; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 760px;
    padding: 0 24px;
    width: 100%;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--kelly-light);
    margin-bottom: 24px;
    padding: 6px 16px;
    border: 1px solid rgba(76,187,23,0.35);
    border-radius: 100px;
    background: rgba(76,187,23,0.08);
  }

  .hero-eyebrow::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--kelly);
    box-shadow: 0 0 8px var(--kelly);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 6vw, 4.2rem);
    color: var(--white);
    line-height: 1.08;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }

  .hero-title em {
    font-style: italic;
    color: var(--kelly-light);
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.62);
    font-weight: 300;
    margin: 0 0 48px;
    line-height: 1.6;
  }

  /* ── SEARCH BOX ────────────────────────────────────── */
  .search-box {
    display: flex;
    align-items: flex-end;
    gap: 0;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(18px);
    border: 1px solid rgba(76,187,23,0.25);
    border-radius: 16px;
    padding: 8px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }

  .search-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 160px;
    padding: 8px 16px;
    border-right: 1px solid rgba(76,187,23,0.15);
  }

  .search-input-group:last-of-type { border-right: none; }

  .search-label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--kelly-light);
    text-align: left;
  }

  .search-field {
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--white);
    padding: 4px 0;
    width: 100%;
    text-align: left;
  }

  .search-field::placeholder { color: rgba(255,255,255,0.35); }

  .search-field option { background: #1a3310; color: var(--white); }

  .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 10px;
    border: none;
    background: var(--kelly);
    color: var(--white);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 4px 18px var(--kelly-glow);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  .search-button:hover {
    background: var(--kelly-dark);
    box-shadow: 0 6px 24px rgba(76,187,23,0.5);
    transform: translateY(-1px);
  }

  /* ── SECTIONS SHARED ───────────────────────────────── */
  .section-title-wrap {
    text-align: center;
    margin-bottom: 56px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .section-subtitle {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--kelly-dark);
    margin-bottom: 10px;
    padding: 4px 14px;
    background: var(--kelly-muted);
    border-radius: 100px;
    border: 1px solid var(--border);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    color: var(--ink);
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.1;
    text-align: center; /* Added to center the title */
  }

  /* ── FEATURED ──────────────────────────────────────── */
  .featured-section {
    padding: 100px 24px;
    max-width: 1240px;
    margin: 0 auto;
  }

  .property-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  /* Shopify-style property card overrides */
  .property-grid > * {
    min-width: 0; /* Prevents overflow */
  }

  /* Mobile compact Shopify cards */
  @media (max-width: 768px) {
    .property-grid .property-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .property-grid .property-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .property-grid .card-image-container {
      height: 160px !important;
    }

    .property-grid .card-content {
      padding: 12px !important;
    }

    .property-grid .card-badge {
      top: 12px !important;
      right: 12px !important;
      padding: 4px 10px !important;
      font-size: 0.75rem !important;
      border-radius: 16px !important;
    }
  }

  @media (max-width: 480px) {
    .property-grid .card-image-container {
      height: 140px !important;
    }

    .property-grid .card-content {
      padding: 10px !important;
    }
  }

  /* ── PAGINATION ────────────────────────────────────── */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 48px;
    flex-wrap: wrap;
  }

  .pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-button:hover:not(:disabled) {
    background: var(--kelly);
    color: var(--white);
    border-color: var(--kelly);
    transform: translateY(-1px);
  }

  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-numbers {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .page-number {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 8px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-number:hover {
    background: var(--kelly-muted);
    border-color: var(--kelly);
  }

  .page-number.active {
    background: var(--kelly);
    color: var(--white);
    border-color: var(--kelly);
  }

  /* ── PROPERTY TYPES SECTION ────────────────────────── */
  .property-types-section {
    padding: 80px 24px;
    max-width: 1240px;
    margin: 0 auto 60px auto;
    background: linear-gradient(135deg, rgba(76,187,23,0.03) 0%, rgba(76,187,23,0.08) 100%);
    border-radius: 40px;
  }

  .property-types-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  .property-type-card {
    position: relative;
    height: 280px;
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid rgba(76,187,23,0.2);
  }

  .property-type-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(13,26,8,0.75) 0%, rgba(13,26,8,0.45) 100%);
    z-index: 1;
  }

  .property-type-card.no-image {
    background: linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%);
  }

  .property-type-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    border-color: var(--kelly);
  }

  .property-type-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(13,26,8,0.95) 0%, rgba(13,26,8,0.6) 50%, rgba(13,26,8,0.2) 100%);
    z-index: 1;
  }

  .property-type-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 28px;
    z-index: 2;
  }

  .property-type-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: var(--kelly);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 1.4rem;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px var(--kelly-glow);
  }

  .property-type-name {
    font-family: var(--font-display);
    font-size: 1.6rem;
    color: var(--white);
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }

  .property-type-count {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    margin: 0;
    letter-spacing: 0.05em;
    font-weight: 500;
  }

  .property-type-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(76,187,23,0.95);
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--white);
    z-index: 2;
    backdrop-filter: blur(4px);
    letter-spacing: 0.5px;
  }

  /* ── EXPLORE BUTTON ────────────────────────────────── */
  .btn.btn-primary.btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.03em;
    color: var(--kelly-dark);
    background: transparent;
    border: 2px solid var(--kelly);
    transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 0 0 0 var(--kelly-glow);
  }

  .btn.btn-primary.btn-outline:hover {
    background: var(--kelly);
    color: var(--white);
    box-shadow: 0 4px 18px var(--kelly-glow);
    transform: translateY(-1px);
  }

  /* ── CTA BANNER ────────────────────────────────────── */
  .home-cta {
    background:
      radial-gradient(ellipse 60% 80% at 80% 50%, rgba(76,187,23,0.22) 0%, transparent 65%),
      linear-gradient(135deg, #0d1a08 0%, #1c3e10 60%, #0f2209 100%);
    padding: 110px 24px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-top: 60px;
  }

  .home-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(76,187,23,0.12) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .home-cta-inner { position: relative; z-index: 1; }

  .home-cta h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--white);
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }

  .home-cta h2 em {
    font-style: italic;
    color: var(--kelly-light);
  }

  .home-cta p {
    color: rgba(255,255,255,0.55);
    font-size: 1.05rem;
    margin: 0 0 44px;
    font-weight: 300;
  }

  .home-cta .btn-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    border-radius: 10px;
    background: var(--kelly);
    color: var(--white);
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.03em;
    box-shadow: 0 4px 20px var(--kelly-glow);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }

  .home-cta .btn-cta:hover {
    background: var(--kelly-dark);
    box-shadow: 0 8px 32px rgba(76,187,23,0.5);
    transform: translateY(-2px);
  }

  /* ── LOADING ───────────────────────────────────────── */
  .loading-state {
    text-align: center;
    padding: 60px;
    color: var(--kelly-dark);
    font-weight: 500;
    letter-spacing: 0.03em;
  }

  .loading-dot {
    display: inline-block;
    animation: bounce 1.2s ease-in-out infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%            { transform: translateY(-8px); }
  }

  /* No Results Message */
  .no-results-message {
    text-align: center;
    padding: 60px 20px;
    color: var(--ink-soft);
  }

  .no-results-message h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .no-results-message p {
    color: var(--ink-soft);
    opacity: 0.7;
  }

  /* Responsive Styles - Shopify-style compact cards */
  
  /* Tablet (2 columns) */
  @media (max-width: 1024px) {
    .property-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .property-types-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }
  
  /* Mobile - Strict 3 columns Shopify grid for property cards */
  @media (max-width: 768px) {
    .property-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 10px !important;
      padding: 0 6px !important;
    }
    
    .property-types-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    
    .featured-section {
      padding: 40px 12px;
    }
    
    .property-types-section {
      padding: 40px 12px;
      margin: 0 auto 40px auto;
    }
    
    .section-title-wrap {
      margin-bottom: 28px;
    }
    
    .section-title {
      font-size: 1.6rem;
    }
    
    /* Property Type Card - Match property card style on mobile */
    .property-type-card {
      height: auto;
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .property-type-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .property-type-content {
      padding: 12px;
    }
    
    .property-type-icon {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
      margin-bottom: 8px;
      border-radius: 8px;
    }
    
    .property-type-name {
      font-size: 0.75rem;
      margin: 0 0 2px;
      line-height: 1.2;
      font-weight: 600;
    }
    
    .property-type-count {
      font-size: 0.6rem;
      line-height: 1.2;
    }
    
    .property-type-badge {
      top: 8px;
      right: 8px;
      padding: 3px 8px;
      font-size: 0.55rem;
      border-radius: 12px;
    }

    .pagination-numbers {
      gap: 4px;
    }

    .page-number {
      min-width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }

    .pagination-button {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
  }
  
  /* Extra small mobile - perfect 3 col fit */
  @media (max-width: 480px) {
    .property-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 6px !important;
      padding: 0 4px !important;
    }
    
    .property-types-grid {
      gap: 8px;
    }
    
    .featured-section {
      padding: 30px 8px;
    }
    
    .property-types-section {
      padding: 30px 8px;
      margin: 0 auto 30px auto;
    }
    
    .section-title {
      font-size: 1.4rem;
    }
    
    .section-title-wrap {
      margin-bottom: 20px;
    }
    
    /* Extra compact for very small screens */
    .property-type-card {
      aspect-ratio: 4 / 3;
      border-radius: 10px;
    }
    
    .property-type-content {
      padding: 8px;
    }
    
    .property-type-icon {
      width: 24px;
      height: 24px;
      font-size: 0.75rem;
      margin-bottom: 6px;
      border-radius: 6px;
    }
    
    .property-type-name {
      font-size: 0.65rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .property-type-count {
      font-size: 0.55rem;
    }
    
    .property-type-badge {
      top: 6px;
      right: 6px;
      padding: 2px 6px;
      font-size: 0.5rem;
    }
  }

  @media (max-width: 640px) {
    .search-box { 
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-input-group { 
      border-right: none; 
      border-bottom: 1px solid rgba(76,187,23,0.15);
      padding: 12px 16px;
    }
    
    .search-input-group:last-of-type { 
      border-bottom: none; 
    }
    
    .search-label {
      text-align: center;
    }
    
    .search-field {
      text-align: center;
    }
    
    .search-field::placeholder {
      text-align: center;
    }
    
    .search-button { 
      width: 100%; 
      justify-content: center;
      margin-top: 8px;
    }
    
    .hero-title {
      font-size: clamp(2rem, 8vw, 3rem);
    }
    
    .hero-subtitle {
      font-size: 0.95rem;
      margin-bottom: 32px;
    }
    
    .hero {
      min-height: 85vh;
    }
    
    .home-cta {
      padding: 60px 20px;
    }
    
    .home-cta h2 {
      font-size: clamp(1.6rem, 6vw, 2.2rem);
    }
    
    .home-cta p {
      font-size: 0.9rem;
      margin-bottom: 28px;
    }
    
    .btn.btn-primary.btn-outline {
      padding: 10px 24px;
      font-size: 0.85rem;
    }
  }

  /* Targeted centering for specific headings */
  .featured-title,
  .property-type-title {
    text-align: center !important;
  }
`;

// Map property type to icons
const getTypeIcon = (type) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('villa') || typeLower.includes('mansion')) return <FiHome />;
  if (typeLower.includes('apartment') || typeLower.includes('flat') || typeLower.includes('condo')) return <FiGrid />;
  if (typeLower.includes('beach') || typeLower.includes('coastal')) return <FiMapPin />;
  if (typeLower.includes('commercial') || typeLower.includes('office') || typeLower.includes('retail')) return <FiBriefcase />;
  if (typeLower.includes('studio')) return <FiAperture />;
  return <FiTag />;
};

const Home = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ name: '', propertyType: '', location: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(9); // 3 rows x 3 columns = 9 properties per page
  const navigate = useNavigate();

  useEffect(() => {
    const id = 'home-kelly-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = homeStyles;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all properties (no limit to enable pagination)
        const propsRes = await guestAPI.get('/properties');
        const propsData = Array.isArray(propsRes.data) ? propsRes.data : [];
        setAllProperties(propsData);

        // Fetch categories with property counts (for search dropdown)
        const categoriesRes = await guestAPI.get('/categories');
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        setCategories(categoriesData.filter(cat => cat.propertyCount > 0));

      } catch (error) {
        console.error('Error fetching home data:', error);
        setAllProperties([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Client-side filter based on searchQuery for live preview
  // Enhanced search with partial matching (case-insensitive)
  const filteredProperties = allProperties.filter(property => {
    // Name search - partial match (case insensitive)
    const matchesName = !searchQuery.name ||
      property.title?.toLowerCase().includes(searchQuery.name.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchQuery.name.toLowerCase());

    // Property type search - partial match (case insensitive)
    const propertyTypeValue = searchQuery.propertyType;
    const propertyCategoryName = property.category?.name || '';
    const propertyCategorySlug = slugify(propertyCategoryName);

    const matchesType = !propertyTypeValue ||
      propertyCategoryName.toLowerCase().includes(propertyTypeValue.toLowerCase()) ||
      propertyCategorySlug.includes(propertyTypeValue.toLowerCase());

    // Location search - partial match (case insensitive)
    const matchesLocation = !searchQuery.location ||
      property.location?.toLowerCase().includes(searchQuery.location.toLowerCase());

    return matchesName && matchesType && matchesLocation;
  });

  // Get current properties for pagination (from filtered)
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Go to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.name) params.append('search', searchQuery.name);
    if (searchQuery.propertyType) params.append('propertyType', searchQuery.propertyType);
    if (searchQuery.location) params.append('location', searchQuery.location);

    navigate(`/properties?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName) => {
    const typeSlug = slugify(categoryName);
    navigate(`/properties/${typeSlug}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="home-page">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">Premium Real Estate</div>

          <h1 className="hero-title">
            Discover Your<br /><em>Perfect Sanctuary</em>
          </h1>
          <p className="hero-subtitle">
            Premium properties curated for your elite lifestyle.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input-group">
              <label className="search-label">Property Name</label>
              <input
                type="text"
                className="search-field"
                placeholder="e.g. Luxury Villa"
                value={searchQuery.name}
                onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
              />
            </div>
            <div className="search-input-group">
              <label className="search-label">Property Type</label>
              <select
                className="search-field"
                value={searchQuery.propertyType}
                onChange={(e) => setSearchQuery({ ...searchQuery, propertyType: e.target.value })}
              >
                <option value="">Any Type</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-input-group">
              <label className="search-label">Location</label>
              <input
                type="text"
                className="search-field"
                placeholder="City/Area"
                value={searchQuery.location}
                onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
              />
            </div>
            <button type="submit" className="search-button">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Featured Properties Section ───────────────────────── */}
      <section className="featured-section">
        <div className="section-title-wrap">
          <span className="section-subtitle">Exclusively For You</span>
<h2 className="section-title featured-title">Featured Properties</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading<span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="no-results-message">
            <h3>No properties found</h3>
            <p>Try adjusting your search criteria or browse all properties.</p>
            <Link to="/properties" className="btn btn-primary btn-outline" style={{ marginTop: '20px' }}>
              Browse All Properties <FiArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <div className="property-grid">
              {currentProperties?.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft /> Previous
                </button>

                <div className="pagination-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/properties" className="btn btn-primary btn-outline">
                Explore All Properties <FiArrowRight />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── Property Types Section (Browse by Property Type) ── */}
      {!loading && categories.length > 0 && (
        <section className="property-types-section">
          <div className="section-title-wrap">
            <span className="section-subtitle">Find Your Style</span>
            <h2 className="section-title property-type-title">Browse by Property Type</h2>
          </div>

          <div className="property-types-grid">
            {categories.map((category) => (
              <div
                key={category._id}
                className={`property-type-card ${category.image ? '' : 'no-image'}`}
                style={{ backgroundImage: category.image ? `url(${category.image})` : 'none' }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="property-type-overlay"></div>
                <div className="property-type-content">
                  <div className="property-type-icon">
                    {getTypeIcon(category.name)}
                  </div>
                  <h3 className="property-type-name">{category.name}</h3>
                  <p className="property-type-count">
                    {category.propertyCount} {category.propertyCount === 1 ? 'Property' : 'Properties'}
                  </p>
                </div>
                <div className="property-type-badge">
                  {category.propertyCount}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/properties" className="btn btn-primary btn-outline">
              Browse All Properties <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* Show message if no categories with properties */}
      {!loading && categories.length === 0 && (
        <section className="property-types-section">
          <div className="section-title-wrap">
            <span className="section-subtitle">Find Your Style</span>
            <h2 className="section-title property-type-title">Browse by Property Type</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No property types available yet. Add categories and assign them to properties to see them here.</p>
            <Link to="/properties" className="btn btn-primary btn-outline" style={{ marginTop: '20px' }}>
              Browse All Properties <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* ── FAQ Section ──────────────────────────────────── */}
      <FAQs />

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <h2>
            Ready to Find Your<br /><em>Dream Property?</em>
          </h2>
          <p>
            Join thousands of satisfied customers who found their perfect home with Kelly Estates.
          </p>
          <Link to="/properties" className="btn-cta">
            Start Your Search <FiArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;