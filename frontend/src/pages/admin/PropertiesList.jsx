import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import {
  FiPlus, FiMapPin, FiEdit, FiTrash2, FiImage
} from 'react-icons/fi';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url}`;
};

const PropertiesList = ({ properties, refresh }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property?')) {
      await apiCall({ method: 'delete', url: `/admin/properties/${id}` });
      refresh();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">Dashboard / Properties</div>
          <h1 className="admin-title">Manage <em>Listings</em></h1>
        </div>
        <button className="btn-kelly" onClick={() => navigate('/admin/dashboard/properties/add-new')}>
          <FiPlus /> Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="admin-card" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FiImage style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.4 }} />
          <p>No properties listed yet.</p>
        </div>
      ) : (
        <div className="admin-property-grid">
          {properties.map(p => (
            <div className="admin-property-card" key={p._id}>
              {/* Image Container */}
              <div className="admin-card-image-container">
                {p.images && p.images.length > 0 ? (
                  <img src={getImageUrl(p.images[0])} alt={p.title} className="admin-card-image" />
                ) : (
                  <FiImage style={{ fontSize: '2rem', color: 'var(--border)' }} />
                )}
                <div className="admin-card-price-badge">
                  Rs. {p.price?.toLocaleString()}
                </div>
              </div>

              {/* Card Body */}
              <div className="admin-card-content">
                <div className="admin-card-meta">
                  <span className="admin-card-category">
                    {p.category?.name || 'Property'}
                  </span>
                  <span className="admin-card-rooms">
                    {p.bedrooms} BR • {p.bathrooms} BA
                  </span>
                </div>

                <h3 className="admin-card-title">{p.title}</h3>

                <div className="admin-card-location">
                  <FiMapPin size={12} />
                  <span>
                    {p.city || (p.location ? (p.location.split(',')[1]?.trim() || p.location.split(',')[0].trim()) : 'No location')}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="admin-card-actions">
                <button
                  className="admin-btn-action admin-btn-edit"
                  onClick={() => navigate(`/admin/dashboard/properties/edit/${p._id}`)}
                >
                  <FiEdit /> Edit
                </button>
                <button
                  className="admin-btn-action admin-btn-delete"
                  onClick={() => handleDelete(p._id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesList;