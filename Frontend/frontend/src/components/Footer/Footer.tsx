import React, { useState } from 'react';
import './footer.css';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Tagline */}
        <div className="footer-section brand-section">
          <div className="logo">
            <div className="logo-box">
              <span>LO</span>
              <br />
              <span>GO</span>
            </div>
            <span className="company-name">AceIt</span>
          </div>
          <p className="tagline">
            Empowering tech careers through innovative solutions
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links-section">
          <h3 className="section-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section contact-section">
          <h3 className="section-title">Contact</h3>
          <div className="contact-item">
            <div className="icon email-icon"></div>
            <a href="mailto:support@aceit.com">support@aceit.com</a>
          </div>
          <div className="contact-item">
            <div className="icon phone-icon"></div>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter-section">
          <h3 className="section-title">Newsletter</h3>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="submit-button">
              <span className="arrow-icon"></span>
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;