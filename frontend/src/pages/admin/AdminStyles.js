export const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --kelly:        #2E4020;
    --kelly-mid:    #3E5A2C;
    --kelly-light:  #5A7A40;
    --kelly-pale:   #EEF3E8;
    --kelly-pale2:  #F6F9F2;
    --accent:       #C8A96E;
    --accent-light: #F5EDD8;
    --text:         #1A2312;
    --text-mid:     #4A5E38;
    --text-muted:   #8A9E78;
    --border:       #DDE7D0;
    --white:        #FFFFFF;
    --radius:       12px;
    --radius-lg:    18px;
    --shadow-sm:    0 2px 8px rgba(46,64,32,0.07);
    --shadow-md:    0 4px 20px rgba(46,64,32,0.10);
    --shadow-lg:    0 8px 40px rgba(46,64,32,0.13);
    --sidebar-w:    240px;
    --font-body:    'DM Sans', sans-serif;
    --font-display: 'Fraunces', serif;
    --transition:   all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ─── Layout ─────────────────────────────────────────────── */
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--kelly-pale2);
    font-family: var(--font-body);
    color: var(--text);
  }

  /* ─── Sidebar ─────────────────────────────────────────────── */
  .admin-sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: var(--kelly);
    display: flex;
    flex-direction: column;
    padding: 28px 16px 24px;
    position: fixed;
    top: 0; left: 0;
    z-index: 300;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .sidebar-logo {
    display: block;
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 700;
    text-decoration: none;
    margin-bottom: 36px;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .sidebar-logo-cozy { color: var(--white); }
  .sidebar-logo-casa { color: var(--accent); font-style: italic; }

  .sidebar-section-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 10px;
    padding-left: 12px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .sidebar-tab {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    transition: var(--transition);
    white-space: nowrap;
  }
  .sidebar-tab svg { font-size: 1rem; flex-shrink: 0; }
  .sidebar-tab:hover { background: rgba(255,255,255,0.08); color: var(--white); }
  .sidebar-tab.active { background: rgba(255,255,255,0.14); color: var(--white); font-weight: 600; }
  .sidebar-tab.active::before {
    content: '';
    width: 3px; height: 20px;
    background: var(--accent);
    border-radius: 2px;
    margin-right: -2px;
    margin-left: -4px;
  }

  .sidebar-divider { height: 1px; background: rgba(255,255,255,0.10); margin: 18px 0; }

  .sidebar-exit {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 10px;
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.45);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    width: 100%;
    text-align: left;
  }
  .sidebar-exit:hover { background: rgba(255,0,0,0.10); color: #ff9090; }

  /* ─── Mobile top bar ──────────────────────────────────────── */
  .admin-topbar {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 56px;
    background: var(--kelly);
    z-index: 200;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
  .admin-topbar-logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    text-decoration: none;
  }
  .admin-topbar-logo span:first-child { color: var(--white); }
  .admin-topbar-logo span:last-child  { color: var(--accent); font-style: italic; }
  .admin-menu-btn {
    background: none;
    border: none;
    color: var(--white);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border-radius: 8px;
  }
  .admin-menu-btn:hover { background: rgba(255,255,255,0.1); }

  /* ─── Sidebar overlay (mobile) ────────────────────────────── */
  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 250;
  }
  .sidebar-overlay.open { display: block; }

  /* ─── Main ────────────────────────────────────────────────── */
  .admin-main {
    margin-left: var(--sidebar-w);
    flex: 1;
    padding: 36px 32px;
    max-width: 1200px;
    width: 100%;
  }

  /* ─── Header ──────────────────────────────────────────────── */
  .admin-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .admin-eyebrow {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  .admin-title {
    font-family: var(--font-display);
    font-size: 2.1rem;
    font-weight: 700;
    color: var(--kelly);
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .admin-title em { font-style: italic; color: var(--kelly-light); }

  /* ─── Stats ───────────────────────────────────────────────── */
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 18px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    transition: var(--transition);
  }
  .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

  .stat-icon {
    width: 42px; height: 42px;
    background: var(--kelly-pale);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--kelly);
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .stat-label {
    font-size: 0.73rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }
  .stat-value {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--kelly);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  /* ─── Cards ───────────────────────────────────────────────── */
  .admin-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .admin-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
    flex-wrap: wrap;
    gap: 8px;
  }
  .admin-card-title {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--kelly);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .admin-card-title svg { font-size: 1rem; color: var(--kelly-light); }

  .view-all-link {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--kelly-light);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: var(--transition);
  }
  .view-all-link:hover { color: var(--kelly); text-decoration: underline; }

  /* ─── Category cards ──────────────────────────────────────── */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 20px 24px;
  }
  
  .cat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--kelly-pale2);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    transition: var(--transition);
  }
  .cat-card:hover { 
    background: var(--kelly-pale); 
    border-color: var(--kelly-light); 
    box-shadow: var(--shadow-sm); 
    transform: translateX(4px);
  }
  .cat-thumb {
    width: 48px; 
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  .cat-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cat-name { 
    font-weight: 600; 
    font-size: 0.9rem; 
    color: var(--text); 
    margin-bottom: 4px; 
  }
  .cat-count { 
    font-size: 0.75rem; 
    color: var(--text-muted); 
  }

  /* ─── Table ───────────────────────────────────────────────── */
  .admin-table-wrap {
    overflow-x: auto;
    padding: 0 0 4px;
    -webkit-overflow-scrolling: touch;
  }
  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    min-width: 560px;
  }
  .admin-table thead { background: var(--kelly-pale2); }
  .admin-table th {
    text-align: left;
    padding: 18px 20px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  .admin-table td {
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: middle;
  }
  .admin-table tbody tr:last-child td { border-bottom: none; }
  .admin-table tbody tr:hover { background: var(--kelly-pale2); }

  .td-avatar-row { display: flex; align-items: center; gap: 10px; }
  .td-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--kelly);
    color: var(--white);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .td-strong { font-weight: 600; white-space: nowrap; }
  .td-price { font-family: var(--font-display); font-weight: 700; color: var(--kelly); white-space: nowrap; }

  .empty-row td { text-align: center; color: var(--text-muted); padding: 32px; font-size: 0.9rem; }

  /* ─── Badges ──────────────────────────────────────────────── */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 50px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  .badge-pending   { background: #FFF3CD; color: #856404; }
  .badge-confirmed { background: #D1E7DD; color: #0A4A2A; }
  .badge-completed { background: var(--kelly-pale); color: var(--kelly); }
  .badge-cancelled { background: #F8D7DA; color: #842029; }

  /* ─── Buttons ─────────────────────────────────────────────── */
  .btn-kelly {
    background: var(--kelly);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    padding: 10px 20px;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-kelly:hover { background: var(--kelly-mid); box-shadow: var(--shadow-md); transform: translateY(-1px); }

  /* ─── State screens ───────────────────────────────────────── */
  .admin-state-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 12px;
    background: var(--kelly-pale2);
    font-family: var(--font-body);
    text-align: center;
    padding: 24px;
  }
  .admin-state-screen h2 {
    font-family: var(--font-display);
    font-size: 1.8rem;
    color: var(--kelly);
  }

  /* ─── Responsive ──────────────────────────────────────────── */
  @media (max-width: 1100px) {
    .admin-stats { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 900px) {
    :root { --sidebar-w: 220px; }
    .admin-main { padding: 28px 20px; }
    .admin-stats { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 1024px) {
    .cat-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    /* Show topbar, hide sidebar by default */
    .admin-topbar { display: flex; }
    .admin-sidebar {
      transform: translateX(-100%);
      width: 240px;
    }
    .admin-sidebar.open { transform: translateX(0); }

    .admin-main {
      margin-left: 0;
      padding: 76px 16px 24px;
    }

    .admin-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .admin-title { font-size: 1.65rem; }

    .admin-card-header { padding: 16px 16px 0; }
    .cat-grid { 
      padding: 16px; 
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .admin-table th,
    .admin-table td { padding: 12px 14px; }
  }

  @media (max-width: 640px) {
    .cat-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .admin-stats {
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .stat-card { padding: 14px 12px; gap: 10px; }
    .stat-icon { width: 36px; height: 36px; font-size: 1rem; }
    .stat-value { font-size: 1.1rem; }

    .admin-title { font-size: 1.4rem; }

    /* Stacked table for mobile to prevent horizontal slide */
    .admin-table-wrap { overflow-x: visible !important; }
    .admin-table, .admin-table thead, .admin-table tbody, .admin-table th, .admin-table td, .admin-table tr {
      display: block !important;
    }
    .admin-table thead tr {
      position: absolute !important;
      top: -9999px !important;
      left: -9999px !important;
    }
    .admin-table tr {
      border: 1px solid var(--border) !important;
      margin-bottom: 12px !important;
      border-radius: 12px !important;
      background: var(--white) !important;
      padding: 8px !important;
    }
    .admin-table td {
      border: none !important;
      position: relative !important;
      padding-left: 45% !important;
      text-align: left !important;
      min-height: 38px !important;
      display: flex !important;
      align-items: center !important;
    }
    .admin-table td::before {
      content: attr(data-label);
      position: absolute !important;
      left: 12px !important;
      width: 40% !important;
      white-space: nowrap !important;
      font-weight: 700 !important;
      font-size: 0.7rem !important;
      text-transform: uppercase !important;
      color: var(--text-muted) !important;
    }
    .td-avatar-row { justify-content: flex-start !important; }
  }

  @media (max-width: 480px) {
    .pending-text { display: none; }
    .pending-alert { padding: 8px 10px; border-radius: 12px; }
    .admin-title { font-size: 1.7rem; }
  }

  /* ─── Admin Property Grid & Cards ────────────────────────── */
  .admin-property-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
  }

  .admin-property-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .admin-property-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .admin-card-image-container {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: var(--kelly-pale);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .admin-property-card:hover .admin-card-image {
    transform: scale(1.08);
  }

  .admin-card-price-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--kelly);
    color: var(--white);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: var(--shadow-sm);
    z-index: 2;
  }

  .admin-card-content {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .admin-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .admin-card-category {
    font-size: 0.7rem;
    color: var(--kelly-light);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .admin-card-rooms {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .admin-card-title {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--kelly);
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .admin-card-location {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .admin-card-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    background: var(--kelly-pale2);
  }

  .admin-btn-action {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: var(--transition);
    border: 1px solid var(--border);
  }

  .admin-btn-edit {
    background: var(--white);
    color: var(--kelly);
  }
  .admin-btn-edit:hover {
    background: var(--kelly-pale);
    border-color: var(--kelly-light);
  }

  .admin-btn-delete {
    background: #fff5f5;
    color: #dc2626;
    border-color: #fecaca;
  }
  .admin-btn-delete:hover {
    background: #fee2e2;
    border-color: #fca5a5;
  }

  /* Responsive Admin Grid */
  @media (max-width: 1200px) {
    .admin-property-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .admin-property-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .admin-card-image-container { height: 140px; }
    .admin-card-content { padding: 12px; }
    .admin-card-title { font-size: 0.95rem; }
  }

  @media (max-width: 500px) {
    .admin-property-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ─── Admin Modals & Forms ─────────────────────────────── */
  .admin-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13,26,8,0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .admin-modal {
    background: var(--white);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    padding: 32px;
    position: relative;
    animation: slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .admin-modal-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--kelly);
    margin: 0;
  }

  .admin-modal-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.4rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .admin-modal-close:hover { color: #dc2626; }

  .admin-form-group {
    margin-bottom: 20px;
  }

  .admin-form-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-mid);
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .admin-form-input {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--text);
    background: var(--white);
    outline: none;
    transition: var(--transition);
  }
  .admin-form-input:focus {
    border-color: var(--kelly-light);
    box-shadow: 0 0 0 3px var(--kelly-pale);
  }

  textarea.admin-form-input {
    resize: vertical;
    min-height: 100px;
  }

  .admin-form-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
  }

  .admin-btn-cancel {
    background: var(--kelly-pale2);
    color: var(--text-mid);
    border: 1px solid var(--border);
  }
  .admin-btn-cancel:hover { background: var(--border); }

  /* ─── Image Upload Group ──────────────────────────────── */
  .admin-upload-wrap {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    padding: 24px;
    text-align: center;
    background: var(--kelly-pale2);
    cursor: pointer;
    transition: var(--transition);
  }
  .admin-upload-wrap:hover {
    border-color: var(--kelly-light);
    background: var(--kelly-pale);
  }
  .admin-upload-icon {
    font-size: 2rem;
    color: var(--kelly-light);
    margin-bottom: 12px;
  }
  .admin-upload-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-mid);
  }
  .admin-upload-sub {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 4px;
  }
  .admin-upload-preview {
    margin-bottom: 16px;
    max-width: 100%;
    height: 140px;
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
  }
  .admin-upload-preview img {
    width: 100%; height: 100%; object-fit: cover;
  }
`;