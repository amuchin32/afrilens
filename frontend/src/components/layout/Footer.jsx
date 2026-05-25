import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import API from "../../services/api";

const Footer = () => {
  const [social, setSocial] = React.useState({});
  const [foot,   setFoot]   = React.useState({
    brandTagline: "Africa Through a New Lens",
    brandDesc:    "Delivering authentic, impactful journalism from Liberia and across the African continent. Trusted by readers worldwide.",
    address:      "Logan Town, Monrovia, Liberia",
    email:        "editorial@afrilens.com",
    phone:        "+231 xxx xxx xxx",
    editorName:   "Lyndon J. Ponnie, Sr.",
    copyright:    "AfriLENS.com. All rights reserved.",
  });

  React.useEffect(() => {
    API.get("/pages/footer").then(r => {
      if (r.data?.content && Object.keys(r.data.content).length)
        setFoot(p => ({ ...p, ...r.data.content }));
    }).catch(() => {});
    API.get("/settings/social").then(r => {
      if (r.data?.links) setSocial(r.data.links);
    }).catch(() => {});
  }, []);

  const isAdmin = window.location.pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row g-5">

          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <div className="brand-name">Afri<span>LENS</span></div>
              <div className="motto">{foot.brandTagline}</div>
              <p className="mt-3">{foot.brandDesc}</p>
              <div className="footer-social mt-4">
                {social.facebook  && <a href={social.facebook}  target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>}
                {social.twitter   && <a href={social.twitter}   target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                {social.youtube   && <a href={social.youtube}   target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
                {social.whatsapp  && <a href={social.whatsapp}  target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>}
              </div>
            </div>
          </div>

          {/* Sections Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Sections</h6>
            <ul className="footer-links">
              {["News","Business","Tech","Culture","Videos","Opportunities"].map(item => (
                <li key={item}><Link to={"/" + item.toLowerCase()}>{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Company</h6>
            <ul className="footer-links">
              {[
                { n: "About Us",         p: "/about" },
                { n: "Contact",          p: "/contact" },
                { n: "Advertise",        p: "/contact" },
                { n: "Careers",          p: "/opportunities" },
                { n: "Editorial Policy", p: "/about" },
                { n: "Privacy Policy",   p: "/about" },
              ].map(item => (
                <li key={item.n}><Link to={item.p}>{item.n}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Contact Us</h6>
            <ul className="footer-links">
              <li>
                <FaMapMarkerAlt style={{ color: "var(--primary)", marginRight: 8 }} />
                {foot.address}
              </li>
              <li>
                <a href={`mailto:${foot.email}`}>
                  <FaEnvelope style={{ color: "var(--primary)", marginRight: 8 }} />
                  {foot.email}
                </a>
              </li>
              <li>
                <a href={`tel:${foot.phone}`}>
                  <FaPhone style={{ color: "var(--primary)", marginRight: 8 }} />
                  {foot.phone}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <small style={{ color: "#6c757d" }}>Editor-in-Chief</small>
              <p style={{ color: "white", fontWeight: 600, marginTop: 4 }}>{foot.editorName}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom mt-5">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} {foot.copyright}</span>
          <span>Designed &amp; Built By <strong style={{ color: "white" }}>AlgiveSolution</strong></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
