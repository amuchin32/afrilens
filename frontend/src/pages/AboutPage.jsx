import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaNewspaper, FaGlobe, FaUsers, FaAward, FaEnvelope, FaTwitter, FaLinkedin } from "react-icons/fa";
import API from "../services/api";

const TEAM = [
  { name: "Amara Kofi", role: "Editor in Chief", bio: "Award-winning journalist with 15 years covering pan-African politics and economics.", initials: "AK" },
  { name: "Fatima Diallo", role: "Head of Digital", bio: "Digital media strategist driving AfriLENS's growth across platforms.", initials: "FD" },
  { name: "Chidi Okonkwo", role: "Senior Correspondent", bio: "Based in Lagos, covering West Africa's business and technology landscape.", initials: "CO" },
  { name: "Naledi Dlamini", role: "Culture Editor", bio: "Champion of African arts, music and cultural storytelling.", initials: "ND" },
];

const VALUES = [
  { emoji: "🔍", title: "Accuracy First", body: "Every story is verified through multiple independent sources before publication." },
  { emoji: "🌍", title: "Pan-African Perspective", body: "We centre African voices and lived experiences in every story we tell." },
  { emoji: "⚡", title: "Independent & Bold", body: "We are editorially independent, funded by readers, not political interests." },
  { emoji: "📱", title: "Digital-Native", body: "Built for the mobile-first African reader — fast, accessible, clear." },
];

const DEFAULTS = {
  heroTitle: "Africa's Lens on the World",
  heroLead: "AfriLENS is an independent digital news platform dedicated to telling Africa's stories with depth, accuracy and pride. We believe the continent deserves world-class journalism — and that journalism should centre African perspectives.",
  missionTitle: "Journalism that serves Africa",
  missionBody1: "Founded in 2020, AfriLENS was built on one conviction: African stories, told by Africans, for the world. Too often, the continent's complexity is flattened into a single narrative. We exist to change that — with nuanced, on-the-ground reporting that refuses to simplify.",
  missionBody2: "From politics and business to culture, technology and opportunity, we cover the stories that shape daily life across 54 nations — and the diaspora communities that carry Africa's spirit everywhere they go.",
  missionQuote: "We don't just report on Africa. We report from Africa — with all the context, nuance and humanity that requires.",
  stat1Value: "2M+",  stat1Label: "Monthly Readers",
  stat2Value: "50+",  stat2Label: "Countries Reached",
  stat3Value: "10K+", stat3Label: "Stories Published",
  stat4Value: "12",   stat4Label: "Awards Won",
  ctaTitle: "Join the AfriLENS community",
  ctaSubtitle: "Subscribe for free to get Africa's most important stories in your inbox every morning.",
};

export default function AboutPage() {
  const [cfg, setCfg] = useState(DEFAULTS);

  useEffect(() => {
    API.get("/pages/about")
      .then((r) => {
        if (r.data?.content) setCfg({ ...DEFAULTS, ...r.data.content });
      })
      .catch(() => {});
  }, []);

  const STATS = [
    { value: cfg.stat1Value, label: cfg.stat1Label, icon: FaUsers },
    { value: cfg.stat2Value, label: cfg.stat2Label, icon: FaGlobe },
    { value: cfg.stat3Value, label: cfg.stat3Label, icon: FaNewspaper },
    { value: cfg.stat4Value, label: cfg.stat4Label, icon: FaAward },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-pattern" />
        <div className="container">
          <div className="about-hero-inner">
            <span className="cp-banner-eyebrow">Who We Are</span>
            <h1 className="about-hero-title">{cfg.heroTitle}</h1>
            <p className="about-hero-lead">{cfg.heroLead}</p>
            <div className="about-hero-ctas">
              <Link to="/contact" className="about-btn-primary">Contact Us</Link>
              <Link to="/news" className="about-btn-secondary">Read Our Coverage</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats-bar">
        <div className="container">
          <div className="about-stats-grid">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="about-stat">
                <div className="about-stat-icon"><Icon size={20} /></div>
                <div className="about-stat-value">{value}</div>
                <div className="about-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container about-body">
        {/* Mission */}
        <div className="about-section about-mission">
          <div className="about-section-text">
            <span className="about-section-label">Our Mission</span>
            <h2 className="about-section-title">{cfg.missionTitle}</h2>
            <p>{cfg.missionBody1}</p>
            <p>{cfg.missionBody2}</p>
          </div>
          <div className="about-mission-visual">
            <div className="about-mission-card">
              <span className="about-mission-card-icon">🌍</span>
              <blockquote className="about-mission-quote">"{cfg.missionQuote}"</blockquote>
              <cite>— AfriLENS Editorial Team</cite>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="about-section">
          <div className="about-section-center">
            <span className="about-section-label">Our Values</span>
            <h2 className="about-section-title">What we stand for</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map(({ emoji, title, body }) => (
              <div key={title} className="about-value-card">
                <div className="about-value-emoji">{emoji}</div>
                <h3 className="about-value-title">{title}</h3>
                <p className="about-value-body">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="about-section">
          <div className="about-section-center">
            <span className="about-section-label">The Team</span>
            <h2 className="about-section-title">The people behind the stories</h2>
          </div>
          <div className="about-team-grid">
            {TEAM.map(({ name, role, bio, initials }) => (
              <div key={name} className="about-team-card">
                <div className="about-team-avatar">{initials}</div>
                <div className="about-team-info">
                  <h3 className="about-team-name">{name}</h3>
                  <span className="about-team-role">{role}</span>
                  <p className="about-team-bio">{bio}</p>
                  <div className="about-team-links">
                    <a href="#" className="about-social-link"><FaTwitter /></a>
                    <a href="#" className="about-social-link"><FaLinkedin /></a>
                    <a href="#" className="about-social-link"><FaEnvelope /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta-band">
          <h2 className="about-cta-title">{cfg.ctaTitle}</h2>
          <p className="about-cta-sub">{cfg.ctaSubtitle}</p>
          <div className="about-cta-form">
            <input type="email" placeholder="Your email address" className="about-cta-input" />
            <button className="about-cta-btn">Subscribe Free</button>
          </div>
        </div>
      </div>
    </div>
  );
}
