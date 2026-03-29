import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { guestAPI } from '../utils/api';
import { FiMail, FiPhone, FiMessageSquare, FiUser, FiCheckCircle, FiArrowRight, FiSend } from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp is required';
    else if (!/^\+?\d{10,15}$/.test(formData.whatsapp.replace(/[\s-]/g, ''))) newErrors.whatsapp = 'WhatsApp number invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length > 1000) newErrors.message = 'Message too long (max 1000 chars)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await guestAPI.post('/messages', formData);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const SuccessOverlay = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8faf5 0%, #f0f5ed 100%)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideUpCenter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Top gradient bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #4CBB17, #72d142, #4CBB17)',
          }} />

          {/* Icon */}
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(76,187,23,0.1), rgba(76,187,23,0.05))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FiCheckCircle style={{ width: '70px', height: '70px', color: '#4CBB17' }} />
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
            color: '#0d1a08',
            marginBottom: '1rem',
            fontWeight: 700,
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.2,
          }}>
            Thank You!{' '}
            <span style={{ color: '#4CBB17' }}>{formData.name}</span>
          </h1>

          {/* Messages */}
          <p style={{
            fontSize: '1.05rem',
            color: '#2e4020',
            margin: '0 0 0.75rem',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            Your message has been sent successfully!
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#999',
            margin: '0 0 2rem',
            lineHeight: 1.6,
          }}>
            We'll get back to you within 24 hours via email or WhatsApp.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '0.9rem 1.8rem',
                borderRadius: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                border: '2px solid transparent',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #4CBB17, #3a9912)',
                color: 'white',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
              }}
            >
              <FiCheckCircle /> Back to Home
            </button>
            <Link
              to="/properties"
              style={{
                padding: '0.9rem 1.8rem',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                border: '2px solid #4CBB17',
                background: 'white',
                color: '#4CBB17',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
              }}
            >
              Browse Properties <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUpCenter {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Portal renders the success screen directly into document.body,
          completely outside the app's layout/navbar/footer stacking context */}
      {submitted && createPortal(<SuccessOverlay />, document.body)}

      <div className="contact-page">
        <div className="contact-background">
          <div className="contact-background-shape shape-1"></div>
          <div className="contact-background-shape shape-2"></div>
          <div className="contact-background-shape shape-3"></div>
        </div>

        <div className="container">
          <div className="contact-panel">
            <div className="contact-panel-logo">
              <span className="panel-cozy">Cozy</span>
              <span className="panel-casa">Casa</span>
            </div>

            <div className="contact-header">
              <h1 className="panel-heading">Get In Touch</h1>
              <p className="panel-subtitle">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            {submitError && (
              <div className="error-message">
                <FiMessageSquare className="error-icon" />
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>
                  <FiUser className="label-icon" />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group-half">
                  <label>
                    <FiMail className="label-icon" />
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group-half">
                  <label>
                    <FiPhone className="label-icon" />
                    WhatsApp Number
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className={errors.whatsapp ? 'error' : ''}
                      placeholder="+923001234567"
                    />
                  </div>
                  {errors.whatsapp && <span className="field-error">{errors.whatsapp}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiMessageSquare className="label-icon" />
                  Your Message
                </label>
                <div className="input-wrapper textarea-wrapper">
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'error' : ''}
                    placeholder="Tell us about your inquiry, question, or feedback..."
                    maxLength="1000"
                  />
                  <div className="char-count">{formData.message.length}/1000</div>
                </div>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </form>

            <div className="contact-footer">
              <div className="contact-footer-divider"></div>
              <p>Or email us directly at <a href="mailto:support@cozycasa.com">support@cozycasa.com</a></p>
              <div className="contact-footer-note">
                <span>📞 Emergency? Call us: +1 234 567 890</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .contact-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8faf5 0%, #f0f5ed 100%);
            padding: 4rem 0;
            font-family: 'DM Sans', sans-serif;
            position: relative;
            overflow-x: hidden;
          }

          .contact-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 0;
          }

          .contact-background-shape {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(76, 187, 23, 0.03) 0%, rgba(76, 187, 23, 0.01) 100%);
            animation: float 20s ease-in-out infinite;
          }

          .shape-1 {
            width: 300px;
            height: 300px;
            top: 10%;
            left: -100px;
            animation-delay: 0s;
          }

          .shape-2 {
            width: 400px;
            height: 400px;
            bottom: 10%;
            right: -150px;
            animation-delay: 5s;
          }

          .shape-3 {
            width: 200px;
            height: 200px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-delay: 10s;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 1;
          }

          .contact-panel {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 32px;
            padding: 3rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
            animation: slideUp 0.5s ease;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .contact-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #4CBB17, #72d142, #4CBB17);
            background-size: 200% 100%;
            animation: gradientShift 3s ease infinite;
          }

          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .contact-panel-logo {
            text-align: center;
            margin-bottom: 2rem;
          }

          .panel-cozy {
            font-family: 'DM Serif Display', serif;
            font-size: 2.2rem;
            color: #0d1a08;
            font-weight: 600;
          }

          .panel-casa {
            font-family: 'DM Serif Display', serif;
            font-style: italic;
            font-size: 2.2rem;
            color: #4CBB17;
          }

          .contact-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .panel-heading {
            font-size: 2.8rem;
            font-weight: 700;
            color: #0d1a08;
            margin: 0 0 0.8rem;
            line-height: 1.2;
            font-family: 'DM Serif Display', serif;
          }

          .panel-subtitle {
            color: #2e4020;
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
            opacity: 0.8;
          }

          .form-group {
            margin-bottom: 1.8rem;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.8rem;
          }

          .form-group-half {
            margin-bottom: 0;
          }

          label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #0d1a08;
            margin-bottom: 0.8rem;
            font-size: 0.9rem;
          }

          .label-icon {
            color: #4CBB17;
            font-size: 0.9rem;
          }

          .input-wrapper {
            position: relative;
          }

          input, textarea {
            width: 100%;
            padding: 1rem 1rem;
            border: 2px solid #e8f0e0;
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.2s;
            background: white;
            font-weight: 400;
            box-sizing: border-box;
          }

          input:focus, textarea:focus {
            outline: none;
            border-color: #4CBB17;
            box-shadow: 0 0 0 4px rgba(76, 187, 23, 0.1);
            transform: translateY(-1px);
          }

          input.error, textarea.error {
            border-color: #f87171;
            background: #fef2f2;
          }

          .field-error {
            color: #f87171;
            font-size: 0.8rem;
            margin-top: 0.4rem;
            display: block;
          }

          textarea {
            resize: vertical;
            min-height: 120px;
          }

          .textarea-wrapper {
            position: relative;
          }

          .char-count {
            position: absolute;
            right: 1rem;
            bottom: 1rem;
            font-size: 0.75rem;
            color: #999;
            background: rgba(255, 255, 255, 0.9);
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            pointer-events: none;
          }

          .submit-btn {
            width: 100%;
            padding: 1.2rem;
            background: linear-gradient(135deg, #4CBB17, #3a9912);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            position: relative;
            overflow: hidden;
          }

          .submit-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .submit-btn:hover:not(:disabled)::before {
            left: 100%;
          }

          .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(76, 187, 23, 0.3);
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .error-message {
            background: #fef2f2;
            color: #f87171;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            border-left: 4px solid #f87171;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .error-icon {
            font-size: 1.2rem;
          }

          .contact-footer {
            margin-top: 2rem;
            text-align: center;
          }

          .contact-footer-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e8f0e0, transparent);
            margin: 1.5rem 0;
          }

          .contact-footer p {
            margin: 0 0 0.5rem;
            color: #2e4020;
            font-size: 0.9rem;
          }

          .contact-footer a {
            color: #4CBB17;
            text-decoration: none;
            font-weight: 600;
          }

          .contact-footer a:hover {
            text-decoration: underline;
          }

          .contact-footer-note {
            font-size: 0.85rem;
            color: #999;
            margin-top: 0.5rem;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .contact-page { padding: 2rem 0; }
            .form-row { grid-template-columns: 1fr; gap: 1rem; }
            .contact-panel { margin: 1rem; padding: 2rem 1.5rem; }
            .panel-heading { font-size: 2rem; }
          }

          @media (max-width: 480px) {
            .contact-panel { padding: 1.5rem; }
            .panel-heading { font-size: 1.6rem; }
            .panel-subtitle { font-size: 0.9rem; }
            .submit-btn { padding: 1rem; font-size: 0.9rem; }
            input, textarea { padding: 0.85rem; font-size: 0.9rem; }
          }

          @media (max-width: 380px) {
            .contact-panel { padding: 1.2rem; }
            .panel-heading { font-size: 1.4rem; }
          }
        `}</style>
      </div>
    </>
  );
};

export default ContactUs;