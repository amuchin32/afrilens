import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp, FaSave } from "react-icons/fa";

const SOCIALS = [
  { key: "facebook",  label: "Facebook",    color: "#1877F2", placeholder: "https://facebook.com/yourpage" },
  { key: "twitter",   label: "Twitter / X", color: "#1DA1F2", placeholder: "https://twitter.com/yourhandle" },
  { key: "instagram", label: "Instagram",   color: "#E1306C", placeholder: "https://instagram.com/yourpage" },
  { key: "youtube",   label: "YouTube",     color: "#FF0000", placeholder: "https://youtube.com/@yourchannel" },
  { key: "whatsapp",  label: "WhatsApp",    color: "#25D366", placeholder: "https://wa.me/2317700000" },
];

const ICONS = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

export default function SocialLinksManager() {
  const [links,   setLinks]   = useState({});
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    API.get("/settings/social")
      .then(r => setLinks(r.data?.links || {}))
      .catch(() => setLinks({}))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/settings/social", { links });
      showToast("Social links saved! Changes are live on the site.");
    } catch {
      showToast("Save failed. Please try again.", true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="adm-loading">Loading...</div>;

  return (
    <div>
      {toast && (
        <div className={`adm-toast${toast.err ? " adm-toast-error" : ""}`}>{toast.msg}</div>
      )}
      <h2 className="adm-section-title">Social Media Links</h2>
      <p style={{ color: "var(--mid-gray)", marginBottom: 28, fontSize: 14 }}>
        Add your social media links below. They become clickable across the entire site immediately after saving.
      </p>
      <form onSubmit={handleSave}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 620 }}>
          {SOCIALS.map(s => {
            const Icon = ICONS[s.key];
            return (
              <div key={s.key} style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "#fff", border: "1.5px solid #e5e7eb",
                borderRadius: 12, padding: "16px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize: 28, color: s.color, minWidth: 36, textAlign: "center" }}>
                  <Icon />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#333" }}>
                    {s.label}
                  </label>
                  <input
                    type="url"
                    value={links[s.key] || ""}
                    onChange={e => setLinks(p => ({ ...p, [s.key]: e.target.value }))}
                    placeholder={s.placeholder}
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1px solid #d1d5db", borderRadius: 8,
                      fontSize: 14, outline: "none",
                      boxSizing: "border-box", fontFamily: "inherit"
                    }}
                  />
                </div>
                {links[s.key] && (
                  <a href={links[s.key]} target="_blank" rel="noopener noreferrer" style={{
                    color: s.color, fontSize: 12, fontWeight: 600,
                    textDecoration: "none", whiteSpace: "nowrap",
                    border: `1px solid ${s.color}`, padding: "5px 12px", borderRadius: 6
                  }}>
                    Test
                  </a>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 28 }}>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, padding: "12px 28px" }}>
            <FaSave /> {saving ? "Saving..." : "Save Social Links"}
          </button>
        </div>
      </form>
    </div>
  );
}
