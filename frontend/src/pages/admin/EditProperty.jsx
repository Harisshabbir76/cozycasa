import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { 
  FiHome, FiTag, FiMapPin, FiKey, 
  FiDroplet, FiFileText, FiImage, FiArrowLeft,
  FiCheck, FiChevronRight, FiUploadCloud, FiTrash2
} from 'react-icons/fi';

const editPropertyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .edit-prop-page { font-family: 'DM Sans', sans-serif; padding-bottom: 80px; max-width: 900px; margin: 0 auto; }
  .edit-prop-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(46,64,32,0.45); margin-bottom: 28px; }
  .edit-prop-breadcrumb a { color: rgba(46,64,32,0.45); text-decoration: none; transition: color 0.18s; }
  .edit-prop-breadcrumb a:hover { color: #4CBB17; }
  .edit-prop-breadcrumb svg { width: 12px; height: 12px; opacity: 0.40; }
  .edit-prop-breadcrumb span { color: #2e4020; font-weight: 600; }
  .edit-prop-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; gap: 16px; flex-wrap: wrap; }
  .edit-prop-header-left { display: flex; align-items: center; gap: 16px; }
  .edit-prop-back-btn { width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid rgba(76,187,23,0.28); background: #ffffff; color: #2e4020; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1rem; transition: all 0.18s; flex-shrink: 0; }
  .edit-prop-back-btn:hover { background: #4CBB17; border-color: #4CBB17; color: #ffffff; }
  .edit-prop-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: #3a9912; margin-bottom: 6px; padding: 3px 12px; background: rgba(76,187,23,0.10); border: 1px solid rgba(76,187,23,0.26); border-radius: 100px; }
  .edit-prop-eyebrow::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #4CBB17; box-shadow: 0 0 5px #4CBB17; }
  .edit-prop-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.7rem, 2.5vw, 2.3rem); color: #0d1a08; margin: 0; letter-spacing: -0.02em; line-height: 1.1; }
  .edit-prop-title em { font-style: italic; color: #3a9912; }
  .edit-prop-card { background: #ffffff; border: 1.5px solid rgba(76,187,23,0.20); border-radius: 18px; box-shadow: 0 4px 24px rgba(15,26,10,0.07); overflow: hidden; margin-bottom: 24px; }
  .edit-prop-section { padding: 28px 32px; border-bottom: 1.5px solid rgba(76,187,23,0.10); background: #ffffff; }
  .edit-prop-section:nth-child(even) { background: #fafef6; }
  .edit-prop-section:last-child { border-bottom: none; }
  .edit-prop-section-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
  .edit-prop-section-icon { width: 32px; height: 32px; border-radius: 8px; background: #4CBB17; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(76,187,23,0.30); }
  .edit-prop-section-title { font-size: 0.9rem; font-weight: 700; color: #0d1a08; margin: 0; letter-spacing: 0.01em; }
  .edit-prop-section-desc { font-size: 0.75rem; color: rgba(46,64,32,0.45); margin: 0; }
  .edit-prop-grid-1 { display: grid; gap: 16px; }
  .edit-prop-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .edit-prop-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .edit-prop-field { display: flex; flex-direction: column; gap: 7px; }
  .edit-prop-label { font-size: 0.78rem; font-weight: 600; color: #2e4020; display: flex; align-items: center; gap: 5px; }
  .edit-prop-label svg { color: #4CBB17; width: 12px; height: 12px; }
  .edit-prop-label .req { color: #4CBB17; font-size: 0.85em; }
  .edit-prop-input { width: 100%; padding: 11px 14px; border: 1.5px solid rgba(76,187,23,0.26); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #0d1a08; background: #ffffff; outline: none; box-sizing: border-box; transition: all 0.2s; }
  .edit-prop-input:focus { border-color: #4CBB17; box-shadow: 0 0 0 3px rgba(76,187,23,0.12); }
  textarea.edit-prop-input { resize: vertical; min-height: 130px; line-height: 1.65; }
  .edit-prop-input-wrap { position: relative; }
  .edit-prop-prefix { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 0.82rem; font-weight: 700; color: #3a9912; pointer-events: none; }
  .edit-prop-input.prefixed { padding-left: 44px; }
  .edit-prop-stepper { display: flex; align-items: center; border: 1.5px solid rgba(76,187,23,0.26); border-radius: 9px; overflow: hidden; }
  .edit-prop-stepper-btn { width: 42px; height: 42px; border: none; background: #f4fced; color: #3a9912; font-size: 1.1rem; cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; transition: background 0.2s; }
  .edit-prop-stepper-btn:hover:not(:disabled) { background: #e8f5e2; }
  .edit-prop-stepper-btn:active { transform: scale(0.98); }
  .edit-prop-stepper-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .edit-prop-stepper-input { flex: 1; border: none; outline: none; text-align: center; font-weight: 600; width: 48px; font-size: 1rem; background: white; }

  /* ── MULTI-IMAGE GALLERY ──────────────────────── */
  .edit-prop-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin-top: 20px; }
  .edit-prop-img-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; border: 1.5px solid rgba(76,187,23,0.15); box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #f8fdf3; }
  .edit-prop-img-item img { width: 100%; height: 100%; object-fit: cover; }
  .edit-prop-img-remove { position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.92); color: #dc2626; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.85rem; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s; z-index: 5; }
  .edit-prop-img-remove:hover { background: #dc2626; color: #ffffff; }
  .edit-prop-dropzone { border: 2px dashed rgba(76,187,23,0.35); border-radius: 14px; padding: 32px 20px; text-align: center; background: #fafef6; transition: all 0.2s; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .edit-prop-dropzone.dragging { background: #f0fbe8; border-color: #4CBB17; transform: scale(1.005); }
  .edit-prop-dropzone svg { font-size: 2.2rem; color: #4CBB17; opacity: 0.7; }
  .edit-prop-dropzone p { margin: 0; font-size: 0.88rem; color: #2e4020; font-weight: 500; }
  .edit-prop-dropzone span { font-size: 0.72rem; color: rgba(46,64,32,0.45); }
  .edit-prop-actions { display: flex; align-items: center; gap: 14px; justify-content: flex-end; }
  .edit-prop-submit-btn { padding: 12px 28px; border-radius: 9px; background: #4CBB17; color: #ffffff; font-weight: 700; border: none; box-shadow: 0 4px 14px rgba(76,187,23,0.35); transition: all 0.2s; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .edit-prop-submit-btn:hover { background: #3a9912; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(76,187,23,0.45); }
  .edit-prop-cancel-link { font-size: 0.9rem; font-weight: 600; color: rgba(46,64,32,0.50); text-decoration: none; }
  .edit-prop-cancel-link:hover { color: #2e4020; }
`;

const EditProperty = ({ properties, refresh }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  
  const [existingImages, setExistingImages] = useState([]); 
  const [newFiles, setNewFiles] = useState([]); 
  const [newPreviews, setNewPreviews] = useState([]); 
  
  const [formData, setFormData] = useState({
    title: '', price: '', city: '', location: '', description: '',
    bedrooms: 1, bathrooms: 1, categoryId: '', latitude: null, longitude: null
  });
  const [categories, setCategories] = useState([]);
  const [, setLoadingCategories] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [geocodingLoading, setGeocodingLoading] = useState(false);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await apiCall({ method: 'get', url: '/categories' });
        setCategories(res || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  if (typeof document !== 'undefined' && !document.getElementById('edit-prop-multi-styles')) {
    const tag = document.createElement('style');
    tag.id = 'edit-prop-multi-styles';
    tag.textContent = editPropertyStyles;
    document.head.appendChild(tag);
  }

  useEffect(() => {
    if (id && properties) {
      const p = properties.find(x => x._id === id);
      if (p) { 
        setFormData({
          title: p.title || '',
          price: p.price || '',
          city: p.city || '',
          location: p.location || '',
          description: p.description || '',
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          categoryId: p.category?._id || ''
        });
        setExistingImages(p.images || []);
      }
    }
  }, [id, properties]);

  const set = (key) => (e) => {
    let value = e.target.value;
    if (key === 'price') value = parseFloat(value) || '';
    else if (key === 'bedrooms' || key === 'bathrooms') value = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const incrementBedrooms = () => setFormData(prev => ({ ...prev, bedrooms: Math.min(20, (parseInt(prev.bedrooms) || 0) + 1) }));
  const decrementBedrooms = () => setFormData(prev => ({ ...prev, bedrooms: Math.max(0, (parseInt(prev.bedrooms) || 0) - 1) }));
  const incrementBathrooms = () => setFormData(prev => ({ ...prev, bathrooms: Math.min(20, (parseInt(prev.bathrooms) || 0) + 1) }));
  const decrementBathrooms = () => setFormData(prev => ({ ...prev, bathrooms: Math.max(0, (parseInt(prev.bathrooms) || 0) - 1) }));

  useEffect(() => {
    const value = formData.location.trim();
    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setGeocodingLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`, { signal: controller.signal });
        const data = await res.json();
        setLocationSuggestions(data.map(item => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        })));
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setGeocodingLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [formData.location]);

  const handleLocationSelect = (suggestion) => {
    setFormData(prev => ({ 
      ...prev, 
      location: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon 
    }));
    setLocationSuggestions([]);
  };

  const handleLocationChange = (e) => setFormData(prev => ({ ...prev, location: e.target.value }));

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    setNewFiles(prev => [...prev, ...validFiles]);
    const urls = validFiles.map(f => URL.createObjectURL(f));
    setNewPreviews(prev => [...prev, ...urls]);
  };

  const onFileSelect = (e) => handleFiles(e.target.files);
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };

  const removeExisting = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  const removeNew = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const getImageUrl = (url) => url.startsWith('http') ? url : `http://localhost:5000${url}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    
    // Handle category
    Object.keys(formData).forEach(k => data.append(k, formData[k])); 
    
    
    // Only append new images if present
    if (newFiles.length > 0) {
      newFiles.forEach(file => data.append('images', file));
    }
    try {
      const fullUrl = `/admin/properties/${id}`;
      await apiCall({ 
        method: 'put', 
        url: fullUrl,
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (refresh) refresh();
      navigate('/admin/dashboard/properties');
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  return (
    <div className="edit-prop-page">
      <div className="edit-prop-breadcrumb">
        <Link to="/admin/dashboard">Dashboard</Link>
        <FiChevronRight />
        <Link to="/admin/dashboard/properties">Properties</Link>
        <FiChevronRight />
        <span>Edit Property</span>
      </div>

      <div className="edit-prop-header">
        <div className="edit-prop-header-left">
          <button className="edit-prop-back-btn" onClick={() => navigate('/admin/dashboard/properties')}>
            <FiArrowLeft />
          </button>
          <div>
            <div className="edit-prop-eyebrow">Properties / Manage Listing</div>
            <h1 className="edit-prop-title">Edit <em>{formData.title || 'Property'}</em></h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="edit-prop-card">
          <div className="edit-prop-section">
            <div className="edit-prop-section-heading">
              <div className="edit-prop-section-icon"><FiHome /></div>
              <div><p className="edit-prop-section-title">Basic Information</p></div>
            </div>
            <div className="edit-prop-grid-1">
              <div className="edit-prop-field">
                <label className="edit-prop-label">Property Title <span className="req">*</span></label>
                <input className="edit-prop-input" value={formData.title} onChange={set('title')} required />
              </div>
              <div className="edit-prop-grid-2">
                <div className="edit-prop-field">
                  <label className="edit-prop-label"><FiTag /> Price / Night <span className="req">*</span></label>
                  <div className="edit-prop-input-wrap">
                    <span className="edit-prop-prefix">Rs.</span>
                    <input className="edit-prop-input prefixed" type="number" value={formData.price} onChange={set('price')} required />
                  </div>
                </div>
                <div className="edit-prop-field">
                  <label className="edit-prop-label"><FiMapPin /> Location <span className="req">*</span></label>
                  <input 
                    className="edit-prop-input" 
                    value={formData.location} 
                    onChange={handleLocationChange}
                    placeholder="Start typing address (e.g. Lahore Road)..." 
                    required 
                  />
                  {geocodingLoading && <small>Loading...</small>}
                  {locationSuggestions.length > 0 && (
                    <div style={{ marginTop: '5px', maxHeight: '120px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
                      {locationSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          onClick={() => handleLocationSelect(suggestion)}
                          style={{ 
                            padding: '10px', 
                            cursor: 'pointer', 
                            borderBottom: '1px solid #eee' 
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          {suggestion.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.latitude && !geocodingLoading && (
                    <small style={{fontSize: '0.75rem', color: '#3a9912'}}>📍 Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}</small>
                  )}
                </div>
                <div className="edit-prop-field">
                  <label className="edit-prop-label">City <span className="req">*</span></label>
                  <input 
                    className="edit-prop-input"
                    value={formData.city}
                    onChange={set('city')}
                    placeholder="e.g. Lahore"
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="edit-prop-section">
            <div className="edit-prop-section-heading">
              <div className="edit-prop-section-icon"><FiKey /></div>
              <div><p className="edit-prop-section-title">Room Details</p></div>
            </div>
            <div className="edit-prop-grid-3">
                <div className="edit-prop-field">
                  <label className="edit-prop-label"><FiKey /> Bedrooms</label>
                  <div className="edit-prop-stepper">
                    <button type="button" className="edit-prop-stepper-btn" onClick={decrementBedrooms} disabled={formData.bedrooms <= 0} title="Decrease bedrooms">−</button>
                    <input 
                      className="edit-prop-stepper-input" 
                      type="number" 
                      min="0" 
                      max="20" 
                      step="1"
                      value={formData.bedrooms} 
                      onChange={set('bedrooms')}
                      style={{width: '48px'}}
                    />
                    <button type="button" className="edit-prop-stepper-btn" onClick={incrementBedrooms} title="Increase bedrooms">+</button>
                  </div>
                </div>

              <div className="edit-prop-field">
                <label className="edit-prop-label"><FiDroplet /> Bathrooms</label>
                <div className="edit-prop-stepper">
                  <button type="button" className="edit-prop-stepper-btn" onClick={decrementBathrooms} disabled={formData.bathrooms <= 0} title="Decrease bathrooms">−</button>
                  <input 
                    className="edit-prop-stepper-input" 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="1"
                    value={formData.bathrooms} 
                    onChange={set('bathrooms')}
                    style={{width: '48px'}}
                  />
                  <button type="button" className="edit-prop-stepper-btn" onClick={incrementBathrooms} title="Increase bathrooms">+</button>
                </div>
              </div>
              <div className="edit-prop-field">
                <label className="edit-prop-label">Property Type</label>
                <select className="edit-prop-input" value={formData.categoryId} onChange={set('categoryId')}>
                  <option value="">Select Property Type</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name} ({cat.propertyCount || 0} properties)</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <div className="edit-prop-section">
            <div className="edit-prop-section-heading">
              <div className="edit-prop-section-icon"><FiFileText /></div>
              <div><p className="edit-prop-section-title">Description</p></div>
            </div>
            <textarea className="edit-prop-input" rows={5} value={formData.description} onChange={set('description')} />
          </div>

          <div className="edit-prop-section">
            <div className="edit-prop-section-heading">
              <div className="edit-prop-section-icon"><FiImage /></div>
              <div>
                <p className="edit-prop-section-title">Property Gallery</p>
                <p className="edit-prop-section-desc">Manage your property images</p>
              </div>
            </div>
            
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileSelect} accept="image/*" multiple />
            
            <div 
              className={`edit-prop-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <FiUploadCloud />
              <p>Click or drag images to add more</p>
            </div>

            <div className="edit-prop-gallery">
              {existingImages.map((url, i) => (
                <div className="edit-prop-img-item" key={url}>
                  <img src={getImageUrl(url)} alt={`Existing ${i}`} />
                  <div className="edit-prop-img-remove" onClick={() => removeExisting(i)}>
                    <FiTrash2 />
                  </div>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div className="edit-prop-img-item" key={url} style={{ borderStyle: 'dashed', borderColor: '#4CBB17' }}>
                  <img src={url} alt={`New ${i}`} />
                  <div className="edit-prop-img-remove" onClick={() => removeNew(i)}>
                    <FiTrash2 />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="edit-prop-actions">
          <Link to="/admin/dashboard/properties" className="edit-prop-cancel-link">Cancel</Link>
          <button type="submit" className="edit-prop-submit-btn" disabled={saving}>
            <FiCheck /> {saving ? 'Saving…' : 'Update Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;

