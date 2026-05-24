import React, { useState, useEffect } from "react";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter,
  FaFacebook, FaInstagram, FaLinkedin, FaPaperPlane
} from "react-icons/fa";
import API from "../services/api";

const TOPICS = [
  "General Enquiry",
  "Editorial / News Tip",
  "Advertising & Partnerships",
  "Press & Media Relations",
  "Technical Support",
  "Careers",
];

const DEFAULTS = {
  bannerTitle: "Contact AfriLENS",
  bannerDesc: "Have a news tip, story idea, press query or partnership proposal? We'd love to hear from you.",
  editorialEmail: "editorial@afrilens.com",
  adsEmail: "ads@afrilens.com",
  tipsEmail: "tips@afrilens.com",
  whatsapp: "+231 77 000 0000",
  address: "Monrovia, Liberia",
  twitterUrl: "#",
  facebookUrl: "#",
  instagramUrl: "#",
  linkedinUrl: "#",
  newsTipTitle: "📰 Submit a News Tip",
  newsTipBody: "Have a story the world needs to hear? Send us your news tip securely and confidentially. We protect all sources.",
  formSuccessMsg: "Thanks for reaching out. Our team will get back to you within 24–48 hours.",
};

export default function ContactPage() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [form, setForm] = useState({ name: "", email: "", topic: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    API.get("/pages/contact")
      .then((r) => {
        if (r.data?.content) setCfg({ ...DEFAULTS, ...r.data.content });
      })
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post("/contact", form);
    } catch {}
    setSending(false);
    setStatus("success");
    setForm({ name: "", email: "", topic: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="contact-banner">
        <div className="contact-banner-pattern" />
        <div className="container">
          <span className="cp-banner-eyebrow">Get In Touch</span>
          <h1 className="cp-banner-title">{cfg.bannerTitle}</h1>
          <p className="cp-banner-desc">{cfg.bannerDesc}</p>
        </div>
      </div>

      <div className="container contact-body">
        <div className="row g-5">
          {/* Left: Form */}
          <div className="col-lg-7">
            <div className="contact-form-card">
              <h2 className="contact-form-title">Send Us a Message</h2>
              {status === "success" ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✅</div>
                  <h3>Message Sent!</h3>
                  <p>{cfg.formSuccessMsg}</p>
                  <button className="contact-new-btn" onClick={() => setStatus(null)}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="contact-label">Full Name *</label>
                      <input className="contact-input" type="text" value={form.name} onChange={set("name")} placeholder="Your full name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="contact-label">Email Address *</label>
                      <input className="contact-input" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required />
                    </div>
                    <div className="col-12">
                      <label className="contact-label">Topic *</label>
                      <select className="contact-input" value={form.topic} onChange={set("topic")} required>
                        <option value="">Select a topic...</option>
                        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="contact-label">Subject *</label>
                      <input className="contact-input" type="text" value={form.subject} onChange={set("subject")} placeholder="Brief subject line" required />
                    </div>
                    <div className="col-12">
                      <label className="contact-label">Message *</label>
                      <textarea className="contact-input contact-textarea" value={form.message} onChange={set("message")} placeholder="Tell us more..." rows={6} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="contact-submit-btn" disabled={sending}>
                        {sending ? <><span className="cp-spinner" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="col-lg-5">
            <div className="contact-info">
              <h3 className="contact-info-title">Other Ways to Reach Us</h3>

              <div className="contact-info-card">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <div>
                  <div className="contact-info-label">Editorial</div>
                  <a href={"mailto:" + cfg.editorialEmail} className="contact-info-value">{cfg.editorialEmail}</a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <div>
                  <div className="contact-info-label">Advertising & Partnerships</div>
                  <a href={"mailto:" + cfg.adsEmail} className="contact-info-value">{cfg.adsEmail}</a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><FaPhone /></div>
                <div>
                  <div className="contact-info-label">Newsroom (WhatsApp)</div>
                  <a href={"tel:" + cfg.whatsapp.replace(/\s/g, "")} className="contact-info-value">{cfg.whatsapp}</a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><FaMapMarkerAlt /></div>
                <div>
                  <div className="contact-info-label">Headquarters</div>
                  <span className="contact-info-value">{cfg.address}</span>
                </div>
              </div>

              <div className="contact-social-block">
                <div className="contact-social-label">Follow AfriLENS</div>
                <div className="contact-social-links">
                  <a href={cfg.twitterUrl} className="contact-social-btn twitter"><FaTwitter /></a>
                  <a href={cfg.facebookUrl} className="contact-social-btn facebook"><FaFacebook /></a>
                  <a href={cfg.instagramUrl} className="contact-social-btn instagram"><FaInstagram /></a>
                  <a href={cfg.linkedinUrl} className="contact-social-btn linkedin"><FaLinkedin /></a>
                </div>
              </div>

              <div className="contact-tip-box">
                <div className="contact-tip-title">{cfg.newsTipTitle}</div>
                <p className="contact-tip-body">{cfg.newsTipBody}</p>
                <a href={"mailto:" + cfg.tipsEmail} className="contact-tip-link">{cfg.tipsEmail} →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
