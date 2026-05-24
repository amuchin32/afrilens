import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../../utils/constants';
import '../../../src/styles/navbar.css';

const TopBar = () => {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="topbar">
      <div className="container d-flex justify-content-between align-items-center">
        <span>{now} | Logan Town, Monrovia, Liberia</span>
        <div className="social-icons d-none d-md-flex align-items-center">
          <span className="me-2">Follow Us:</span>
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer"><FaTwitter /></a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer"><FaYoutube /></a>
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noreferrer"><FaWhatsapp /></a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
