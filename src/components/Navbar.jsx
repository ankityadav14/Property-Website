import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 24);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const propertiesMenuRef = useRef(null);
  const propertiesTriggerRef = useRef(null);
  const isHome = location.pathname === '/';
  const isPropertiesActive = location.pathname === '/properties' || location.pathname === '/saved';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsPropertiesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isPropertiesOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!propertiesMenuRef.current?.contains(event.target)) {
        setIsPropertiesOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPropertiesOpen(false);
        propertiesTriggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPropertiesOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsPropertiesOpen(false);
  };

  return (
    <>
    <nav className={`navbar${isHome && !isScrolled ? ' navbar-transparent' : ' navbar-scrolled'}`} aria-label="Main navigation">
      <div className="navbar-logo">
        <NavLink to="/" onClick={closeMenu}>
          <img src="/imgs/logo.svg" alt="RealSpace home" className="navbar-logo-img" />
        </NavLink>
      </div>
      <button
        type="button"
        className={`navbar-toggle-label${isMenuOpen ? ' is-open' : ''}`}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation-links"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
      <div className={`navbar-links${isMenuOpen ? ' is-open' : ''}`} id="primary-navigation-links">
        <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <div className={`navbar-dropdown${isPropertiesOpen ? ' is-open' : ''}`} ref={propertiesMenuRef}>
          <button
            type="button"
            className={`navbar-dropdown-trigger${isPropertiesActive ? ' active' : ''}`}
            onClick={() => setIsPropertiesOpen((isOpen) => !isOpen)}
            aria-expanded={isPropertiesOpen}
            aria-controls="properties-navigation-menu"
            ref={propertiesTriggerRef}
          >
            Properties
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" /></svg>
          </button>
          <div className="navbar-dropdown-menu" id="properties-navigation-menu">
            <NavLink to="/properties" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
              Browse rentals <span aria-hidden="true">→</span>
            </NavLink>
            <NavLink to="/saved" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>
              Saved homes <span aria-hidden="true">♡</span>
            </NavLink>
          </div>
        </div>
        <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
        <NavLink to="/addproperty" onClick={closeMenu} className={({ isActive }) => `navbar-primary-link${isActive ? ' active' : ''}`}>List your property</NavLink>

        <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Sign In</NavLink>
      </div>
    </nav>
    <div className="navbar-offset" aria-hidden="true" />
    </>
  );
};

export default Navbar;
