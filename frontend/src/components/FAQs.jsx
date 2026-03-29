// components/FAQs.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';
import './FAQs.css';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I search for properties?",
      answer: "You can search for properties using our search bar on the home page. Filter by property name, type, location, price range, and number of bedrooms. You can also browse properties by category from the 'Browse by Property Type' section."
    },
    {
      question: "How do I book a property?",
      answer: "Once you find a property you're interested in, click on it to view details. You'll find a booking option that allows you to select dates and complete your reservation. You'll need to be logged in to book a property."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. All payments are processed securely through our encrypted payment gateway."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before check-in for a full refund. Cancellations within 24 hours may incur a fee. Please check the property's specific cancellation policy before booking."
    },
    {
      question: "Are the properties verified?",
      answer: "Yes, all properties on Cozy Casa are thoroughly verified by our team. We ensure that all listings are accurate, photos are authentic, and hosts are legitimate before they appear on our platform."
    },
    {
      question: "How do I contact the property host?",
      answer: "After booking a property, you'll receive the host's contact information. You can also message hosts directly through our platform's messaging system for any questions about the property."
    },
    {
      question: "Do you offer long-term rentals?",
      answer: "Yes, many of our properties are available for long-term stays. Use the filters to search for monthly rentals or contact us directly for extended stay arrangements."
    },
    {
      question: "Is there a security deposit?",
      answer: "Security deposit requirements vary by property. The amount, if required, will be clearly stated on the property listing page before you book. Deposits are fully refundable after check-out, provided there's no damage."
    },
    {
      question: "What if I have issues during my stay?",
      answer: "Our 24/7 customer support team is always ready to help. You can reach us via phone, email, or live chat for any issues during your stay. We're committed to ensuring you have a comfortable experience."
    },
    {
      question: "How are prices determined?",
      answer: "Prices are set by property hosts based on factors like location, amenities, seasonality, and demand. We show you the total price including all fees before you confirm your booking."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faqs-section">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-subtitle">Got Questions?</span>
          <h2 className="section-title">Frequently Asked <em>Questions</em></h2>
          <p className="faqs-description">
            Find answers to common questions about our platform and services
          </p>
        </div>

        <div className="faqs-grid">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-card ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <div className="faq-question-content">
                  <FiHelpCircle className="faq-icon" />
                  <h3>{faq.question}</h3>
                </div>
                <button className="faq-toggle-btn">
                  {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
              <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faqs-footer">
          <p>Still have questions? <Link to="/contact" className="contact-link">Contact our support team</Link> and we'll help you out!</p>
        </div>
      </div>
    </section>
  );
};

export default FAQs;