import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';
import { FiMail, FiClock, FiX, FiEye, FiFilter, FiChevronDown, FiMessageSquare, FiPhone, FiTrash2 } from 'react-icons/fi';

const Messages = ({ refresh }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [updating, setUpdating] = useState({});
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiCall({ method: 'get', url: '/admin/messages' });
      setMessages(data || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg => 
    activeTab === 'new' ? msg.status === 'new' :
    activeTab === 'read' ? msg.status === 'read' :
    msg.status === 'replied'
  );

  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await apiCall({
        method: 'put',
        url: `/admin/messages/${id}`,
        data: { status }
      });
      await fetchMessages();
      if (refresh) refresh();
    } catch (error) {
      console.error('Update status error:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await apiCall({
        method: 'delete',
        url: `/admin/messages/${id}`
      });
      await fetchMessages();
      if (refresh) refresh();
      if (selectedMsg?._id === id) setSelectedMsg(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getWhatsAppLink = (whatsapp, name) => {
    const cleanNum = whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hi ${name}, thanks for contacting Resi D' Elite. How can we help you today?`);
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  const getStatusStyle = (status) => ({
    new:     { background: '#FFF3CD', color: '#856404', icon: '🆕' },
    read:    { background: '#D1ECF1', color: '#0C5460', icon: '📖' },
    replied: { background: '#D1E7DD', color: '#0A4A2A', icon: '✓' },
  }[status] || { background: '#FFF3CD', color: '#856404', icon: '📧' });

  const getCurrentTabLabel = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.label : 'New';
  };

  const tabs = [
    { id: 'new', label: 'New', count: messages.filter(m => m.status === 'new').length },
    { id: 'read', label: 'Read', count: messages.filter(m => m.status === 'read').length },
    { id: 'replied', label: 'Replied', count: messages.filter(m => m.status === 'replied').length },
  ];

  if (loading) {
    return (
      <div>
        <div className="admin-header">
          <div>
            <div className="admin-eyebrow">Dashboard / Messages</div>
            <h1 className="admin-title">Customer <em>Messages</em></h1>
          </div>
        </div>
        <div className="loading-state">
          <FiClock style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-view">
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">Dashboard / Messages</div>
          <h1 className="admin-title">Customer <em>Messages</em></h1>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="mobile-tab-toggle">
        <button 
          className="tab-toggle-btn"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <FiFilter /> {getCurrentTabLabel()} <FiChevronDown />
        </button>
      </div>

      {/* Desktop Tabs */}
      <div className="messages-tabs desktop-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Mobile Tab Modal */}
      <div className={`mobile-tab-modal ${mobileFilterOpen ? 'open' : ''}`}>
        <div className="mobile-tab-header">
          <h3>Filter Messages</h3>
          <button onClick={() => setMobileFilterOpen(false)} className="close-tab-modal">
            <FiX />
          </button>
        </div>
        <div className="mobile-tab-options">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileFilterOpen(false);
              }}
              className={`mobile-tab-option ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="option-label">{tab.label}</span>
              <span className="option-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View - No card wrapper */}
      <div className="desktop-table-view">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <FiMail style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No {getCurrentTabLabel().toLowerCase()} messages</h3>
            <p>Messages from customer inquiries will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="messages-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr key={msg._id} className="message-row">
                    <td className="name-cell">{msg.name}</td>
                    <td>
                      <div className="contact-info">
                        <a href={`mailto:${msg.email}`} className="email-link">
                          <FiMail /> {msg.email}
                        </a>
                        {msg.whatsapp && (
                          <a href={getWhatsAppLink(msg.whatsapp, msg.name)} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                            <FiPhone /> {msg.whatsapp}
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="message-preview">
                        {msg.message}
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${msg.status}`}>
                        {getStatusStyle(msg.status).icon} {msg.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => setSelectedMsg(msg)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View - No card wrapper */}
      <div className="mobile-card-view">
        {filteredMessages.length === 0 ? (
          <div className="empty-state-card">
            <FiMail style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No {getCurrentTabLabel().toLowerCase()} messages</h3>
            <p>Messages from customer inquiries will appear here.</p>
          </div>
        ) : (
          <div className="messages-grid">
            {filteredMessages.map((msg) => (
              <div key={msg._id} className="message-card">
                <div className="card-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">{msg.name}</div>
                      <div className="customer-date">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge ${msg.status}`}>
                    {getStatusStyle(msg.status).icon} {msg.status?.toUpperCase()}
                  </span>
                </div>

                <div className="contact-info-card">
                  <a href={`mailto:${msg.email}`} className="email-link-card">
                    <FiMail /> {msg.email}
                  </a>
                  {msg.whatsapp && (
                    <a href={getWhatsAppLink(msg.whatsapp, msg.name)} target="_blank" rel="noopener noreferrer" className="whatsapp-link-card">
                      <FiPhone /> {msg.whatsapp}
                    </a>
                  )}
                </div>

                <div className="message-content">
                  <FiMessageSquare className="message-icon" />
                  <p>{msg.message}</p>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => setSelectedMsg(msg)}
                    className="action-btn view-btn"
                  >
                    <FiEye /> View Details
                  </button>
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="action-btn delete-btn"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMsg && (
        <div className="modal-overlay" onClick={() => setSelectedMsg(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMsg(null)}>
              <FiX />
            </button>

            <div className="modal-header-custom">
              <div className="modal-avatar">
                {selectedMsg.name.charAt(0).toUpperCase()}
              </div>
              <div className="modal-customer-info">
                <h3>{selectedMsg.name}</h3>
                <div className="modal-date">
                  {new Date(selectedMsg.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="modal-contact">
              <a href={`mailto:${selectedMsg.email}`} className="modal-email">
                <FiMail /> {selectedMsg.email}
              </a>
              {selectedMsg.whatsapp && (
                <a href={getWhatsAppLink(selectedMsg.whatsapp, selectedMsg.name)} target="_blank" rel="noreferrer" className="modal-whatsapp">
                  <FiPhone /> {selectedMsg.whatsapp}
                </a>
              )}
            </div>

            <div className="modal-message">
              <p>{selectedMsg.message}</p>
            </div>

            <div className="modal-status-section">
              <label>Update Status</label>
              <div className="status-options">
                {['new', 'read', 'replied'].map(s => (
                  <button
                    key={s}
                    onClick={() => { 
                      updateStatus(selectedMsg._id, s); 
                      setSelectedMsg(prev => ({ ...prev, status: s })); 
                    }}
                    disabled={updating[selectedMsg._id]}
                    className={`status-option ${selectedMsg.status === s ? 'active' : ''}`}
                  >
                    {getStatusStyle(s).icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              {selectedMsg.whatsapp && (
                <a
                  href={getWhatsAppLink(selectedMsg.whatsapp, selectedMsg.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-action"
                >
                  <FiPhone /> WhatsApp
                </a>
              )}
              <button onClick={() => setSelectedMsg(null)} className="close-action">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .messages-view {
          width: 100%;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 60px;
          color: var(--text-muted);
        }

        /* Desktop Tabs */
        .messages-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .tab-btn {
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

        .tab-btn.active {
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

        .tab-btn.active .tab-count {
          background: rgba(255,255,255,0.2);
        }

        /* Mobile Tab Toggle */
        .mobile-tab-toggle {
          display: none;
          margin-bottom: 16px;
        }

        .tab-toggle-btn {
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

        .mobile-tab-modal {
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

        .mobile-tab-modal.open {
          transform: translateY(0);
        }

        .mobile-tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .mobile-tab-header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .close-tab-modal {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px;
        }

        .mobile-tab-options {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-tab-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mobile-tab-option.active {
          background: var(--kelly);
          border-color: var(--kelly);
          color: white;
        }

        .option-count {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .mobile-tab-option.active .option-count {
          background: rgba(255,255,255,0.2);
        }

        /* Desktop Table - No card background */
        .desktop-table-view {
          display: block;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .messages-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }

        .messages-table thead tr {
          border-bottom: 2px solid rgba(76,187,23,0.2);
        }

        .messages-table th {
          text-align: left;
          padding: 16px 12px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--kelly);
          background: transparent;
          letter-spacing: 0.5px;
        }

        .messages-table td {
          padding: 16px 12px;
          border-bottom: 1px solid rgba(76,187,23,0.1);
          vertical-align: middle;
          background: transparent;
        }

        .message-row:hover td {
          background: rgba(76,187,23,0.03);
        }

        .name-cell {
          font-weight: 600;
          color: var(--ink);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .email-link, .whatsapp-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          text-decoration: none;
        }

        .email-link {
          color: var(--kelly-light);
        }

        .email-link:hover {
          text-decoration: underline;
        }

        .whatsapp-link {
          color: #25D366;
        }

        .whatsapp-link:hover {
          text-decoration: underline;
        }

        .message-preview {
          font-size: 0.85rem;
          color: var(--text-mid);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .date-cell {
          white-space: nowrap;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .status-badge.new {
          background: #FFF3CD;
          color: #856404;
        }

        .status-badge.read {
          background: #D1ECF1;
          color: #0C5460;
        }

        .status-badge.replied {
          background: #D1E7DD;
          color: #0A4A2A;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
        }

        .view-btn {
          color: var(--kelly);
        }

        .view-btn:hover {
          background: rgba(76,187,23,0.1);
        }

        .delete-btn {
          color: #dc2626;
        }

        .delete-btn:hover {
          background: rgba(220,38,38,0.1);
        }

        /* Mobile Card View */
        .mobile-card-view {
          display: none;
        }

        .messages-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .customer-info {
          display: flex;
          gap: 12px;
          flex: 1;
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--kelly);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .customer-details {
          flex: 1;
        }

        .customer-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--ink);
        }

        .customer-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .contact-info-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 12px;
        }

        .email-link-card, .whatsapp-link-card {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          text-decoration: none;
        }

        .email-link-card {
          color: var(--kelly-light);
        }

        .whatsapp-link-card {
          color: #25D366;
        }

        .message-content {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .message-icon {
          color: var(--kelly);
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .message-content p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--ink);
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .card-actions .action-btn {
          flex: 1;
          justify-content: center;
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        /* Empty States */
        .empty-state {
          text-align: center;
          padding: 60px 24px;
          color: var(--text-muted);
        }

        .empty-state h3 {
          font-family: var(--font-display);
          font-size: 1.3rem;
          color: var(--text-mid);
          margin-bottom: 8px;
        }

        .empty-state-card {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        /* Modal Styles */
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
          padding: 16px;
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 24px;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
        }

        .modal-header-custom {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .modal-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--kelly);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .modal-customer-info h3 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--ink);
        }

        .modal-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .modal-contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .modal-email, .modal-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .modal-email {
          color: var(--kelly-light);
        }

        .modal-whatsapp {
          color: #25D366;
        }

        .modal-message {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          border-left: 4px solid var(--kelly);
        }

        .modal-message p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--ink);
          white-space: pre-wrap;
        }

        .modal-status-section {
          margin-bottom: 20px;
        }

        .modal-status-section label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .status-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-option {
          padding: 6px 16px;
          border-radius: 50px;
          border: 2px solid var(--border);
          background: transparent;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .status-option.active {
          border-color: var(--kelly);
          background: var(--kelly);
          color: white;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .whatsapp-action {
          padding: 10px 20px;
          background: #25D366;
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .close-action {
          padding: 10px 20px;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .desktop-table-view {
            display: none;
          }
          
          .mobile-card-view {
            display: block;
          }
          
          .desktop-tabs {
            display: none;
          }
          
          .mobile-tab-toggle {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .modal-container {
            padding: 20px;
          }
          
          .modal-header-custom {
            flex-direction: column;
            text-align: center;
          }
          
          .modal-avatar {
            width: 70px;
            height: 70px;
            font-size: 1.8rem;
          }
          
          .modal-contact {
            text-align: center;
          }
          
          .status-options {
            flex-direction: column;
          }
          
          .status-option {
            width: 100%;
            text-align: center;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .whatsapp-action, .close-action {
            width: 100%;
            justify-content: center;
          }
          
          .card-actions {
            flex-direction: column;
          }
        }

        /* Touch-friendly */
        @media (hover: none) and (pointer: coarse) {
          .tab-btn, .action-btn, .status-option {
            cursor: default;
          }
        }
      `}</style>
    </div>
  );
};

export default Messages;