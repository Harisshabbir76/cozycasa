import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { slugify } from '../utils/slugify';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : `${backendUrl}${property.images[0]}`
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80';

  const getCityName = (property) => {
    if (property.city) return property.city;
    if (!property.location) return 'Location not specified';
    const parts = property.location.split(',').map((p) => p.trim());
    if (parts.length >= 2 && /\d/.test(parts[0])) return parts[1];
    return parts[0];
  };

  const cityName = getCityName(property);

  const roomInfo = [
    property.bedrooms > 0 ? `${property.bedrooms} BR` : null,
    property.bathrooms > 0 ? `${property.bathrooms} BA` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <div
      className="property-card"
      onClick={() => navigate(`/property/${property._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/property/${property._id}`)}
    >
      {/* Image */}
      <div className="card-image-container">
        <img src={imageUrl} alt={property.title} className="card-image" loading="lazy" />
        {/* Price badge — top-left, matching screenshot */}
        <div className="card-price-badge">
          Rs. {property.price.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        {/* Category + Room info row */}
        <div className="card-meta-row">
          <Link
            to={`/properties/${slugify(property.category?.name || 'property')}`}
            className="category-link"
            onClick={(e) => e.stopPropagation()}
          >
            {(property.category?.name || 'Property').toUpperCase()}
          </Link>
          {roomInfo && <span className="room-info">{roomInfo}</span>}
        </div>

        {/* Title */}
        <h3 className="card-title">{property.title}</h3>

        {/* Location */}
        <p className="location-info">
          <FiMapPin size={12} />
          <span>{cityName}</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;