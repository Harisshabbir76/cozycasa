import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import {
  FiHome, FiTag, FiCalendar, FiCreditCard,
  FiCheckCircle, FiClock, FiArrowUpRight
} from 'react-icons/fi';

const Overview = ({ properties, bookings }) => {
  const latestBookings = useMemo(() => bookings.slice(0, 5), [bookings]);
  const totalRevenue = useMemo(() => bookings.reduce((s, b) => s + (b.totalPrice || 0), 0), [bookings]);
  const completed = bookings.filter(b => b.status === 'completed').length;
  const pending = bookings.filter(b => b.status === 'pending').length;

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const [usedCategories, setUsedCategories] = useState([]);

  useEffect(() => {
    const fetchUsedCategories = async () => {
      try {
        const res = await apiCall({ method: 'get', url: '/categories/used' });
        setUsedCategories(res || []);
      } catch (err) {
        console.error('Error fetching used categories:', err);
      }
    };
    fetchUsedCategories();
  }, []);

  const stats = [
    { icon: <FiHome />, label: 'Properties', value: properties.length },
    { icon: <FiTag />, label: 'Property Types', value: usedCategories.length },
    { icon: <FiCalendar />, label: 'Bookings', value: bookings.length },
    { icon: <FiCreditCard />, label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}` },
    { icon: <FiCheckCircle />, label: 'Completed', value: completed },
  ];

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="admin-header">
        <div className="admin-header-main">
          <div className="admin-eyebrow">Dashboard · Overview</div>
          <h1 className="admin-title">Admin <em>Insights</em></h1>
        </div>
        {pending > 0 && (
          <Link to="/admin/dashboard/bookings" className="pending-alert">
            <span className="pending-dot" />
            <span className="pending-text">{pending} pending booking{pending !== 1 ? 's' : ''}</span>
            <FiArrowUpRight size={14} />
          </Link>
        )}
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="admin-stats">
        {stats.map(({ icon, label, value }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">{icon}</div>
            <div>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Property Types Section — no white card wrapper ── */}
      {usedCategories.length > 0 && (
        <div className="section-shell">
          <div className="section-shell-header">
            <h2 className="section-shell-title">
              <FiTag /> Property Types
            </h2>
            <Link to="/admin/dashboard/property-types" className="view-all-link">
              Manage →
            </Link>
          </div>

          <div className="cat-grid-shell">
            {usedCategories.map(cat => (
              <div key={cat._id} className="cat-card-shell">
                <div className="cat-thumb-shell">
                  {cat.image
                    ? <img src={`http://localhost:5000${cat.image}`} alt={cat.name} />
                    : '🏠'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="cat-name">{cat.name}</p>
                  <p className="cat-count">{cat.propertyCount} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Latest Bookings Section — no white card wrapper ── */}
      <div className="section-shell">
        <div className="section-shell-header">
          <h2 className="section-shell-title">
            <FiClock /> Latest Bookings
          </h2>
          <Link to="/admin/dashboard/bookings" className="view-all-link">
            View All →
          </Link>
        </div>

        {latestBookings.length === 0 ? (
          <p className="shell-empty">No bookings yet.</p>
        ) : (
          <div className="booking-cards-grid">
            {latestBookings.map(b => (
              <div key={b._id} className="booking-card">
                <div className="booking-card-top">
                  <div className="td-avatar">{getInitials(b.user?.name)}</div>
                  <div className="booking-card-info">
                    <p className="booking-customer">{b.user?.name || 'User'}</p>
                    <p className="booking-property">{b.property?.title || 'Property'}</p>
                  </div>
                  <span className={`badge badge-${b.status || 'pending'}`}>
                    {(b.status || 'pending').toUpperCase()}
                  </span>
                </div>
                <div className="booking-card-bottom">
                  <span className="booking-meta">
                    <FiCalendar size={12} />
                    {new Date(b.checkInDate).toLocaleDateString()}
                  </span>
                  <span className="booking-price">Rs. {b.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        /* ── Pending alert ── */
        .pending-alert {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #FFF3CD;
          border: 1px solid #FFD700;
          border-radius: 50px;
          color: #856404;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
          align-self: flex-end;
        }
        .pending-alert:hover {
          background: #FFE68D;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(133,100,4,0.15);
        }
        .pending-dot {
          width: 8px;
          height: 8px;
          background: #d97706;
          border-radius: 50%;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }

        /* ── Section shell (no white bg) ── */
        .section-shell {
          margin-bottom: 32px;
        }

        .section-shell-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .section-shell-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--kelly);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-shell-title svg {
          font-size: 1rem;
          color: var(--kelly-light);
        }

        .shell-empty {
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 16px 0;
        }

        /* ── Booking cards grid ── */
        .booking-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .booking-card {
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          padding: 16px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .booking-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .booking-card-top {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .booking-card-info {
          flex: 1;
          min-width: 0;
        }

        .booking-customer {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text);
          margin: 0 0 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .booking-property {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .booking-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }

        .booking-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .booking-price {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--kelly);
        }

        /* ── Category cards grid (shell) ── */
        .cat-grid-shell {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .cat-card-shell {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .cat-card-shell:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
          border-color: var(--kelly-light);
        }

        .cat-thumb-shell {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--kelly-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cat-thumb-shell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .booking-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .booking-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .cat-grid-shell     { gap: 8px; }
        }

        @media (max-width: 540px) {
          .booking-cards-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .cat-grid-shell { gap: 6px; }
          .cat-card-shell { padding: 10px 8px; gap: 6px; }
          .cat-thumb-shell { width: 36px; height: 36px; font-size: 16px; }
          .cat-name { font-size: 0.75rem; }
          .cat-count { font-size: 0.65rem; }
        }

        @media (max-width: 480px) {
          .pending-text { display: none; }
          .pending-alert { padding: 8px 10px; border-radius: 12px; }
          .admin-title { font-size: 1.7rem; }
        }
      `}</style>
    </div>
  );
};

export default Overview;