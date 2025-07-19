import React from "react";
import { FaDribbble, FaInstagram, FaMediumM, FaTwitter } from "react-icons/fa";

import "./style/Footer.scss"; // Import SCSS file
import iconSvg from "../../assets/footer/Vector.svg";

// Removed companyName prop as the name is fixed in the design
const Footer = () => {
  const companyName = "Nuh Demir"; // Fixed name from image

  return (
    <footer className="footer-main-container">
      {/* Section 1: Icon + Name */}
      <div className="footer-brand-section">
        <a href="/" aria-label={`${companyName} Homepage`}>
          <img
            src={iconSvg}
            alt={`${companyName} Logo`}
            className="footer-logo-svg"
          />
          <span className="footer-brand-name">{companyName}</span>
        </a>
      </div>

      {/* Section 2: Center Text */}
      <div className="footer-center-text">
        {/* You might want to make this a link later */}
        <span> 2025 Nuh Demir. All rights reserved.</span>
        {/* <a href="/portfolio">My Portfolio</a> */}
      </div>

      {/* Section 3: Social Media Links */}
      <div className="footer-social-links">
        <nav aria-label="Social media links">
          <ul>
            <li>
              <a
                href="https://medium.com/@nuhdemir.dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Dribbble profile"
              >
                <FaMediumM />
              </a>
            </li>
            {/* Instagram Icon */}
            <li>
              <a
                href="https://www.instagram.com/yazilimkiraathanesi/" // Keep your link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram profile"
              >
                <FaInstagram />
              </a>
            </li>
            {/* Twitter / X Icon */}
            <li>
              <a
                href="https://x.com/YzlmKraathanesi" // Keep your link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter profile"
              >
                <FaTwitter />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
