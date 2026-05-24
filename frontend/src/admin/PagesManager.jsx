import React, { useEffect, useState } from "react";
import API from "../services/api";

const PAGES = [
  {
    key: "about",
    label: "About",
    fields: [
      { name: "heroTitle",    label: "Hero Title",             type: "input",    placeholder: "Africa's Lens on the World" },
      { name: "heroLead",     label: "Hero Lead Paragraph",    type: "textarea", placeholder: "AfriLENS is an independent digital news platform..." },
      { name: "missionTitle", label: "Mission Section Title",  type: "input",    placeholder: "Journalism that serves Africa" },
      { name: "missionBody1", label: "Mission Paragraph 1",    type: "textarea", placeholder: "Founded in 2020..." },
      { name: "missionBody2", label: "Mission Paragraph 2",    type: "textarea", placeholder: "From politics and business..." },
      { name: "missionQuote", label: "Mission Pull Quote",     type: "textarea", placeholder: '"We don\'t just report on Africa..."' },
      { name: "stat1Value",   label: "Stat 1 - Value",         type: "input",    placeholder: "2M+" },
      { name: "stat1Label",   label: "Stat 1 - Label",         type: "input",    placeholder: "Monthly Readers" },
      { name: "stat2Value",   label: "Stat 2 - Value",         type: "input",    placeholder: "50+" },
      { name: "stat2Label",   label: "Stat 2 - Label",         type: "input",    placeholder: "Countries Reached" },
      { name: "stat3Value",   label: "Stat 3 - Value",         type: "input",    placeholder: "10K+" },
      { name: "stat3Label",   label: "Stat 3 - Label",         type: "input",    placeholder: "Stories Published" },
      { name: "stat4Value",   label: "Stat 4 - Value",         type: "input",    placeholder: "12" },
      { name: "stat4Label",   label: "Stat 4 - Label",         type: "input",    placeholder: "Awards Won" },
      { name: "ctaTitle",     label: "Newsletter CTA Title",   type: "input",    placeholder: "Join the AfriLENS community" },
      { name: "ctaSubtitle",  label: "Newsletter CTA Subtitle",type: "textarea", placeholder: "Subscribe for free..." },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    fields: [
      { name: "bannerTitle",       label: "Banner Title",               type: "input",    placeholder: "Contact AfriLENS" },
      { name: "bannerDesc",        label: "Banner Description",         type: "textarea", placeholder: "Have a news tip, story idea..." },
      { name: "editorialEmail",    label: "Editorial Email",            type: "input",    placeholder: "editorial@afrilens.com" },
      { name: "adsEmail",          label: "Advertising Email",          type: "input",    placeholder: "ads@afrilens.com" },
      { name: "tipsEmail",         label: "News Tips Email",            type: "input",    placeholder: "tips@afrilens.com" },
      { name: "phone",             label: "Phone Number",               type: "input",    placeholder: "+231 77 000 0000" },
      { name: "whatsapp",          label: "Newsroom WhatsApp",          type: "input",    placeholder: "+231 77 000 0000" },
      { name: "address",           label: "Headquarters Address",       type: "input",    placeholder: "Monrovia, Liberia" },
      { name: "twitterUrl",        label: "Twitter / X URL",            type: "input",    placeholder: "https://twitter.com/afrilens" },
      { name: "facebookUrl",       label: "Facebook URL",               type: "input",    placeholder: "https://facebook.com/afrilens" },
      { name: "instagramUrl",      label: "Instagram URL",              type: "input",    placeholder: "https://instagram.com/afrilens" },
      { name: "linkedinUrl",       label: "LinkedIn URL",               type: "input",    placeholder: "https://linkedin.com/company/afrilens" },
      { name: "newsTipTitle",      label: "News Tip Box Title",         type: "input",    placeholder: "Submit a News Tip" },
      { name: "newsTipBody",       label: "News Tip Box Body",          type: "textarea", placeholder: "Have a story the world needs to hear?" },
      { name: "formSuccessMsg",    label: "Form Success Message",       type: "textarea", placeholder: "Thanks for reaching out..." },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      { name: "brandTagline",  label: "Brand Tagline (under AfriLENS logo)", type: "input",    placeholder: "Africa Through a New Lens" },
      { name: "brandDesc",     label: "Brand Description",                   type: "textarea", placeholder: "Delivering authentic, impactful journalism from Liberia and across the African continent. Trusted by readers worldwide." },
      { name: "address",       label: "Address",                             type: "input",    placeholder: "Monrovia, Liberia" },
      { name: "email",         label: "Contact Email",                       type: "input",    placeholder: "editorial@afrilens.com" },
      { name: "phone",         label: "Phone Number",                        type: "input",    placeholder: "+231 77 000 0000" },
      { name: "editorName",    label: "Editor-in-Chief Name",                type: "input",    placeholder: "John Doe" },
      { name: "copyright",     label: "Copyright Text",                      type: "input",    placeholder: "AfriLENS.com. All rights reserved." },
    ],
  },
];

const SECTION_BREAKS = {
  about: {
    heroTitle:    "Hero Section",
    missionTitle: "Mission Section",
    stat1Value:   "Stats Bar",
    ctaTitle:     "Newsletter CTA",
  },
  contact: {
    bannerTitle:    "Banner",
    editorialEmail: "Contact Details",
    twitterUrl:     "Social Media Links",
    newsTipTitle:   "News Tip Box",
    formSuccessMsg: "Form Messages",
  },
  footer: {
    brandTagline: "Brand Info",
    address:      "Contact Details",
    editorName:   "Staff",
    copyright:    "Copyright",
  },
};

export default function PagesManager() {
  const [active,  setActive]  = useState("about");
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState({ msg: "", type: "success" });

  const page   = PAGES.find((p) => p.key === active);
  const breaks = SECTION_BREAKS[active] || {};

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  useEffect(() => {
    setLoading(true);
    API.get("/pages/" + active)
      .then((r) => setData(r.data?.content || {}))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [active]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/pages/" + active, { content: data });
      showToast("Page saved successfully!");
    } catch {
      showToast("Save failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast.msg && (
        <div className={`adm-toast${toast.type === "error" ? " adm-toast-error" : ""}`}>
          {toast.msg}
        </div>
      )}

      <h2 className="adm-section-title">Pages Manager</h2>

      {/* Page Tabs */}
      <div className="adm-tab-row" style={{ marginBottom: 24 }}>
        {PAGES.map((p) => (
          <button
            key={p.key}
            className={`adm-tab-btn${active === p.key ? " active" : ""}`}
            onClick={() => setActive(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="adm-loading">Loading...</div>
      ) : (
        <form className="adm-form" onSubmit={handleSave}>
          {page?.fields.map((f) => (
            <div key={f.name}>
              {breaks[f.name] && (
                <div style={{
                  margin: "24px 0 16px",
                  fontWeight: 700, fontSize: 13,
                  color: "#0047AB", textTransform: "uppercase",
                  letterSpacing: 1, borderBottom: "2px solid #e2e8f0",
                  paddingBottom: 6
                }}>
                  {breaks[f.name]}
                </div>
              )}
              <div className="adm-field">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={data[f.name] || ""}
                    onChange={(e) => setData((p) => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={data[f.name] || ""}
                    onChange={(e) => setData((p) => ({ ...p, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="adm-form-actions" style={{ marginTop: 24 }}>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Page"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
