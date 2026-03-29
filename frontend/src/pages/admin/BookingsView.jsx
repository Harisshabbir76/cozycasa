import React, { useState, useMemo } from 'react';
import { apiCall } from '../../utils/api';
import { 
  FiCheckCircle, FiMessageCircle, FiEye, FiX, FiCalendar, 
  FiUsers, FiHome, FiCreditCard, FiMapPin, FiUser, FiPhone, 
  FiMail, FiClock, FiDollarSign, FiInfo, FiFilter, FiChevronDown
} from 'react-icons/fi';

const BookingsView = ({ bookings, refresh }) => {
  const [filter, setFilter] = useState('all');
  const [statusTab, setStatusTab] = useState('active');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const periods = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'checkins_today', label: 'Check-ins Today' },
    { id: 'checkouts_today', label: 'Check-outs Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  const filteredBookings = useMemo(() => {
    let list = statusTab === 'active'
      ? bookings.filter(b => b.status !== 'completed')
      : bookings.filter(b => b.status === 'completed');

    const now = new Date();
    const daysAgo = (d) => new Date(now).setDate(now.getDate() - d);

    if (filter === 'today') list = list.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
    if (filter === 'yesterday') { const y = new Date(now); y.setDate(now.getDate() - 1); list = list.filter(b => new Date(b.createdAt).toDateString() === y.toDateString()); }
    if (filter === 'checkins_today') list = list.filter(b => new Date(b.checkInDate).toDateString() === now.toDateString());
    if (filter === 'checkouts_today') list = list.filter(b => new Date(b.checkOutDate).toDateString() === now.toDateString());
    if (filter === '7d') list = list.filter(b => new Date(b.createdAt) >= daysAgo(7));
    if (filter === '30d') list = list.filter(b => new Date(b.createdAt) >= daysAgo(30));
    if (filter === '90d') list = list.filter(b => new Date(b.createdAt) >= daysAgo(90));

    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings, filter, statusTab]);

  const markCompleted = async (id) => {
    try {
      await apiCall({ method: 'put', url: `/admin/bookings/${id}`, data: { status: 'completed' } });
      refresh();
    } catch (err) { console.error(err); }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const getCustomerName = (b) => b.guestInfo?.name || b.user?.name || 'Guest';
  const getCustomerPhone = (b) => b.guestInfo?.phone || b.user?.phone || '';
  const getCustomerEmail = (b) => b.guestInfo?.email || b.user?.email || '';

  const activeCount = bookings.filter(b => b.status !== 'completed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const getCurrentPeriodLabel = () => {
    const period = periods.find(p => p.id === filter);
    return period ? period.label : 'All Time';
  };

  return (
    <div className="bookings-view">
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">Dashboard / Bookings</div>
          <h1 className="admin-title">Manage <em>Bookings</em></h1>
        </div>
      </div>

      {/* Status tabs */}
      <div className="status-tabs">
        {[
          { id: 'active', label: 'Active', count: activeCount },
          { id: 'completed', label: 'Completed', count: completedCount },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id)}
            className={`status-tab ${statusTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="mobile-filter-toggle">
        <button 
          className="filter-toggle-btn"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <FiFilter /> {getCurrentPeriodLabel()} <FiChevronDown />
        </button>
      </div>

      {/* Period filter tabs - Desktop */}
      <div className="period-filters desktop-filters">
        {periods.map(p => (
          <button
            key={p.id}
            onClick={() => setFilter(p.id)}
            className={`period-filter ${filter === p.id ? 'active' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Period filter - Mobile Modal */}
      <div className={`mobile-filter-modal ${mobileFilterOpen ? 'open' : ''}`}>
        <div className="mobile-filter-header">
          <h3>Filter by Period</h3>
          <button onClick={() => setMobileFilterOpen(false)} className="close-filter">
            <FiX />
          </button>
        </div>
        <div className="mobile-filter-options">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setFilter(p.id);
                setMobileFilterOpen(false);
              }}
              className={`mobile-filter-option ${filter === p.id ? 'active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid - Mobile Card View */}
      <div className="bookings-grid">
        {filteredBookings.map(b => (
          <div key={b._id} className="booking-card">
            <div className="card-header">
              <div className="customer-avatar">{getInitials(getCustomerName(b))}</div>
              <div className="customer-info-card">
                <div className="customer-name">{getCustomerName(b)}</div>
                {getCustomerPhone(b) && (
                  <div className="customer-phone">{getCustomerPhone(b)}</div>
                )}
              </div>
              <span className={`status-badge ${b.status || 'pending'}`}>
                {(b.status || 'pending').toUpperCase()}
              </span>
            </div>

            <div className="property-info-card">
              <FiHome className="property-icon" />
              <div className="property-details">
                <div className="property-title">{b.property?.title || 'Property'}</div>
                {b.property?.location && (
                  <div className="property-location">{b.property.location}</div>
                )}
              </div>
            </div>

            <div className="booking-dates">
              <div className="date-item">
                <FiCalendar className="date-icon" />
                <div>
                  <div className="date-label">Check-in</div>
                  <div className="date-value">{new Date(b.checkInDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="date-divider">→</div>
              <div className="date-item">
                <FiCalendar className="date-icon" />
                <div>
                  <div className="date-label">Check-out</div>
                  <div className="date-value">{new Date(b.checkOutDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="payment-info-card">
              <div className="payment-details">
                <span className={`payment-badge ${b.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                  {(b.paymentStatus || 'pending').toUpperCase()}
                </span>
                <div className="payment-amount">Rs. {b.totalPrice?.toLocaleString()}</div>
              </div>
            </div>

            <div className="card-actions">
              <button
                onClick={() => openModal(b)}
                className="action-btn view-btn"
              >
                <FiEye /> View Details
              </button>
              {statusTab === 'active' && (
                <button
                  onClick={() => markCompleted(b._id)}
                  className="action-btn complete-btn"
                >
                  <FiCheckCircle /> Complete
                </button>
              )}
              {getCustomerPhone(b) && (
                <a
                  href={`https://wa.me/${getCustomerPhone(b).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${getCustomerName(b)}, confirming your booking at CozyCasa.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="action-btn whatsapp-btn"
                >
                  <FiMessageCircle /> WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="desktop-table-view">
        <div className="bookings-table-container">
          <div className="table-responsive">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b._id} className="booking-row">
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">{getInitials(getCustomerName(b))}</div>
                        <div className="customer-details">
                          <span className="customer-name">{getCustomerName(b)}</span>
                          {getCustomerPhone(b) && (
                            <span className="customer-phone">{getCustomerPhone(b)}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="property-info">
                        <FiHome className="property-icon" />
                        <div>
                          <div className="property-title">{b.property?.title || 'Property'}</div>
                          {b.property?.location && (
                            <div className="property-location">{b.property.location}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="payment-info">
                        <span className={`payment-badge ${b.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                          {(b.paymentStatus || 'pending').toUpperCase()}
                        </span>
                        <div className="payment-amount">Rs. {b.totalPrice?.toLocaleString()}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${b.status || 'pending'}`}>
                        {(b.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openModal(b)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          <FiEye /> View
                        </button>
                        {statusTab === 'active' && (
                          <button
                            onClick={() => markCompleted(b._id)}
                            className="action-btn complete-btn"
                            title="Mark as Completed"
                          >
                            <FiCheckCircle /> Complete
                          </button>
                        )}
                        {getCustomerPhone(b) && (
                          <a
                            href={`https://wa.me/${getCustomerPhone(b).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${getCustomerName(b)}, confirming your booking at CozyCasa.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="action-btn whatsapp-btn"
                            title="WhatsApp"
                          >
                            <FiMessageCircle /> WhatsApp
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr className="empty-row">
                    <td colSpan="5">
                      <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <p>No bookings match this filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Booking Details - Same as before */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Customer Information */}
              <div className="modal-section">
                <h3>
                  <FiUser className="section-icon" />
                  Customer Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FiUser className="info-icon" />
                    <div>
                      <label>Name</label>
                      <p>{getCustomerName(selectedBooking)}</p>
                    </div>
                  </div>
                  {getCustomerEmail(selectedBooking) && (
                    <div className="info-item">
                      <FiMail className="info-icon" />
                      <div>
                        <label>Email</label>
                        <p>{getCustomerEmail(selectedBooking)}</p>
                      </div>
                    </div>
                  )}
                  {getCustomerPhone(selectedBooking) && (
                    <div className="info-item">
                      <FiPhone className="info-icon" />
                      <div>
                        <label>Phone</label>
                        <p>{getCustomerPhone(selectedBooking)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Information */}
              <div className="modal-section">
                <h3>
                  <FiHome className="section-icon" />
                  Property Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FiHome className="info-icon" />
                    <div>
                      <label>Property Title</label>
                      <p>{selectedBooking.property?.title || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiMapPin className="info-icon" />
                    <div>
                      <label>Location</label>
                      <p>{selectedBooking.property?.location || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedBooking.property?.city && (
                    <div className="info-item">
                      <FiMapPin className="info-icon" />
                      <div>
                        <label>City</label>
                        <p>{selectedBooking.property.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="modal-section">
                <h3>
                  <FiCalendar className="section-icon" />
                  Booking Details
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FiCalendar className="info-icon" />
                    <div>
                      <label>Check-in Date</label>
                      <p>{new Date(selectedBooking.checkInDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiCalendar className="info-icon" />
                    <div>
                      <label>Check-out Date</label>
                      <p>{new Date(selectedBooking.checkOutDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiClock className="info-icon" />
                    <div>
                      <label>Nights</label>
                      <p>
                        {Math.ceil(
                          (new Date(selectedBooking.checkOutDate) - new Date(selectedBooking.checkInDate)) / 
                          (1000 * 60 * 60 * 24)
                        )} nights
                      </p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiUsers className="info-icon" />
                    <div>
                      <label>Guests</label>
                      <p>{selectedBooking.guests || 1} guest(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="modal-section">
                <h3>
                  <FiCreditCard className="section-icon" />
                  Payment Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FiDollarSign className="info-icon" />
                    <div>
                      <label>Total Amount</label>
                      <p className="amount">Rs. {selectedBooking.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiCreditCard className="info-icon" />
                    <div>
                      <label>Payment Status</label>
                      <span className={`status-badge ${selectedBooking.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                        {(selectedBooking.paymentStatus || 'pending').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiInfo className="info-icon" />
                    <div>
                      <label>Booking Status</label>
                      <span className={`status-badge ${selectedBooking.status || 'pending'}`}>
                        {(selectedBooking.status || 'pending').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedBooking.specialRequests && (
                <div className="modal-section">
                  <h3>Special Requests</h3>
                  <p className="special-requests">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              {statusTab === 'active' && selectedBooking.status !== 'completed' && (
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    markCompleted(selectedBooking._id);
                    closeModal();
                  }}
                >
                  <FiCheckCircle /> Mark as Completed
                </button>
              )}
              {getCustomerPhone(selectedBooking) && (
                <a
                  href={`https://wa.me/${getCustomerPhone(selectedBooking).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${getCustomerName(selectedBooking)}, confirming your booking at CozyCasa.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  <FiMessageCircle /> Contact via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .bookings-view {
          width: 100%;
        }

        /* Status Tabs */
        .status-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .status-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 50px;
          border: 2px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .status-tab.active {
          border-color: var(--kelly);
          background: var(--kelly);
          color: white;
        }

        .tab-count {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .status-tab.active .tab-count {
          background: rgba(255,255,255,0.2);
        }

        /* Mobile Filter */
        .mobile-filter-toggle {
          display: none;
          margin-bottom: 16px;
        }

        .filter-toggle-btn {
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .mobile-filter-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
        }

        .mobile-filter-modal.open {
          transform: translateY(0);
        }

        .mobile-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .mobile-filter-header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .close-filter {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px;
        }

        .mobile-filter-options {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .mobile-filter-option {
          padding: 12px 16px;
          text-align: left;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mobile-filter-option.active {
          background: var(--kelly);
          border-color: var(--kelly);
          color: white;
        }

        /* Period Filters - Desktop */
        .period-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .period-filter {
          padding: 6px 14px;
          border-radius: 50px;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }

        .period-filter.active {
          border-color: var(--kelly);
          background: rgba(76,187,23,0.1);
          color: var(--kelly);
        }

        /* Mobile Card Grid */
        .bookings-grid {
          display: none;
          gap: 16px;
          margin-bottom: 24px;
        }

        .booking-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .customer-info-card {
          flex: 1;
        }

        .property-info-card {
          display: flex;
          gap: 10px;
          padding: 12px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 12px;
        }

        .property-details {
          flex: 1;
        }

        .booking-dates {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .date-item {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .date-icon {
          color: var(--kelly);
          font-size: 0.9rem;
        }

        .date-label {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .date-value {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .date-divider {
          color: var(--text-muted);
        }

        .payment-info-card {
          margin-bottom: 16px;
        }

        .payment-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .card-actions .action-btn {
          flex: 1;
          justify-content: center;
          padding: 8px 12px;
        }

        /* Desktop Table View */
        .desktop-table-view {
          display: block;
        }

        .bookings-table-container {
          width: 100%;
          overflow-x: auto;
          background: transparent;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }

        .bookings-table thead tr {
          border-bottom: 2px solid rgba(76,187,23,0.2);
        }

        .bookings-table th {
          text-align: left;
          padding: 16px 12px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--kelly);
          background: transparent;
          letter-spacing: 0.5px;
        }

        .bookings-table td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(76,187,23,0.1);
          vertical-align: middle;
          background: transparent;
        }

        .booking-row:hover td {
          background: rgba(76,187,23,0.03);
        }

        /* Shared Components */
        .customer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--kelly);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .customer-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--ink);
        }

        .customer-phone {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .property-icon {
          color: var(--kelly);
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .property-title {
          font-weight: 500;
          font-size: 0.85rem;
          color: var(--ink);
        }

        .property-location {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .payment-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          width: fit-content;
        }

        .payment-badge.paid {
          background: rgba(46,125,50,0.1);
          color: #2e7d32;
          border: 1px solid rgba(46,125,50,0.2);
        }

        .payment-badge.pending {
          background: rgba(245,124,0,0.1);
          color: #f57c00;
          border: 1px solid rgba(245,124,0,0.2);
        }

        .payment-amount {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--kelly-dark);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .status-badge.completed {
          background: rgba(46,125,50,0.1);
          color: #2e7d32;
          border: 1px solid rgba(46,125,50,0.2);
        }

        .status-badge.pending {
          background: rgba(245,124,0,0.1);
          color: #f57c00;
          border: 1px solid rgba(245,124,0,0.2);
        }

        .status-badge.confirmed {
          background: rgba(25,118,210,0.1);
          color: #1976d2;
          border: 1px solid rgba(25,118,210,0.2);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: none;
          background: transparent;
        }

        .view-btn {
          color: var(--kelly);
          border: 1px solid var(--border);
        }

        .view-btn:hover {
          background: rgba(76,187,23,0.1);
          border-color: var(--kelly);
        }

        .complete-btn {
          color: var(--kelly);
          border: 1px solid var(--border);
        }

        .complete-btn:hover {
          background: var(--kelly);
          color: white;
          border-color: var(--kelly);
        }

        .whatsapp-btn {
          color: #25D366;
          border: 1px solid rgba(37,211,102,0.3);
        }

        .whatsapp-btn:hover {
          background: #25D366;
          color: white;
          border-color: #25D366;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-state p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }

        /* Modal Styles (same as before) */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(76,187,23,0.05) 0%, rgba(76,187,23,0.02) 100%);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--ink);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-section {
          margin-bottom: 28px;
        }

        .modal-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--kelly);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(76,187,23,0.2);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .info-icon {
          color: var(--kelly);
          font-size: 1rem;
          margin-top: 2px;
        }

        .info-item label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item p {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--ink);
        }

        .info-item .amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--kelly-dark);
        }

        .special-requests {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          background: #f8f9fa;
        }

        .btn-primary, .btn-secondary, .btn-whatsapp {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          border: none;
        }

        .btn-primary {
          background: var(--kelly);
          color: white;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-whatsapp {
          background: #25D366;
          color: white;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .desktop-table-view {
            display: none;
          }
          
          .bookings-grid {
            display: flex;
            flex-direction: column;
          }
          
          .period-filters.desktop-filters {
            display: none;
          }
          
          .mobile-filter-toggle {
            display: block;
          }
          
          .status-tab .tab-label {
            display: inline;
          }
          
          .status-tab {
            padding: 6px 16px;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .booking-card {
            padding: 12px;
          }
          
          .card-header {
            flex-wrap: wrap;
          }
          
          .booking-dates {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .date-divider {
            display: none;
          }
          
          .date-item {
            padding: 8px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          
          .card-actions {
            flex-direction: column;
          }
          
          .payment-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .modal-container {
            width: 95%;
            max-height: 95vh;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .btn-primary, .btn-secondary, .btn-whatsapp {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingsView;