import React from 'react';
import './footer.css'; 

const Footer = () => {
  return (
    <div className="container">
    <footer className="footer">
      <p>© 2024 Scissor. All rights reserved</p>
      <div className="social-icons">
        <a href="https://twitter.com"><img src="/assets/twitter.svg" alt="Twitter" /></a>
        <a href="https://facebook.com"><img src="/assets/facebook.svg" alt="Facebook" /></a>
        <a href="https://instagram.com"><img src="/assets/instagram.svg" alt="Instagram" /></a>
        <a href="https://youtube.com"><img src="/assets/youtube.svg" alt="YouTube" /></a>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
