import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../utils/api';
import { FiPlus, FiEdit3, FiTrash2, FiX, FiUpload, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiBriefcase, FiAperture, FiTag, FiGrid, FiArrowRight } from 'react-icons/fi';

// Map property type to icons (same as homepage)
const getTypeIcon = (type) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('villa') || typeLower.includes('mansion')) return <FiHome />;
  if (typeLower.includes('apartment') || typeLower.includes('flat') || typeLower.includes('condo')) return <FiGrid />;
  if (typeLower.includes('beach') || typeLower.includes('coastal')) return <FiMapPin />;
  if (typeLower.includes('commercial') || typeLower.includes('office') || typeLower.includes('retail')) return <FiBriefcase />;
  if (typeLower.includes('studio')) return <FiAperture />;
  return <FiTag />;
};

const PropertyTypesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAdmin = user?.isAdmin || user?.role === 'admin';

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiCall({ method: 'get', url: '/categories' });
      const allCategories = res || [];
      if (!isAdmin) {
        const activeCategories = allCategories.filter(cat => cat.propertyCount > 0);
        setCategories(activeCategories);
      } else {
        setCategories(allCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch property types');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editCategory.name.trim()) return setError('Name is required');
    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('name', editCategory.name);
      formData.append('description', editCategory.description);
      if (editCategory.image) formData.append('image', editCategory.image);
      await apiCall({ method: 'put', url: `/categories/${selectedCategory._id}`, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      setEditCategory({ name: '', description: '', image: null });
      setImagePreview('');
      setShowEditModal(false);
      setSelectedCategory(null);
      setError('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property type');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this property type? Associated properties will also be deleted.')) return;
    try {
      await apiCall({ method: 'delete', url: `/categories/${id}` });
      fetchCategories();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property type');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setEditCategory({...editCategory, image: file });
    }
  };



  const getImageUrl = (path) => path || '';

  if (loading) {
    return (
      <div className="admin-state-screen">
        <FiLoader className="spin" size={32} />
        <h2>Loading property types...</h2>
      </div>
    );
  }

  return (
    <div className="admin-property-types">
      {/* Header */}
      <div className="admin-breadcrumb">
        <span>Dashboard</span> <FiArrowRight size={10} /> <span>Property Types</span>
      </div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage <em>Property Types</em></h1>
          <p className="admin-eyebrow">Control categories for property listings</p>
        </div>
        {isAdmin && (
          <button className="btn-kelly" onClick={() => navigate('/admin/dashboard/property-types/new-category')}>
            <FiPlus /> Add New Category
          </button>
        )}
      </div>

      {/* Main Content */}
      {categories.length === 0 ? (
        <div className="admin-card" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FiTag style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.4 }} />
          <p>No property types found. Add your first category to get started.</p>
        </div>
      ) : (
        <div className="admin-property-grid">
          {categories.map((category) => (
            <div key={category._id} className="admin-property-card">
              {/* Image Container */}
              <div className="admin-card-image-container">
                {category.image ? (
                  <img src={getImageUrl(category.image)} alt={category.name} className="admin-card-image" />
                ) : (
                  <div style={{ fontSize: '3rem', color: 'var(--border)' }}>
                    {getTypeIcon(category.name)}
                  </div>
                )}
                <div className="admin-card-price-badge">
                  {category.propertyCount || 0} Listings
                </div>
              </div>

              {/* Card Body */}
              <div className="admin-card-content">
                <div className="admin-card-meta">
                  <span className="admin-card-category">Property Type</span>
                  <span className="admin-card-rooms">{category.name}</span>
                </div>
                <h3 className="admin-card-title">{category.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {category.description || 'Discover properties that match your lifestyle in this category.'}
                </p>
              </div>

              {/* Actions */}
              {isAdmin && (
                <div className="admin-card-actions">
                  <button 
                    className="admin-btn-action admin-btn-edit"
                    onClick={() => { setSelectedCategory(category); setEditCategory({ name: category.name, description: category.description || '', image: null }); setImagePreview(''); setShowEditModal(true); }}
                  >
                    <FiEdit3 /> Edit
                  </button>
                  <button 
                    className="admin-btn-action admin-btn-delete"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isAdmin && showEditModal && selectedCategory && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Edit Property Type</h2>
              <button className="admin-modal-close" onClick={() => {setShowEditModal(false); setEditCategory({ name: '', description: '', image: null }); setImagePreview(''); setError(''); }}><FiX /></button>
            </div>
            <form onSubmit={updateCategory}>
              <div className="admin-form-group">
                <label className="admin-form-label">Category Name *</label>
                <input 
                  type="text" 
                  className="admin-form-input"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                  placeholder="e.g. Villa, Apartment, Studio"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea 
                  className="admin-form-input"
                  value={editCategory.description}
                  onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Change Image (Optional)</label>
                <div className="admin-upload-wrap" onClick={() => document.getElementById('edit-image').click()}>
                  {imagePreview || selectedCategory.image ? (
                    <div className="admin-upload-preview">
                      <img src={imagePreview || getImageUrl(selectedCategory.image)} alt="Preview" />
                    </div>
                  ) : (
                    <>
                      <FiUpload className="admin-upload-icon" />
                      <p className="admin-upload-text">Click to change image</p>
                    </>
                  )}
                  <input id="edit-image" type="file" accept="image/*" onChange={(e) => handleImageChange(e)} style={{display: 'none'}} />
                </div>
              </div>
              {error && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</div>}
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-action admin-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-action admin-btn-edit" disabled={uploadLoading}>
                  {uploadLoading ? <FiLoader className="spin" /> : <FiEdit3 />}
                  {uploadLoading ? 'Updating...' : 'Update Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTypesPage;