import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { slugify, unsSlugify } from '../utils/slugify';
import PropertyCard from '../components/PropertyCard';
import { FiInbox, FiFilter, FiSearch, FiX } from 'react-icons/fi';
import './Properties.css';

const Properties = () => {
  const location = useLocation();
  const { type: routeType } = useParams();

  const getUrlFilters = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      propertyType: params.get('propertyType') || '',
      location: params.get('location') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      bedrooms: params.get('bedrooms') || ''
    };
  }, [location.search]);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(getUrlFilters());
  const [sort, setSort] = useState('createdAt_desc');
  const [categories, setCategories] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.filter(cat => cat.propertyCount > 0));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (routeType) params.append('propertyType', routeType);
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);

      const [field, order] = sort.split('_');
      params.append('sortBy', field);
      params.append('order', order);

      const res = await axios.get(`/api/properties?${params.toString()}`);
      setProperties(res.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, routeType]);

  useEffect(() => {
    const urlFilters = getUrlFilters();
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      setFilters(urlFilters);
    }
  }, [getUrlFilters, filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProperties();
  }, [filters, sort, fetchProperties]);

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    const params = new URLSearchParams();
    if (newFilters.search) params.append('search', newFilters.search);
    if (newFilters.location) params.append('location', newFilters.location);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
    if (newFilters.bedrooms) params.append('bedrooms', newFilters.bedrooms);

    const searchStr = params.toString();
    navigate(`/properties${searchStr ? `?${searchStr}` : ''}`, { replace: true });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    });
    navigate('/properties', { replace: true });
    setShowMobileFilters(false);
  };

  const removeSearchFilter = () => {
    const newFilters = { ...filters, search: '' };
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.location) params.append('location', newFilters.location);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
    if (newFilters.bedrooms) params.append('bedrooms', newFilters.bedrooms);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.location) count++;
    if (filters.propertyType) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.bedrooms) count++;
    return count;
  };

  return (
    <div className="properties-page">
      <header className="properties-header">
        <div className="container">
          <h1
            className="section-title"
            style={{
              color: 'white',
              textAlign: 'center',
              width: '100%',
              display: 'block',
            }}
          >
            {routeType ? `${unsSlugify(routeType)} Properties` : 'Available Properties'}
          </h1>
          <p style={{ opacity: 0.8, textAlign: 'center' }}>
            Discover your next home from our curated selection.
          </p>
        </div>
      </header>

      <main className="container">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-toggle">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FiFilter />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {getActiveFilterCount() > 0 && !showMobileFilters && (
              <span className="filter-badge">{getActiveFilterCount()}</span>
            )}
          </button>
        </div>

        {/* Filters Bar */}
        <div className={`filters-bar ${showMobileFilters ? 'mobile-filters-show' : ''}`}>
          <div className="filter-group filter-group-search">
            <label className="filter-label">
              <FiSearch size={12} /> Search
            </label>
            <div className="search-input-wrapper">
              <input
                type="text"
                name="search"
                className="filter-input"
                placeholder="Search by name, description..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              {filters.search && (
                <button className="clear-search-btn" onClick={removeSearchFilter}>
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Location</label>
            <input
              type="text"
              name="location"
              className="filter-input"
              placeholder="City or Area"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Property Type</label>
            <select
              name="propertyType"
              className="filter-input"
              value={filters.propertyType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {categories.map(cat => (
                <option key={cat._id} value={slugify(cat.name)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              className="filter-input"
              placeholder="Budget (Rs.)"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Bedrooms</label>
            <select
              name="bedrooms"
              className="filter-input"
              value={filters.bedrooms}
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="1">1+ BR</option>
              <option value="2">2+ BR</option>
              <option value="3">3+ BR</option>
              <option value="4">4+ BR</option>
              <option value="5">5+ BR</option>
            </select>
          </div>

          <div className="filter-group filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="active-filters">
            <span className="active-filters-label">Active Filters:</span>
            <div className="active-filters-list">
              {filters.search && (
                <span className="active-filter-tag">
                  Search: {filters.search}
                  <FiX size={12} onClick={removeSearchFilter} />
                </span>
              )}
              {filters.location && (
                <span className="active-filter-tag">
                  Location: {filters.location}
                  <FiX size={12} onClick={() => {
                    const newFilters = { ...filters, location: '' };
                    setFilters(newFilters);
                    const params = new URLSearchParams();
                    if (newFilters.search) params.append('search', newFilters.search);
                    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
                    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
                    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
                    if (newFilters.bedrooms) params.append('bedrooms', newFilters.bedrooms);
                    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
                  }} />
                </span>
              )}
              {filters.propertyType && (
                <span className="active-filter-tag">
                  Type: {categories.find(cat => slugify(cat.name) === filters.propertyType)?.name || filters.propertyType}
                  <FiX size={12} onClick={() => {
                    const newFilters = { ...filters, propertyType: '' };
                    setFilters(newFilters);
                    const params = new URLSearchParams();
                    if (newFilters.search) params.append('search', newFilters.search);
                    if (newFilters.location) params.append('location', newFilters.location);
                    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
                    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
                    if (newFilters.bedrooms) params.append('bedrooms', newFilters.bedrooms);
                    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
                  }} />
                </span>
              )}
              {filters.maxPrice && (
                <span className="active-filter-tag">
                  Max Price: Rs. {parseInt(filters.maxPrice).toLocaleString()}
                  <FiX size={12} onClick={() => {
                    const newFilters = { ...filters, maxPrice: '' };
                    setFilters(newFilters);
                    const params = new URLSearchParams();
                    if (newFilters.search) params.append('search', newFilters.search);
                    if (newFilters.location) params.append('location', newFilters.location);
                    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
                    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
                    if (newFilters.bedrooms) params.append('bedrooms', newFilters.bedrooms);
                    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
                  }} />
                </span>
              )}
              {filters.bedrooms && (
                <span className="active-filter-tag">
                  Bedrooms: {filters.bedrooms}+
                  <FiX size={12} onClick={() => {
                    const newFilters = { ...filters, bedrooms: '' };
                    setFilters(newFilters);
                    const params = new URLSearchParams();
                    if (newFilters.search) params.append('search', newFilters.search);
                    if (newFilters.location) params.append('location', newFilters.location);
                    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
                    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
                    if (newFilters.propertyType) params.append('propertyType', newFilters.propertyType);
                    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
                  }} />
                </span>
              )}
            </div>
            <button className="clear-all-filters-link" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          <p>Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="filter-label">Sort By:</span>
            <select
              className="filter-input"
              style={{ padding: '5px 10px', fontSize: '0.85rem', width: 'auto' }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Properties */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            Searching for properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="no-results">
            <FiInbox className="no-results-icon" />
            <h3>No Properties Found</h3>
            <p>Try adjusting your filters or search area.</p>
            <button onClick={clearFilters} className="clear-filters-btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map(property => (
              <div key={property._id} className="properties-grid-item">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Properties;