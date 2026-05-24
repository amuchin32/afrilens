import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { EDITOR } from "../../utils/constants";
import API from "../../services/api";

const Footer = () => {
  const [contact, setContact] = React.useState({ address: "Logan Town, Monrovia, Liberia", editorialEmail: "editor@afrilens.com", phone: "+231 xxx xxx xxx" });
  const [social,  setSocial]  = React.useState({});
  const [foot,    setFoot]    = React.useState({ brandTagline: "Africa Through a New Lens", brandDesc: "Delivering authentic, impactful journalism from Liberia and across the African continent. Trusted by readers worldwide.", address: "Monrovia, Liberia", email: "editorial@afrilens.com", phone: "+231 xxx xxx xxx", editorName: "", copyright: "AfriLENS.com. All rights reserved." });

  React.useEffect(() => {
    API.get("/pages/contact").then(r => { if (r.data?.content && Object.keys(r.data.content).length) setContact(r.data.content); }).catch(() => {});
    API.get("/pages/footer").then(r => { if (r.data?.content && Object.keys(r.data.content).length) setFoot(p => ({ ...p, ...r.data.content })); }).catch(() => {});
    API.get("/settings/social").then(r => { if (r.data?.links) setSocial(r.data.links); }).catch(() => {});
  }, []);

  const isAdmin = window.location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <footer style={{
        background: "#0a1628", color: "#adb5bd", padding: "16px 32px",
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 12, fontSize: 13,
        borderTop: "2px solid #e8a020", width: "100%"
      }}>
        <span style={{ color: "#fff", fontWeight: 700 }}>
          Afri<span style={{ color: "#FFD700" }}>LENS</span>
          <span style={{ color: "#6c757d", fontWeight: 400, marginLeft: 12 }}>
            © {new Date().getFullYear()} {foot.copyright}
          </span>
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {social.facebook  && <a href={social.facebook}  target="_blank" rel="noreferrer" style={{ color: "#adb5bd" }}><FaFacebookF /></a>}
          {social.twitter   && <a href={social.twitter}   target="_blank" rel="noreferrer" style={{ color: "#adb5bd" }}><FaTwitter /></a>}
          {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" style={{ color: "#adb5bd" }}><FaInstagram /></a>}
          {social.youtube   && <a href={social.youtube}   target="_blank" rel="noreferrer" style={{ color: "#adb5bd" }}><FaYoutube /></a>}
          {social.whatsapp  && <a href={social.whatsapp}  target="_blank" rel="noreferrer" style={{ color: "#adb5bd" }}><FaWhatsapp /></a>}
        </div>
        <span style={{ fontSize: 12 }}>Designed &amp; Built By <strong style={{ color: "#fff" }}>AlgiveSolution</strong></span>
      </footer>
    );
  }

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <div className="brand-name">Afri<span>LENS</span></div>
              <div className="motto">{foot.brandTagline || "Africa Through a New Lens"}</div>
              <p className="mt-3">{foot.brandDesc || "Delivering authentic, impactful journalism from Liberia and across the African continent. Trusted by readers worldwide."}</p>
              <div className="footer-social mt-4">
                {social.facebook  && <a href={social.facebook}  target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>}
                {social.twitter   && <a href={social.twitter}   target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                {social.youtube   && <a href={social.youtube}   target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
                {social.whatsapp  && <a href={social.whatsapp}  target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>}
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Sections</h6>
            <ul className="footer-links">
              {["News","Business","Tech","Culture","Videos","Opportunities"].map(item => (
                <li key={item}><Link to={"/" + item.toLowerCase()}>{item}</Link></li>
              ))}
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Company</h6>
            <ul className="footer-links">
              {[
                { n:"About Us",         p:"/about" },
                { n:"Contact",          p:"/contact" },
                { n:"Advertise",        p:"/contact" },
                { n:"Careers",          p:"/opportunities" },
                { n:"Editorial Policy", p:"/about" },
                { n:"Privacy Policy",   p:"/about" },
              ].map(item => (<li key={item.n}><Link to={item.p}>{item.n}</Link></li>))}
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="footer-heading">Contact Us</h6>
            <ul className="footer-links">
              <li>
                <FaMapMarkerAlt style={{ color:"var(--primary)", marginRight:8 }} />
                {foot.address || contact.address || "Monrovia, Liberia"}
              </li>
              <li>
                <a href={`mailto:${foot.email || contact.editorialEmail || "editor@afrilens.com"}`}>
                  <FaEnvelope style={{ color:"var(--primary)", marginRight:8 }} />
                  {foot.email || contact.editorialEmail || "editor@afrilens.com"}
                </a>
              </li>
              <li>
                <a href={`tel:${foot.phone || contact.phone || ""}`}>
                  <FaPhone style={{ color:"var(--primary)", marginRight:8 }} />
                  {foot.phone || contact.phone || "+231 xxx xxx xxx"}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <small style={{ color:"#6c757d" }}>Editor-in-Chief</small>
              <p style={{ color:"white", fontWeight:600, marginTop:4 }}>{foot.editorName || EDITOR}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom mt-5">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} {foot.copyright || "AfriLENS.com. All rights reserved."}</span>
          <span>Designed &amp; Built By <strong style={{ color:"white" }}>AlgiveSolution</strong></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
