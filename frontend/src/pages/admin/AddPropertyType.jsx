import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTag, FiUpload, FiLoader, FiPlus, FiCheck, FiTrash2, FiImage, FiInfo } from 'react-icons/fi';
import { apiCall } from '../../utils/api';

const addPropertyTypeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .add-type-page {
    font-family: 'DM Sans', sans-serif;
    padding: 20px 16px 60px 16px;
    max-width: 900px;
    margin: 0 auto;
  }

  /* Breadcrumb */
  .add-type-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: rgba(46,64,32,0.45);
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .add-type-breadcrumb a {
    color: rgba(46,64,32,0.45);
    text-decoration: none;
    transition: color 0.18s;
    cursor: pointer;
  }

  .add-type-breadcrumb a:hover {
    color: #4CBB17;
  }

  .add-type-breadcrumb svg {
    width: 12px;
    height: 12px;
    opacity: 0.40;
  }

  .add-type-breadcrumb span {
    color: #2e4020;
    font-weight: 600;
  }

  /* Header */
  .add-type-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .add-type-header-left {
    flex: 1;
  }

  .add-type-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #3a9912;
    margin-bottom: 8px;
    padding: 3px 12px;
    background: rgba(76,187,23,0.10);
    border: 1px solid rgba(76,187,23,0.26);
    border-radius: 100px;
  }

  .add-type-eyebrow::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #4CBB17;
    box-shadow: 0 0 5px #4CBB17;
  }

  .add-type-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.5rem, 5vw, 2.3rem);
    color: #0d1a08;
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .add-type-title em {
    font-style: italic;
    color: #3a9912;
  }

  .add-type-subtitle {
    font-size: 0.85rem;
    color: rgba(46,64,32,0.55);
    margin: 8px 0 0 0;
  }

  .add-type-back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: 1.5px solid rgba(76,187,23,0.28);
    border-radius: 10px;
    color: #2e4020;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .add-type-back-btn:hover {
    background: #f0fbe8;
    border-color: #4CBB17;
  }

  /* Form Card */
  .add-type-card {
    background: #ffffff;
    border: 1.5px solid rgba(76,187,23,0.20);
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(15,26,10,0.07);
    overflow: hidden;
    margin-bottom: 20px;
  }

  /* Form Sections */
  .add-type-section {
    padding: 24px 20px;
    border-bottom: 1px solid rgba(76,187,23,0.10);
  }

  .add-type-section:last-child {
    border-bottom: none;
  }

  .add-type-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .add-type-section-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #4CBB17;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(76,187,23,0.30);
  }

  .add-type-section-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0d1a08;
    margin: 0;
    letter-spacing: 0.01em;
  }

  .add-type-section-desc {
    font-size: 0.7rem;
    color: rgba(46,64,32,0.45);
    margin: 2px 0 0 0;
  }

  /* Form Groups */
  .add-type-form-group {
    margin-bottom: 20px;
  }

  .add-type-form-group:last-child {
    margin-bottom: 0;
  }

  .add-type-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2e4020;
    margin-bottom: 8px;
  }

  .add-type-label svg {
    color: #4CBB17;
    width: 14px;
    height: 14px;
  }

  .add-type-required {
    color: #4CBB17;
    font-size: 0.75rem;
    margin-left: 4px;
  }

  .add-type-input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid rgba(76,187,23,0.26);
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: #0d1a08;
    background: #ffffff;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .add-type-input:focus {
    border-color: #4CBB17;
    box-shadow: 0 0 0 3px rgba(76,187,23,0.12);
  }

  .add-type-input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }

  textarea.add-type-input {
    resize: vertical;
    min-height: 100px;
    line-height: 1.6;
  }

  /* Image Upload */
  .add-type-upload-area {
    border: 2px dashed rgba(76,187,23,0.35);
    border-radius: 14px;
    background: #fafef6;
    transition: all 0.2s;
    cursor: pointer;
    overflow: hidden;
  }

  .add-type-upload-area.dragging {
    background: #f0fbe8;
    border-color: #4CBB17;
    transform: scale(1.005);
  }

  .add-type-upload-placeholder {
    padding: 40px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .add-type-upload-placeholder svg {
    font-size: 2.5rem;
    color: #4CBB17;
    opacity: 0.7;
  }

  .add-type-upload-placeholder p {
    margin: 0;
    font-size: 0.9rem;
    color: #2e4020;
    font-weight: 500;
  }

  .add-type-upload-placeholder span {
    font-size: 0.7rem;
    color: rgba(46,64,32,0.45);
  }

  .add-type-image-preview {
    position: relative;
    width: 100%;
    min-height: 200px;
    background: #f8fdf3;
  }

  .add-type-image-preview img {
    width: 100%;
    height: auto;
    max-height: 250px;
    object-fit: cover;
    display: block;
  }

  .add-type-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .add-type-image-change-btn {
    background: rgba(255,255,255,0.9);
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #2e4020;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .add-type-image-change-btn:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .add-type-image-remove-btn {
    background: rgba(220,38,38,0.9);
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .add-type-image-remove-btn:hover {
    background: #dc2626;
  }

  /* Info Box */
  .add-type-info-box {
    background: linear-gradient(135deg, rgba(76,187,23,0.05), rgba(76,187,23,0.02));
    border-left: 3px solid #4CBB17;
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .add-type-info-box svg {
    color: #4CBB17;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .add-type-info-box p {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(46,64,32,0.7);
    line-height: 1.5;
  }

  /* Messages */
  .add-type-error {
    padding: 12px;
    background: #fff5f5;
    border: 1px solid #feb2b2;
    border-radius: 10px;
    color: #c53030;
    font-size: 0.85rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add-type-success {
    padding: 12px;
    background: #f0fff4;
    border: 1px solid #9ae6b4;
    border-radius: 10px;
    color: #276749;
    font-size: 0.85rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Actions */
  .add-type-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .add-type-btn {
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
  }

  .add-type-btn-cancel {
    background: transparent;
    border: 1.5px solid rgba(76,187,23,0.3);
    color: #2e4020;
  }

  .add-type-btn-cancel:hover:not(:disabled) {
    background: #f0fbe8;
    border-color: #4CBB17;
  }

  .add-type-btn-submit {
    background: #4CBB17;
    color: white;
    box-shadow: 0 2px 8px rgba(76,187,23,0.3);
  }

  .add-type-btn-submit:hover:not(:disabled) {
    background: #3a9912;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76,187,23,0.4);
  }

  .add-type-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading Spinner */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  /* Responsive Styles */
  @media (min-width: 768px) {
    .add-type-page {
      padding: 32px 24px 80px 24px;
    }

    .add-type-section {
      padding: 28px 32px;
    }

    .add-type-actions {
      justify-content: flex-end;
    }
  }

  @media (max-width: 767px) {
    .add-type-header {
      flex-direction: column;
      align-items: stretch;
    }

    .add-type-back-btn {
      justify-content: center;
    }

    .add-type-actions {
      flex-direction: column;
    }

    .add-type-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .add-type-page {
      padding: 16px 12px 40px 12px;
    }

    .add-type-section {
      padding: 20px 16px;
    }

    .add-type-section-icon {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
    }

    .add-type-section-title {
      font-size: 0.85rem;
    }

    .add-type-input {
      font-size: 0.8rem;
      padding: 8px 10px;
    }

    .add-type-label {
      font-size: 0.75rem;
    }

    .add-type-upload-placeholder {
      padding: 30px 16px;
    }

    .add-type-upload-placeholder svg {
      font-size: 2rem;
    }

    .add-type-upload-placeholder p {
      font-size: 0.8rem;
    }

    .add-type-image-overlay {
      flex-direction: column;
      align-items: stretch;
    }

    .add-type-image-change-btn,
    .add-type-image-remove-btn {
      justify-content: center;
    }
  }

  /* Touch-friendly improvements */
  @media (hover: none) and (pointer: coarse) {
    .add-type-btn,
    .add-type-upload-area,
    .add-type-back-btn {
      cursor: default;
    }

    .add-type-input,
    textarea.add-type-input {
      font-size: 16px;
    }
  }
`;

const AddPropertyType = ({ refresh }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Inject styles
  if (typeof document !== 'undefined' && !document.getElementById('add-type-styles')) {
    const tag = document.createElement('style');
    tag.id = 'add-type-styles';
    tag.textContent = addPropertyTypeStyles;
    document.head.appendChild(tag);
  }

  const handleImageChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size too large (max 5MB)');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      if (image) {
        formData.append('image', image);
      }

      const res = await apiCall({
        method: 'post',
        url: '/admin/property-types',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res) {
        setSuccess(true);
        if (refresh) refresh();
        setTimeout(() => {
          navigate('/admin/dashboard/property-types');
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.response?.data?.message || 'Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-type-page">
      {/* Breadcrumb */}
      <div className="add-type-breadcrumb">
        <button type="button" onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <button type="button" onClick={() => navigate('/admin/dashboard/property-types')}>Property Types</button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span>Add New</span>
      </div>

      {/* Header */}
      <div className="add-type-header">
        <div className="add-type-header-left">
          <div className="add-type-eyebrow">Admin / Property Types</div>
          <h1 className="add-type-title">Create <em>Category</em></h1>
          <p className="add-type-subtitle">Define a new property classification for your listings</p>
        </div>
        <button className="add-type-back-btn" onClick={() => navigate('/admin/dashboard/property-types')}>
          <FiArrowLeft /> Back to List
        </button>
      </div>

      {/* Form Card */}
      <div className="add-type-card">
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="add-type-section">
            <div className="add-type-section-header">
              <div className="add-type-section-icon">
                <FiTag />
              </div>
              <div>
                <h3 className="add-type-section-title">Basic Information</h3>
                <p className="add-type-section-desc">Essential details about the property category</p>
              </div>
            </div>

            <div className="add-type-form-group">
              <label className="add-type-label">
                <FiTag /> Category Name <span className="add-type-required">*</span>
              </label>
              <input 
                type="text" 
                className="add-type-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Villa, Apartment, Studio, Penthouse"
                required
                disabled={loading || success}
                autoFocus
              />
            </div>

            <div className="add-type-form-group">
              <label className="add-type-label">
                <FiInfo /> Description
              </label>
              <textarea 
                className="add-type-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Describe what makes this property type special..."
                disabled={loading || success}
              />
            </div>

            <div className="add-type-info-box">
              <FiInfo />
              <p>This description will help users understand what to expect from properties in this category.</p>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="add-type-section">
            <div className="add-type-section-header">
              <div className="add-type-section-icon">
                <FiImage />
              </div>
              <div>
                <h3 className="add-type-section-title">Category Image</h3>
                <p className="add-type-section-desc">Upload a representative image for this property type</p>
              </div>
            </div>

            <div className="add-type-form-group">
              <div 
                className={`add-type-upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !loading && !success && document.getElementById('type-image-input').click()}
              >
                {imagePreview ? (
                  <div className="add-type-image-preview">
                    <img src={imagePreview} alt="Category preview" />
                    <div className="add-type-image-overlay">
                      <button 
                        type="button" 
                        className="add-type-image-change-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('type-image-input').click();
                        }}
                      >
                        <FiUpload /> Change Image
                      </button>
                      <button 
                        type="button" 
                        className="add-type-image-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="add-type-upload-placeholder">
                    <FiUpload />
                    <p>Click to upload or drag & drop</p>
                    <span>Recommended: 800x600px, max 5MB. JPG, PNG, or WEBP</span>
                  </div>
                )}
                <input 
                  id="type-image-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={onFileSelect} 
                  style={{ display: 'none' }} 
                  disabled={loading || success}
                />
              </div>
            </div>

            {!imagePreview && (
              <div className="add-type-info-box">
                <FiImage />
                <p>A good category image helps users quickly identify the property type. We recommend using a high-quality representative photo.</p>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="add-type-error">
              <FiInfo size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="add-type-success">
              <FiCheck size={16} />
              Category created successfully! Redirecting to property types list...
            </div>
          )}

          {/* Form Actions */}
          <div className="add-type-section">
            <div className="add-type-actions">
              <button 
                type="button" 
                className="add-type-btn add-type-btn-cancel" 
                onClick={() => navigate('/admin/dashboard/property-types')}
                disabled={loading || success}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="add-type-btn add-type-btn-submit" 
                disabled={loading || success}
              >
                {loading ? <FiLoader className="spin" /> : <FiPlus />}
                {loading ? 'Creating Category...' : 'Create Property Type'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyType;