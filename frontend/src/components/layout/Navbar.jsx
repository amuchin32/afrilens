import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import { NAV_LINKS, SITE_NAME, SITE_MOTTO } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="main-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link to="/" className="navbar-brand navbar-brand-custom">
          <div className="brand-name">Afri<span>LENS</span></div>
          <div className="brand-motto">{SITE_MOTTO}</div>
        </Link>

        <button
          className="navbar-toggler"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={"collapse navbar-collapse " + (isOpen ? "show" : "")}>
          <ul className="navbar-nav mx-auto">
            {NAV_LINKS.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="search-btn-nav">
              <FaSearch size={12} /> Search
            </button>
            {user ? (
              <Link to="/admin" className="btn-primary-custom" style={{padding:'6px 14px',fontSize:'0.8rem'}}>
                <FaUser size={11} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn-primary-custom" style={{padding:'6px 14px',fontSize:'0.8rem'}}>
                <FaUser size={11} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
