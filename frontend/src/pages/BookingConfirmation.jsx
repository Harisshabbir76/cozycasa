import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiUser, FiMapPin, FiCalendar, FiHome, FiMail, FiPhone, FiFileText, FiArrowRight, FiUsers } from 'react-icons/fi';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, property, guestInfo, checkIn, checkOut, totalPrice, guests } = location.state || {};

    if (!booking || !property) {
        return (
            <div className="confirmation-page">
                <div className="confirmation-container">
                    <div className="error-state">
                        <FiFileText className="error-icon" />
                        <h2>No booking details found</h2>
                        <p>We couldn't find your booking information. Please contact support if you believe this is an error.</p>
                        <button onClick={() => navigate('/properties')} className="btn-primary-custom">
                            Browse Properties
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750';
        if (url.startsWith('http')) return url;
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        return `${backendUrl}${url}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className="confirmation-card">
                    <div className="success-animation">
                        <div className="success-icon-wrapper">
                            <FiCheckCircle className="success-icon" />
                        </div>
                    </div>
                    
                    <h1 className="confirmation-title">Booking Confirmed!</h1>
                    <p className="confirmation-subtitle">
                        Your reservation has been successfully placed and paid.
                    </p>

                    <div className="booking-details">
                        <h3 className="details-title">Reservation Details</h3>
                        
                        <div className="property-section">
                            <img src={getImageUrl(property.images?.[0])} alt={property.title} className="property-image" />
                            <div className="property-info">
                                <h4 className="property-name">{property.title}</h4>
                                <p className="property-location">
                                    <FiMapPin className="info-icon" /> {property.location}
                                </p>
                                <p className="property-price">
                                    Rs. {property.price.toLocaleString()} <span>/ night</span>
                                </p>
                            </div>
                        </div>

                        <div className="dates-section">
                            <div className="date-card">
                                <div className="date-header">
                                    <FiCalendar className="date-icon" />
                                    <span>Check-in</span>
                                </div>
                                <div className="date-value">{formatDate(checkIn)}</div>
                                <div className="date-time">at {formatTime(checkIn)}</div>
                            </div>
                            <div className="date-card">
                                <div className="date-header">
                                    <FiCalendar className="date-icon" />
                                    <span>Check-out</span>
                                </div>
                                <div className="date-value">{formatDate(checkOut)}</div>
                                <div className="date-time">at {formatTime(checkOut)}</div>
                            </div>
                        </div>

                        <div className="guest-section">
                            <h4 className="guest-title">
                                <FiUser className="section-icon" />
                                Guest Information
                            </h4>
                            <div className="guest-info-grid">
                                <div className="guest-info-item">
                                    <FiUser className="info-icon-small" />
                                    <div>
                                        <span className="info-label">Full Name</span>
                                        <p className="info-value">{guestInfo?.name || 'Guest'}</p>
                                    </div>
                                </div>
                                <div className="guest-info-item">
                                    <FiMail className="info-icon-small" />
                                    <div>
                                        <span className="info-label">Email Address</span>
                                        <p className="info-value">{guestInfo?.email}</p>
                                    </div>
                                </div>
                                <div className="guest-info-item">
                                    <FiPhone className="info-icon-small" />
                                    <div>
                                        <span className="info-label">Phone Number</span>
                                        <p className="info-value">{guestInfo?.phone}</p>
                                    </div>
                                </div>
                                {guestInfo?.cnic && (
                                    <div className="guest-info-item">
                                        <FiFileText className="info-icon-small" />
                                        <div>
                                            <span className="info-label">CNIC Number</span>
                                            <p className="info-value">{guestInfo.cnic}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="payment-section">
                            <div className="payment-row">
                                <span>Subtotal</span>
                                <span>Rs. {totalPrice?.toLocaleString()}</span>
                            </div>
                            <div className="payment-row">
                                <span>Service Fee</span>
                                <span>Rs. 0</span>
                            </div>
                            <div className="payment-divider"></div>
                            <div className="payment-row total">
                                <strong>Total Paid</strong>
                                <strong>Rs. {totalPrice?.toLocaleString()}</strong>
                            </div>
                            <div className="guest-count">
                                <FiUsers className="guest-icon" />
                                <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                            </div>
                        </div>

                        <div className="booking-id">
                            <span className="id-label">Booking ID:</span>
                            <span className="id-value">{booking._id}</span>
                        </div>
                    </div>

                    <div className="confirmation-message">
                        <FiMail className="message-icon" />
                        <p>
                            A confirmation email has been sent to <strong>{guestInfo?.email}</strong>. 
                            If you need to make changes, please contact our support team.
                        </p>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => navigate('/properties')} className="btn-primary-custom">
                            <FiHome /> Browse More Properties
                        </button>
                        <button onClick={() => navigate('/')} className="btn-secondary-custom">
                            Back to Home <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;