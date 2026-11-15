import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <>
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src="/imgs/logo.svg" alt="Logo" className="navbar-logo-img" />
        </NavLink>
      </div>
      <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
      <label htmlFor="navbar-toggle" className="navbar-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</NavLink>
        <NavLink to="/properties" className={({ isActive }) => isActive ? 'active' : ''}>Properties</NavLink>
        <NavLink to="/addproperty" className={({ isActive }) => isActive ? 'active' : ''}>Add Property</NavLink>
         <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login / Sign Up</NavLink>
      </div>
    </nav>
    <div className="navbar-offset" aria-hidden="true" />
    </>
  );
};

export default Navbar;
