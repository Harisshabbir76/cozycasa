import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { guestAPI } from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiMapPin, FiUsers, FiBox, FiCheckCircle, FiDroplet, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import './PropertyDetail.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750';
  if (url.startsWith('http')) return url;
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  return `${backendUrl}${url}`;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkIn: null, checkOut: null, guests: 1 });
  const [availStatus, setAvailStatus] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await guestAPI.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (booking.checkIn && booking.checkOut && property) {
      const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
      if (nights > 0) setTotalPrice(nights * property.price);
    }
  }, [booking, property]);

  const checkAvailability = async () => {
    if (!booking.checkIn || !booking.checkOut) return alert('Select dates first');
    try {
      const res = await guestAPI.post('/bookings/check-availability', {
        propertyId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      });
      setAvailStatus(res.data.available ? 'available' : 'unavailable');
    } catch (err) { console.error(err); }
  };

  const handleBooking = () => {
    const nights = booking.checkIn && booking.checkOut ? Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24)) : 0;
    if (!booking.checkIn || !booking.checkOut || nights < 1 || totalPrice <= 0) {
      alert('Please select valid dates with at least 1 night stay. Total price must be greater than 0.');
      return;
    }
    navigate('/checkout', { state: { property, ...booking, totalPrice, nights } });
  };

  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) return <div className="container py-20 text-center">Loading property...</div>;
  if (!property) return <div className="container py-20 text-center">Property not found.</div>;

  const images = property.images && property.images.length > 0 ? property.images : [null];

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Image Slider Section */}
        <div className="slider-container">
          <div className="main-slider">
            <button className="slider-nav prev" onClick={prevImage}>
              <FiChevronLeft />
            </button>
            
            <div className="slider-image-wrapper" onClick={() => openLightbox(currentImageIndex)}>
              <img 
                src={getImageUrl(images[currentImageIndex])} 
                alt={`Property view ${currentImageIndex + 1}`}
                className="slider-main-image"
              />
            </div>
            
            <button className="slider-nav next" onClick={nextImage}>
              <FiChevronRight />
            </button>
            
            <div className="slider-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="thumbnail-container">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {showLightbox && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FiX />
            </button>
            <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <FiChevronLeft />
            </button>
            <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
              <img src={getImageUrl(images[currentImageIndex])} alt="Full size" />
              <div className="lightbox-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              <FiChevronRight />
            </button>
          </div>
        )}

        {/* Property Details */}
        <div className="property-details">
          <div className="property-info-header">
            <div>
              <h1 className="property-title">{property.title}</h1>
              <p className="property-location"><FiMapPin /> {property.location}</p>
            </div>
          </div>

          <div className="property-badges">
            {property.bedrooms > 0 && (
              <div className="badge-item"><FiUsers className="badge-icon" /> {property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
            )}
            {property.bathrooms > 0 && (
              <div className="badge-item"><FiDroplet className="badge-icon" /> {property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
            )}
            {property.category?.name && (
              <div className="badge-item"><FiBox className="badge-icon" /> {property.category.name}</div>
            )}
            <div className="badge-item"><FiCheckCircle className="badge-icon" /> Verified Property</div>
          </div>

          <p className="property-description">{property.description}</p>

          {/* Map Container */}
          <div className="map-container">
            <MapContainer center={[property.latitude || 31.5, property.longitude || 74.3]} zoom={15} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[property.latitude || 31.5, property.longitude || 74.3]}>
                <Popup>{property.title}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Booking Widget - Now Below Map */}
          <div className="booking-widget">
            <div className="price-tag">Rs. {property.price.toLocaleString()} <span>/ night</span></div>
            <div className="date-picker-group">
              <div className="date-input-wrap">
                <label className="filter-label">Check-in</label>
                <DatePicker 
                  selected={booking.checkIn} 
                  onChange={d => setBooking({...booking, checkIn: d})} 
                  className="filter-input w-full" 
                  placeholderText="Add date" 
                  minDate={new Date()} 
                />
              </div>
              <div className="date-input-wrap">
                <label className="filter-label">Check-out</label>
                <DatePicker 
                  selected={booking.checkOut} 
                  onChange={d => setBooking({...booking, checkOut: d})} 
                  className="filter-input w-full" 
                  placeholderText="Add date" 
                  minDate={Math.max(new Date(), booking.checkIn || new Date())} 
                />
              </div>
              <div className="date-input-wrap">
                <label className="filter-label">Guests</label>
                <select 
                  className="filter-input w-full" 
                  value={booking.guests} 
                  onChange={e => setBooking({...booking, guests: parseInt(e.target.value)})}
                >
                  {[...Array(property.guests || 6)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} Guest{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button className="btn-check-availability" onClick={checkAvailability}>
              Check Availability
            </button>

            {availStatus === 'available' && totalPrice > 0 && (
              <div className="avail-msg success">
                <p><strong>Available!</strong> Total: Rs. {totalPrice.toLocaleString()}</p>
                <button className="btn-reserve-now" onClick={handleBooking}>
                  Reserve Now
                </button>
              </div>
            )}
            {availStatus === 'unavailable' && (
              <div className="avail-msg error">
                Fully booked for these dates.
              </div>
            )}

            <div className="booking-card">
              <h3 className="interested-title">Interested?</h3>
              <p className="interested-text">Contact us on WhatsApp for any specific queries about this property.</p>
              <a href={`https://wa.me/${(process.env.REACT_APP_WHATSAPP_NUMBER || '+923471091917').replace(/\D/g, '')}?text=${encodeURIComponent(`Hey, I am interested in your property "${property.title}" located in ${property.location}. I want to know more about it!`)}`} target="_blank" rel="noreferrer" className="btn-whatsapp">
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;