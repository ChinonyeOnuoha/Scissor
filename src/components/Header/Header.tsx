//Header.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import './header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
    <div className="container">
      <header className="header">
        <div className="header-logo">
          <NavLink to="/" >
            <img src="/assets/Logo.svg" alt="Logo" />
          </NavLink>
        </div>
        <nav className={`header-nav ${isMenuOpen ? 'is-active' : ''}`}>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={toggleMenu}>My Links</NavLink>
              <NavLink to="/pricing" className="nav-link" onClick={toggleMenu}>Pricing</NavLink>
              <NavLink to="/faqs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>FAQs</NavLink>
              <button onClick={handleLogout} className="nav-link nav-link-button">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/pricing" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>Pricing</NavLink>

              <NavLink to="/faqs" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>FAQs</NavLink>

              <NavLink to="/login" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={toggleMenu}>Login</NavLink>

              <NavLink to="/signup" className="nav-link-button" onClick={toggleMenu}>Free sign up</NavLink>
            </>
          )}
          <button className="close-btn" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </nav>
        <button className="header-menu-button" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
        </button>
      </header>
    </div>
  );
};

export default Header;
