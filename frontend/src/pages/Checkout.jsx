import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { guestAPI } from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiCreditCard, FiUser, FiMail, FiPhone, FiFileText, FiCalendar, FiUsers, FiHome, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import './Checkout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51T9wuk56HyESbegXpKTGQarLaS3U3cZhdeAlAviXl8f2oSNUDRQu7yQ5xsfcoRwfIUfb1FdfBtzxvDle84QB81aZ00Jvoxvhoo');

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { property, checkIn, checkOut, totalPrice, guests } = location.state || {};

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const initializePayment = async () => {
        if (!property?._id || !checkIn || !checkOut || totalPrice <= 0) {
          setError('Invalid booking details. Please return to property page.');
          return;
        }
        try {
          console.log('Checkout init with:', { propertyId: property._id, checkIn, checkOut, totalPrice, guests });
          setLoading(true);

          const { data: paymentData } = await guestAPI.post('/payments/create-intent', {
            amount: totalPrice,
          });

          setClientSecret(paymentData.clientSecret);
          setError(null);
        } catch (err) {
          console.error('Checkout init error:', err.response?.data || err);
          setError(err.response?.data?.message || 'Payment setup failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      initializePayment();
    }, [property?._id, checkIn, checkOut, totalPrice, guests]);

    if (!property) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="error-state">
                        <FiFileText className="error-icon" />
                        <h2>No booking details found</h2>
                        <p>Please start from the property page to make a booking.</p>
                        <button onClick={() => navigate('/properties')} className="btn-primary-custom">Browse Properties</button>
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

    const CheckoutForm = () => {
      const stripe = useStripe();
      const elements = useElements();
      const [paymentLoading, setPaymentLoading] = useState(false);
      const [paymentError, setPaymentError] = useState(null);
      
      const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '', cnic: '' });

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!guestInfo.name || !guestInfo.email || !guestInfo.phone || !guestInfo.cnic) {
          setPaymentError('Please fill in all customer details.');
          return;
        }
        
        // Basic email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(guestInfo.email)) {
          setPaymentError('Please enter a valid email address.');
          return;
        }
        
        // Basic phone validation (10-15 digits)
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!phoneRegex.test(guestInfo.phone.replace(/[\s-]/g, ''))) {
          setPaymentError('Please enter a valid phone number.');
          return;
        }
        
        // Basic CNIC validation (simple format check)
        const cnicRegex = /^\d{5}-\d{7}-\d$/;
        if (!cnicRegex.test(guestInfo.cnic)) {
          setPaymentError('Please enter a valid CNIC number (format: 12345-1234567-1)');
          return;
        }
        
        if (!stripe || !elements || !clientSecret) {
          setPaymentError('Payment setup not ready');
          return;
        }
        setPaymentLoading(true);
        setPaymentError(null);
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)
            }
          });
          if (error) {
            setPaymentError(error.message);
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            const finalBookingData = {
              propertyId: property._id,
              checkIn: checkIn.toISOString(),
              checkOut: checkOut.toISOString(),
              totalPrice,
              guests,
              paymentId: paymentIntent.id,
              guestInfo
            };
            const bookingRes = await guestAPI.post('/bookings', finalBookingData);

            navigate(`/${property._id}/${bookingRes.data._id}/booking-confirmation`, { 
              state: { 
                booking: bookingRes.data, 
                property, 
                guestInfo,
                checkIn,
                checkOut,
                totalPrice,
                guests
              } 
            });
          }
        } catch (err) {
          console.error('Payment error step:', err);
          setPaymentError('Payment processing failed. Please try again.');
        }
        setPaymentLoading(false);
      };

      if (!stripe || !elements) {
        return <div className="loading-form">Loading payment form...</div>;
      }

      return (
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <h3 className="section-title">
              <FiUser className="section-icon" />
              Guest Information
            </h3>
            <div className="guest-info-grid">
              <div className="input-group">
                <label className="input-label">
                  <FiUser className="input-icon" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  className="form-input" 
                  value={guestInfo.name} 
                  onChange={e => setGuestInfo({...guestInfo, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <FiMail className="input-icon" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="form-input" 
                  value={guestInfo.email} 
                  onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <FiPhone className="input-icon" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="+923001234567" 
                  className="form-input" 
                  value={guestInfo.phone} 
                  onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <FiFileText className="input-icon" />
                  CNIC Number
                </label>
                <input 
                  type="text" 
                  placeholder="12345-1234567-1" 
                  className="form-input" 
                  value={guestInfo.cnic} 
                  onChange={e => setGuestInfo({...guestInfo, cnic: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <FiCreditCard className="section-icon" />
              Secure Card Payment
            </h3>
            <div className="card-element-wrapper">
              <CardElement 
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#0d1a08',
                      fontFamily: '"DM Sans", sans-serif',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      padding: '12px',
                    },
                    invalid: {
                      color: '#f87171',
                      iconColor: '#f87171',
                    },
                  },
                }}
              />
            </div>
            {paymentError && <div className="payment-error">{paymentError}</div>}
          </div>

          <button type="submit" className="pay-button" disabled={paymentLoading || !stripe || !elements}>
            {paymentLoading ? (
              <>
                <span className="spinner"></span>
                Processing Payment...
              </>
            ) : (
              <>
                <FiCreditCard /> Pay Rs. {totalPrice.toLocaleString()}
              </>
            )}
          </button>
        </form>
      );
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-details">
                    <div className="checkout-header">
                        <h1>Complete Your Booking</h1>
                        <p>Please review your booking details and complete the payment</p>
                    </div>
                    
                    <div className="order-summary">
                        <h3 className="summary-title">Booking Summary</h3>
                        <div className="summary-property">
                            <img src={getImageUrl(property.images?.[0])} alt={property.title} className="property-image" />
                            <div className="property-info">
                                <h4>{property.title}</h4>
                                <p className="property-location"><FiMapPin /> {property.location}</p>
                                <p className="property-price">Rs. {property.price.toLocaleString()} <span>/ night</span></p>
                            </div>
                        </div>
                        
                        <div className="summary-details">
                            <div className="detail-item">
                                <FiCalendar className="detail-icon" />
                                <div>
                                    <strong>Check-in</strong>
                                    <p>{new Date(checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FiCalendar className="detail-icon" />
                                <div>
                                    <strong>Check-out</strong>
                                    <p>{new Date(checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FiUsers className="detail-icon" />
                                <div>
                                    <strong>Guests</strong>
                                    <p>{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="summary-total">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>Rs. {totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="total-row">
                                <span>Service Fee</span>
                                <span>Rs. 0</span>
                            </div>
                            <div className="total-row-divider"></div>
                            <div className="total-row grand-total">
                                <strong>Total Amount</strong>
                                <strong>Rs. {totalPrice.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm />
                      </Elements>
                    ) : loading ? (
                      <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Setting up secure payment...</p>
                      </div>
                    ) : (
                      <div className="error-state">
                        <FiFileText className="error-icon" />
                        <p>{error}</p>
                        <button onClick={() => navigate(`/property/${property._id}`)} className="btn-secondary">Return to Property</button>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;