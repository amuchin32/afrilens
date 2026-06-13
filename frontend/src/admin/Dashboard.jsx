import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ArticlesManager from "./ArticlesManager";
import ArticleEditor from "./ArticleEditor";
import VideosManager from "./VideosManager";
import PagesManager from "./PagesManager";
import MediaManager from "./MediaManager";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ContactMessages from "./ContactMessages";
import SocialLinksManager from "./SocialLinksManager";
import { FaNewspaper, FaVideo, FaImages, FaFileAlt, FaSignOutAlt, FaPlus, FaBars, FaTimes, FaTachometerAlt, FaEnvelope, FaShareAlt } from "react-icons/fa";

const NAV = [
  { key: "overview", label: "Overview",          icon: <FaTachometerAlt /> },
  { key: "articles", label: "All Articles",       icon: <FaNewspaper /> },
  { key: "new",      label: "New Article",        icon: <FaPlus /> },
  { key: "videos",   label: "Videos",             icon: <FaVideo /> },
  { key: "media",    label: "Media Library",      icon: <FaImages /> },
  { key: "pages",    label: "Pages",              icon: <FaFileAlt /> },
  { key: "messages", label: "Contact Messages",   icon: <FaEnvelope /> },
  { key: "social",   label: "Social Links",       icon: <FaShareAlt /> },
];

const CATEGORIES = ["News","Business","Tech","Culture","Opportunities","Sport"];

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [active,      setActive]      = useState("overview");
  const [editArticle, setEditArticle] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey,  setRefreshKey]  = useState(0);

  const handleLogout = () => { logoutUser(); navigate("/login"); };
  const go = (key) => { setActive(key); setEditArticle(null); setSidebarOpen(false); };
  const openEdit = (article) => { setEditArticle(article); setActive("new"); setSidebarOpen(false); };
  const handleSaveDone = () => { setRefreshKey(k => k + 1); go("articles"); };

  return (
    <div className="adm-shell">
      <aside className={`adm-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="adm-logo">
          <img src="/afrilens-logo.png" alt="AfriLENS" style={{height:"48px",width:"auto",objectFit:"contain"}} />
          <button className="adm-close-btn" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
        </div>
        <nav className="adm-nav">
          {NAV.map(n => (
            <button key={n.key} className={`adm-nav-btn${active === n.key ? " active" : ""}`} onClick={() => go(n.key)}>
              <span className="adm-nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <button className="adm-logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      {sidebarOpen && <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="adm-main">
        <header className="adm-header">
          <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}><FaBars /></button>
          <span className="adm-header-title">{NAV.find(n => n.key === active)?.label || "Dashboard"}</span>
          <span className="adm-user-badge">{user?.name}</span>
        </header>
        <div className="adm-content" style={{ paddingBottom: "120px" }}>
          {active === "overview"  && <Overview onGo={go} refreshKey={refreshKey} />}
          {active === "articles"  && <ArticlesManager onEdit={openEdit} onNew={() => go("new")} refreshKey={refreshKey} />}
          {active === "new"       && <ArticleEditor article={editArticle} categories={CATEGORIES} onDone={handleSaveDone} />}
          {active === "videos"    && <VideosManager />}
          {active === "media"     && <MediaManager />}
          {active === "pages"     && <PagesManager />}
          {active === "messages"  && <ContactMessages />}
          {active === "security"  && <ChangePasswordPage />}
          {active === "social"    && <SocialLinksManager />}
        </div>
      </div>
    </div>
  );
}

function Overview({ onGo, refreshKey }) {
  const [stats, setStats] = React.useState({ total: "--", published: "--", draft: "--" });
  React.useEffect(() => {
    import("../services/articleService").then(({ getArticles }) => {
      getArticles({ limit: 1000 })
        .then(r => {
          const arts = r.data?.articles || [];
          setStats({ total: arts.length, published: arts.filter(a => a.status === "published").length, draft: arts.filter(a => a.status === "draft").length });
        }).catch(() => {});
    });
  }, [refreshKey]);

  return (
    <div>
      <h2 className="adm-section-title">Dashboard Overview</h2>
      <div className="adm-stats-grid">
        {[
          { label: "Total Articles", value: stats.total,     color: "#0047AB" },
          { label: "Published",      value: stats.published, color: "#16a34a" },
          { label: "Drafts",         value: stats.draft,     color: "#d97706" },
        ].map(c => (
          <button key={c.label} className="adm-stat-card" onClick={() => onGo("articles")} style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="adm-stat-value" style={{ color: c.color }}>{c.value}</div>
            <div className="adm-stat-label">{c.label}</div>
          </button>
        ))}
      </div>
      <div className="adm-quick-actions">
        <h3 className="adm-sub-title">Quick Actions</h3>
        <div className="adm-qa-grid">
          {[
            { label: "+ New Article", key: "new" },
            { label: "All Articles",  key: "articles" },
            { label: "Videos",        key: "videos" },
            { label: "Media Library", key: "media" },
            { label: "Pages",         key: "pages" },
            { label: "Social Links",  key: "social" },
          ].map(q => (
            <button key={q.key} className="adm-qa-btn" onClick={() => onGo(q.key)}>{q.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}


