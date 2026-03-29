import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import {
  FiHome, FiTag, FiMapPin, FiKey,
  FiDroplet, FiFileText, FiImage, FiArrowLeft,
  FiCheck, FiChevronRight, FiUploadCloud, FiTrash2
} from 'react-icons/fi';

const addPropertyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .add-prop-page { 
    font-family: 'DM Sans', sans-serif; 
    padding: 20px 16px 60px 16px; 
    max-width: 900px; 
    margin: 0 auto; 
  }
  
  .add-prop-breadcrumb { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    font-size: 0.75rem; 
    color: rgba(46,64,32,0.45); 
    margin-bottom: 24px; 
    flex-wrap: wrap;
  }
  
  .add-prop-breadcrumb a { 
    color: rgba(46,64,32,0.45); 
    text-decoration: none; 
    transition: color 0.18s; 
  }
  
  .add-prop-breadcrumb a:hover { 
    color: #4CBB17; 
  }
  
  .add-prop-breadcrumb svg { 
    width: 12px; 
    height: 12px; 
    opacity: 0.40; 
  }
  
  .add-prop-breadcrumb span { 
    color: #2e4020; 
    font-weight: 600; 
  }
  
  .add-prop-header { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    margin-bottom: 28px; 
    gap: 16px; 
    flex-wrap: wrap; 
  }
  
  .add-prop-header-left { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    flex: 1;
  }
  
  .add-prop-back-btn { 
    width: 40px; 
    height: 40px; 
    border-radius: 10px; 
    border: 1.5px solid rgba(76,187,23,0.28); 
    background: #ffffff; 
    color: #2e4020; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    font-size: 1rem; 
    transition: all 0.18s; 
    flex-shrink: 0; 
  }
  
  .add-prop-back-btn:hover { 
    background: #4CBB17; 
    border-color: #4CBB17; 
    color: #ffffff; 
  }
  
  .add-prop-eyebrow { 
    display: inline-flex; 
    align-items: center; 
    gap: 6px; 
    font-size: 0.65rem; 
    font-weight: 700; 
    letter-spacing: 0.13em; 
    text-transform: uppercase; 
    color: #3a9912; 
    margin-bottom: 6px; 
    padding: 3px 12px; 
    background: rgba(76,187,23,0.10); 
    border: 1px solid rgba(76,187,23,0.26); 
    border-radius: 100px; 
    white-space: nowrap;
  }
  
  .add-prop-eyebrow::before { 
    content: ''; 
    width: 5px; 
    height: 5px; 
    border-radius: 50%; 
    background: #4CBB17; 
    box-shadow: 0 0 5px #4CBB17; 
  }
  
  .add-prop-title { 
    font-family: 'DM Serif Display', serif; 
    font-size: clamp(1.5rem, 5vw, 2.3rem); 
    color: #0d1a08; 
    margin: 0; 
    letter-spacing: -0.02em; 
    line-height: 1.1; 
  }
  
  .add-prop-title em { 
    font-style: italic; 
    color: #3a9912; 
  }
  
  .add-prop-card { 
    background: #ffffff; 
    border: 1.5px solid rgba(76,187,23,0.20); 
    border-radius: 18px; 
    box-shadow: 0 4px 24px rgba(15,26,10,0.07); 
    overflow: hidden; 
    margin-bottom: 20px; 
  }
  
  .add-prop-section { 
    padding: 20px 20px; 
    border-bottom: 1px solid rgba(76,187,23,0.10); 
    background: #ffffff; 
  }
  
  .add-prop-section:nth-child(even) { 
    background: #fafef6; 
  }
  
  .add-prop-section:last-child { 
    border-bottom: none; 
  }
  
  .add-prop-section-heading { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-bottom: 20px; 
  }
  
  .add-prop-section-icon { 
    width: 32px; 
    height: 32px; 
    border-radius: 8px; 
    background: #4CBB17; 
    color: #ffffff; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 0.9rem; 
    flex-shrink: 0; 
    box-shadow: 0 2px 8px rgba(76,187,23,0.30); 
  }
  
  .add-prop-section-title { 
    font-size: 0.9rem; 
    font-weight: 700; 
    color: #0d1a08; 
    margin: 0; 
    letter-spacing: 0.01em; 
  }
  
  .add-prop-section-desc { 
    font-size: 0.7rem; 
    color: rgba(46,64,32,0.45); 
    margin: 0; 
  }
  
  .add-prop-grid-1 { 
    display: grid; 
    gap: 16px; 
  }
  
  .add-prop-grid-2 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 16px; 
  }
  
  .add-prop-grid-3 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 16px; 
  }
  
  .add-prop-field { 
    display: flex; 
    flex-direction: column; 
    gap: 7px; 
  }
  
  .add-prop-label { 
    font-size: 0.75rem; 
    font-weight: 600; 
    color: #2e4020; 
    display: flex; 
    align-items: center; 
    gap: 5px; 
  }
  
  .add-prop-label svg { 
    color: #4CBB17; 
    width: 12px; 
    height: 12px; 
  }
  
  .add-prop-label .req { 
    color: #4CBB17; 
    font-size: 0.85em; 
  }
  
  .add-prop-input { 
    width: 100%; 
    padding: 10px 12px; 
    border: 1.5px solid rgba(76,187,23,0.26); 
    border-radius: 9px; 
    font-family: 'DM Sans', sans-serif; 
    font-size: 0.85rem; 
    color: #0d1a08; 
    background: #ffffff; 
    outline: none; 
    box-sizing: border-box; 
    transition: all 0.2s; 
  }
  
  .add-prop-input:focus { 
    border-color: #4CBB17; 
    box-shadow: 0 0 0 3px rgba(76,187,23,0.12); 
  }
  
  textarea.add-prop-input { 
    resize: vertical; 
    min-height: 120px; 
    line-height: 1.6; 
  }
  
  .add-prop-input-wrap { 
    position: relative; 
  }
  
  .add-prop-prefix { 
    position: absolute; 
    left: 12px; 
    top: 50%; 
    transform: translateY(-50%); 
    font-size: 0.8rem; 
    font-weight: 700; 
    color: #3a9912; 
    pointer-events: none; 
  }
  
  .add-prop-input.prefixed { 
    padding-left: 40px; 
  }
  
  .add-prop-stepper { 
    display: flex; 
    align-items: center; 
    border: 1.5px solid rgba(76,187,23,0.26); 
    border-radius: 9px; 
    overflow: hidden; 
  }
  
  .add-prop-stepper-btn { 
    width: 40px; 
    height: 40px; 
    border: none; 
    background: #f4fced; 
    color: #3a9912; 
    font-size: 1rem; 
    cursor: pointer; 
    user-select: none; 
    -webkit-tap-highlight-color: transparent; 
    transition: background 0.2s; 
  }
  
  .add-prop-stepper-btn:hover:not(:disabled) { 
    background: #e8f5e2; 
  }
  
  .add-prop-stepper-btn:active { 
    transform: scale(0.98); 
  }
  
  .add-prop-stepper-btn:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
  
  .add-prop-stepper-input { 
    flex: 1; 
    border: none; 
    outline: none; 
    text-align: center; 
    font-weight: 600; 
    width: 48px; 
    font-size: 0.9rem; 
    background: white; 
  }

  /* ── MULTI-IMAGE GALLERY ──────────────────────── */
  .add-prop-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    margin-top: 20px;
  }

  .add-prop-img-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    border: 1.5px solid rgba(76,187,23,0.15);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    background: #f8fdf3;
  }

  .add-prop-img-item img {
    width: 100%; 
    height: 100%;
    object-fit: cover;
  }

  .add-prop-img-remove {
    position: absolute;
    top: 6px; 
    right: 6px;
    width: 26px; 
    height: 26px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    color: #dc2626;
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    transition: all 0.2s;
    z-index: 5;
  }

  .add-prop-img-remove:hover {
    background: #dc2626;
    color: #ffffff;
  }

  .add-prop-dropzone {
    border: 2px dashed rgba(76,187,23,0.35);
    border-radius: 14px;
    padding: 28px 16px;
    text-align: center;
    background: #fafef6;
    transition: all 0.2s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .add-prop-dropzone.dragging { 
    background: #f0fbe8; 
    border-color: #4CBB17; 
    transform: scale(1.005); 
  }
  
  .add-prop-dropzone svg { 
    font-size: 2rem; 
    color: #4CBB17; 
    opacity: 0.7; 
  }
  
  .add-prop-dropzone p { 
    margin: 0; 
    font-size: 0.85rem; 
    color: #2e4020; 
    font-weight: 500; 
  }
  
  .add-prop-dropzone span { 
    font-size: 0.7rem; 
    color: rgba(46,64,32,0.45); 
  }

  .add-prop-actions { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    justify-content: flex-end; 
    flex-wrap: wrap;
    margin-top: 20px;
  }
  
  .add-prop-submit-btn { 
    padding: 12px 24px; 
    border-radius: 9px; 
    background: #4CBB17; 
    color: #ffffff; 
    font-weight: 700; 
    border: none; 
    box-shadow: 0 4px 14px rgba(76,187,23,0.35); 
    transition: all 0.2s; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    font-size: 0.85rem;
  }
  
  .add-prop-submit-btn:hover { 
    background: #3a9912; 
    transform: translateY(-1px); 
    box-shadow: 0 6px 18px rgba(76,187,23,0.45); 
  }
  
  .add-prop-cancel-link { 
    font-size: 0.85rem; 
    font-weight: 600; 
    color: rgba(46,64,32,0.50); 
    text-decoration: none; 
    padding: 12px 16px;
  }
  
  .add-prop-cancel-link:hover { 
    color: #2e4020; 
  }

  /* Mobile Responsive Styles */
  @media (min-width: 768px) {
    .add-prop-page {
      padding: 32px 24px 80px 24px;
    }
    
    .add-prop-grid-2 {
      grid-template-columns: 1fr 1fr;
    }
    
    .add-prop-grid-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    
    .add-prop-section {
      padding: 28px 32px;
    }
    
    .add-prop-gallery {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 767px) {
    .add-prop-header-left {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .add-prop-back-btn {
      position: absolute;
      top: 20px;
      left: 16px;
    }
    
    .add-prop-header-left {
      padding-left: 48px;
    }
    
    .add-prop-eyebrow {
      white-space: normal;
      font-size: 0.6rem;
    }
    
    .add-prop-actions {
      justify-content: center;
    }
    
    .add-prop-submit-btn {
      flex: 1;
      justify-content: center;
    }
    
    .add-prop-cancel-link {
      text-align: center;
      flex: 1;
    }
    
    .add-prop-stepper-btn {
      width: 44px;
      height: 44px;
      font-size: 1.1rem;
    }
    
    .add-prop-stepper-input {
      font-size: 1rem;
    }
    
    .location-suggestions {
      max-height: 200px;
      overflow-y: auto;
    }
  }

  @media (max-width: 480px) {
    .add-prop-page {
      padding: 16px 12px 40px 12px;
    }
    
    .add-prop-back-btn {
      width: 36px;
      height: 36px;
      top: 16px;
      left: 12px;
    }
    
    .add-prop-header-left {
      padding-left: 44px;
    }
    
    .add-prop-title {
      font-size: 1.4rem;
    }
    
    .add-prop-section {
      padding: 16px;
    }
    
    .add-prop-section-heading {
      gap: 8px;
    }
    
    .add-prop-section-icon {
      width: 28px;
      height: 28px;
      font-size: 0.8rem;
    }
    
    .add-prop-section-title {
      font-size: 0.85rem;
    }
    
    .add-prop-section-desc {
      font-size: 0.65rem;
    }
    
    .add-prop-input {
      font-size: 0.8rem;
      padding: 8px 10px;
    }
    
    .add-prop-label {
      font-size: 0.7rem;
    }
    
    .add-prop-gallery {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .add-prop-dropzone {
      padding: 20px 12px;
    }
    
    .add-prop-dropzone svg {
      font-size: 1.8rem;
    }
    
    .add-prop-dropzone p {
      font-size: 0.8rem;
    }
    
    .add-prop-dropzone span {
      font-size: 0.65rem;
    }
    
    .add-prop-actions {
      gap: 8px;
    }
    
    .add-prop-submit-btn {
      padding: 10px 20px;
      font-size: 0.8rem;
    }
    
    .add-prop-cancel-link {
      padding: 10px 12px;
      font-size: 0.8rem;
    }
  }

  /* Touch-friendly improvements */
  @media (hover: none) and (pointer: coarse) {
    .add-prop-stepper-btn,
    .add-prop-back-btn,
    .add-prop-submit-btn,
    .add-prop-dropzone {
      cursor: default;
    }
    
    .add-prop-input,
    .add-prop-stepper-input,
    select.add-prop-input {
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }

  /* Location suggestions styling */
  .location-suggestions {
    margin-top: 8px;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid rgba(76,187,23,0.26);
    border-radius: 9px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .location-suggestion-item {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid rgba(76,187,23,0.1);
    font-size: 0.8rem;
    transition: background 0.2s;
  }
  
  .location-suggestion-item:hover {
    background: #f0fbe8;
  }
  
  .location-suggestion-item:last-child {
    border-bottom: none;
  }
  
  .location-coords {
    font-size: 0.7rem;
    color: #3a9912;
    margin-top: 4px;
    display: block;
  }
`;

const AddProperty = ({ refresh }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    title: '', price: '', city: '', location: '', description: '',
    bedrooms: 0, bathrooms: 0, category: '', latitude: null, longitude: null
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const locationInputRef = useRef(null);

  if (typeof document !== 'undefined' && !document.getElementById('add-prop-multi-styles')) {
    const tag = document.createElement('style');
    tag.id = 'add-prop-multi-styles';
    tag.textContent = addPropertyStyles;
    document.head.appendChild(tag);
  }

  const set = (key) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [key]: key === 'bedrooms' || key === 'bathrooms' ? (parseInt(value) || 0) : value }));
  };

  const incrementBedrooms = () => setFormData(prev => ({ ...prev, bedrooms: Math.min(20, (parseInt(prev.bedrooms) || 0) + 1) }));
  const decrementBedrooms = () => setFormData(prev => ({ ...prev, bedrooms: Math.max(0, (parseInt(prev.bedrooms) || 0) - 1) }));
  const incrementBathrooms = () => setFormData(prev => ({ ...prev, bathrooms: Math.min(20, (parseInt(prev.bathrooms) || 0) + 1) }));
  const decrementBathrooms = () => setFormData(prev => ({ ...prev, bathrooms: Math.max(0, (parseInt(prev.bathrooms) || 0) - 1) }));

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
    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);
    const newUrls = validFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const onFileSelect = (e) => handleFiles(e.target.files);
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const urlToRevoke = prev[index];
      URL.revokeObjectURL(urlToRevoke);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['title', 'price', 'city', 'location', 'description'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill ${field}`);
        return;
      }
    }

    setSaving(true);
    const data = new FormData();

    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    selectedFiles.forEach(file => data.append('images', file));

    try {
      await apiCall({
        method: 'post',
        url: '/admin/properties',
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (refresh) refresh();
      navigate('/admin/dashboard/properties');
    } catch (err) {
      console.error(err);
      alert('Failed to create property. Check console. Backend now auto-handles categories.');
    }
    setSaving(false);
  };

  return (
    <div className="add-prop-page">
      <div className="add-prop-breadcrumb">
        <Link to="/admin/dashboard">Dashboard</Link>
        <FiChevronRight />
        <Link to="/admin/dashboard/properties">Properties</Link>
        <FiChevronRight />
        <span>Add New</span>
      </div>

      <div className="add-prop-header">
        <div className="add-prop-header-left">
          <button className="add-prop-back-btn" onClick={() => navigate('/admin/dashboard/properties')}>
            <FiArrowLeft />
          </button>
          <div>
            <div className="add-prop-eyebrow">Properties / New Listing</div>
            <h1 className="add-prop-title">Add <em>Property</em></h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="add-prop-card">
          <div className="add-prop-section">
            <div className="add-prop-section-heading">
              <div className="add-prop-section-icon"><FiHome /></div>
              <div>
                <p className="add-prop-section-title">Basic Information</p>
                <p className="add-prop-section-desc">Title, price and location of the property</p>
              </div>
            </div>
            <div className="add-prop-grid-1">
              <div className="add-prop-field">
                <label className="add-prop-label">Property Title <span className="req">*</span></label>
                <input className="add-prop-input" value={formData.title} onChange={set('title')} required placeholder="e.g. Luxury Sea-View Villa" />
              </div>
              <div className="add-prop-grid-2">
                <div className="add-prop-field">
                  <label className="add-prop-label"><FiTag /> Price / Night <span className="req">*</span></label>
                  <div className="add-prop-input-wrap">
                    <span className="add-prop-prefix">Rs.</span>
                    <input className="add-prop-input prefixed" type="number" value={formData.price} onChange={set('price')} required placeholder="5,000" />
                  </div>
                </div>
                <div className="add-prop-field">
                  <label className="add-prop-label">City <span className="req">*</span></label>
                  <input
                    className="add-prop-input"
                    value={formData.city}
                    onChange={set('city')}
                    placeholder="e.g. Lahore"
                    required
                  />
                </div>
              </div>
              <div className="add-prop-field">
                <label className="add-prop-label"><FiMapPin /> Location <span className="req">*</span></label>
                <input
                  className="add-prop-input"
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Start typing address (e.g. Lahore Road)..."
                  required
                />
                {geocodingLoading && <small style={{ color: '#3a9912', fontSize: '0.7rem' }}>Searching...</small>}
                {locationSuggestions.length > 0 && (
                  <div className="location-suggestions">
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="location-suggestion-item"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        {suggestion.display_name}
                        <span className="location-coords">
                          📍 {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {formData.latitude && !geocodingLoading && (
                  <small style={{ fontSize: '0.7rem', color: '#3a9912', marginTop: '4px' }}>
                    📍 Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="add-prop-section">
            <div className="add-prop-section-heading">
              <div className="add-prop-section-icon"><FiKey /></div>
              <div>
                <p className="add-prop-section-title">Room Details</p>
                <p className="add-prop-section-desc">Beds, baths and property category</p>
              </div>
            </div>

            <div className="add-prop-grid-3">
              <div className="add-prop-field">
                <label className="add-prop-label"><FiKey /> Bedrooms</label>
                <div className="add-prop-stepper">
                  <button type="button" className="add-prop-stepper-btn" onClick={decrementBedrooms} disabled={formData.bedrooms <= 0}>−</button>
                  <input
                    className="add-prop-stepper-input"
                    type="number"
                    min="0"
                    max="20"
                    step="1"
                    value={formData.bedrooms}
                    onChange={set('bedrooms')}
                  />
                  <button type="button" className="add-prop-stepper-btn" onClick={incrementBedrooms}>+</button>
                </div>
              </div>
              <div className="add-prop-field">
                <label className="add-prop-label"><FiDroplet /> Bathrooms</label>
                <div className="add-prop-stepper">
                  <button type="button" className="add-prop-stepper-btn" onClick={decrementBathrooms} disabled={formData.bathrooms <= 0}>−</button>
                  <input
                    className="add-prop-stepper-input"
                    type="number"
                    min="0"
                    max="20"
                    step="1"
                    value={formData.bathrooms}
                    onChange={set('bathrooms')}
                  />
                  <button type="button" className="add-prop-stepper-btn" onClick={incrementBathrooms}>+</button>
                </div>
              </div>
              <div className="add-prop-field">
                <label className="add-prop-label">Property Type</label>
                <select className="add-prop-input" value={formData.category} onChange={set('category')}>
                  <option value="">Select Property Type</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name} ({cat.propertyCount || 0} properties)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="add-prop-section">
            <div className="add-prop-section-heading">
              <div className="add-prop-section-icon"><FiFileText /></div>
              <div>
                <p className="add-prop-section-title">Description</p>
                <p className="add-prop-section-desc">Help guests understand what makes this property special</p>
              </div>
            </div>
            <div className="add-prop-field">
              <textarea className="add-prop-input" rows={5} value={formData.description} onChange={set('description')} placeholder="Describe the property..." />
            </div>
          </div>

          <div className="add-prop-section">
            <div className="add-prop-section-heading">
              <div className="add-prop-section-icon"><FiImage /></div>
              <div>
                <p className="add-prop-section-title">Property Gallery</p>
                <p className="add-prop-section-desc">Add as many images as you like. Drag and drop supported.</p>
              </div>
            </div>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileSelect} accept="image/*" multiple />

            <div
              className={`add-prop-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <FiUploadCloud />
              <p>Tap or drag images here</p>
              <span>JPG, PNG, WEBP — Select multiple</span>
            </div>

            {previewUrls.length > 0 && (
              <div className="add-prop-gallery">
                {previewUrls.map((url, i) => (
                  <div className="add-prop-img-item" key={url}>
                    <img src={url} alt={`Preview ${i}`} />
                    <div className="add-prop-img-remove" onClick={(e) => { e.stopPropagation(); removeImage(i); }}>
                      <FiTrash2 />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="add-prop-actions">
          <Link to="/admin/dashboard/properties" className="add-prop-cancel-link">Cancel</Link>
          <button type="submit" className="add-prop-submit-btn" disabled={saving}>
            <FiCheck /> {saving ? 'Creating…' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;