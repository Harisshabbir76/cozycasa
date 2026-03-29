import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import {
  FiTrendingUp, FiHome, FiCalendar, FiLogOut, FiTag, FiMail, FiMenu, FiX
} from 'react-icons/fi';

import PropertyTypes from './PropertyTypes';
import AddPropertyType from './AddPropertyType';
import { adminStyles } from './AdminStyles';
import Overview from './Overview';
import PropertiesList from './PropertiesList';
import AddProperty from './AddProperty';
import EditProperty from './EditProperty';
import BookingsView from './BookingsView';
import Messages from './Messages';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminEmail = process.env.REACT_APP_DASHBOARD_ACCESS_EMAIL || 'harisshabbir17@gmail.com';
  const hasToken = !!localStorage.getItem('token');
  const isAdmin = user && (user.role === 'admin' || user.email === adminEmail);

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Inject styles
  useEffect(() => {
    const id = 'admin-kelly-v5-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = adminStyles;
      document.head.appendChild(tag);
    }
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      const [propsRes, booksRes] = await Promise.all([
        apiCall({ method: 'get', url: '/admin/properties' }),
        apiCall({ method: 'get', url: '/admin/bookings' })
      ]);
      setProperties(propsRes || []);
      setBookings(booksRes || []);
    } catch (err) { console.error('Admin fetch error:', err); }
  };

  useEffect(() => { fetchData(); }, []);

  if (!loading && !hasToken && !user) return <Navigate to="/login" />;
  if (!loading && user && !isAdmin) return (
    <div className="admin-state-screen">
      <h2>Access Denied</h2>
      <p style={{ color: 'rgba(46,64,32,0.50)', fontSize: '0.9rem' }}>{user.email} · {user.role}</p>
      <button className="btn-kelly" style={{ marginTop: 8 }} onClick={() => navigate('/')}>Back Home</button>
    </div>
  );
  if (!user && hasToken) return <div className="admin-state-screen"><p>Verifying credentials…</p></div>;
  if (!isAdmin) return null;

  const navItems = [
    { to: '/admin/dashboard', label: 'Overview', icon: <FiTrendingUp /> },
    { to: '/admin/dashboard/properties', label: 'Properties', icon: <FiHome /> },
    { to: '/admin/dashboard/property-types', label: 'Property Types', icon: <FiTag /> },
    { to: '/admin/dashboard/bookings', label: 'Bookings', icon: <FiCalendar /> },
    { to: '/admin/dashboard/messages', label: 'Messages', icon: <FiMail /> },
  ];

  const Sidebar = (
    <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
      <Link to="/" className="sidebar-logo">
        <span className="sidebar-logo-cozy">Cozy</span>
        <span className="sidebar-logo-casa">Casa</span>
      </Link>
      <p className="sidebar-section-label">Menu</p>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon }) => {
          const active = to === '/admin/dashboard'
            ? location.pathname === to
            : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`sidebar-tab ${active ? 'active' : ''}`}>
              {icon} {label}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-divider" />
      <button className="sidebar-exit" onClick={() => navigate('/')}>
        <FiLogOut /> Exit Admin
      </button>
    </aside>
  );

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <header className="admin-topbar">
        <Link to="/" className="admin-topbar-logo">
          <span>Cozy</span><span>Casa</span>
        </Link>
        <button
          className="admin-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </header>

      {/* Sidebar overlay (mobile tap-to-close) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {Sidebar}

      <main className="admin-main">
        <Routes>
          <Route path="dashboard" element={<Overview properties={properties} bookings={bookings} />} />
          <Route path="dashboard/properties" element={<PropertiesList properties={properties} refresh={fetchData} />} />
          <Route path="dashboard/properties/add-new" element={<AddProperty refresh={fetchData} />} />
          <Route path="dashboard/properties/edit/:id" element={<EditProperty properties={properties} refresh={fetchData} />} />
          <Route path="dashboard/property-types" element={<PropertyTypes refresh={fetchData} />} />
          <Route path="dashboard/property-types/new-category" element={<AddPropertyType refresh={fetchData} />} />
          <Route path="dashboard/bookings" element={<BookingsView bookings={bookings} refresh={fetchData} />} />
          <Route path="dashboard/messages" element={<Messages refresh={fetchData} />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;