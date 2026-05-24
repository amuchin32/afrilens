import React, { useEffect, useState, useCallback } from "react";
import { getArticles, deleteArticle, updateArticle } from "../services/articleService";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaNewspaper, FaBriefcase, FaMicrochip, FaPalette, FaBullhorn, FaGlobe } from "react-icons/fa";

const CATS = ["All", "News", "Business", "Tech", "Culture", "Opportunities", "Sport", "Videos"];
const STATUSES = ["All", "published", "draft"];

const CAT_ICONS = {
  All: <FaGlobe />, News: <FaNewspaper />, Business: <FaBriefcase />,
  Tech: <FaMicrochip />, Culture: <FaPalette />, Opportunities: <FaBullhorn />, Sport: <FaGlobe />,
};

// Safely get category name whether it is a string or populated object
const catName = (cat) => {
  if (!cat) return "";
  if (typeof cat === "string") return cat;
  if (typeof cat === "object") return cat.name || "";
  return String(cat);
};

export default function ArticlesManager({ onEdit, onNew }) {
  const [articles,   setArticles]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All");
  const [toast,      setToast]      = useState("");
  const [confirm,    setConfirm]    = useState(null);
  const [selected,   setSelected]   = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setSelected([]);
    const params = { limit: 200 };
    if (cat !== "All")    params.category = cat.toLowerCase();
    params.status = status === "All" ? "All" : status;
    getArticles(params)
      .then(r => {
        const data = r.data?.data?.articles || r.data?.articles || r.data?.data || [];
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [cat, status]);

  useEffect(() => { load(); }, [load]);

  const showToast = (m, err = false) => {
    setToast({ msg: m, err });
    setTimeout(() => setToast(""), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      setArticles(p => p.filter(a => a._id !== id));
      showToast("Article deleted.");
    } catch { showToast("Delete failed.", true); }
    setConfirm(null);
  };

  const toggleStatus = async (art) => {
    const next = art.status === "published" ? "draft" : "published";
    try {
      await updateArticle(art._id, { status: next });
      setArticles(p => p.map(a => a._id === art._id ? { ...a, status: next } : a));
      showToast(`Marked as ${next}.`);
    } catch { showToast("Update failed.", true); }
  };

  const toggleFeatured = async (art) => {
    const next = !art.isFeatured;
    try {
      await updateArticle(art._id, { isFeatured: next });
      setArticles(p => p.map(a => a._id === art._id ? { ...a, isFeatured: next } : a));
    } catch { showToast("Update failed.", true); }
  };

  const toggleBreaking = async (art) => {
    const next = !art.isBreaking;
    try {
      await updateArticle(art._id, { isBreaking: next });
      setArticles(p => p.map(a => a._id === art._id ? { ...a, isBreaking: next } : a));
    } catch { showToast("Update failed.", true); }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selected.length === 0) return;
    if (bulkAction === "delete") {
      if (!window.confirm(`Delete ${selected.length} articles? Cannot be undone.`)) return;
      for (const id of selected) { try { await deleteArticle(id); } catch {} }
      setArticles(p => p.filter(a => !selected.includes(a._id)));
      showToast(`${selected.length} articles deleted.`);
    } else {
      for (const id of selected) { try { await updateArticle(id, { status: bulkAction }); } catch {} }
      setArticles(p => p.map(a => selected.includes(a._id) ? { ...a, status: bulkAction } : a));
      showToast(`${selected.length} articles marked as ${bulkAction}.`);
    }
    setSelected([]);
    setBulkAction("");
  };

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll   = () => setSelected(selected.length === filtered.length ? [] : filtered.map(a => a._id));

  const filtered = articles.filter(a => {
    const q   = search.toLowerCase();
    const cn  = catName(a.category).toLowerCase();
    const matches = !q || a.title?.toLowerCase().includes(q) || cn.includes(q) || (a.summary || a.excerpt || "").toLowerCase().includes(q);
    const catMatch = cat === "All" || cn === cat.toLowerCase();
    return matches && catMatch;
  });

  const counts = CATS.reduce((acc, c) => {
    acc[c] = c === "All" ? articles.length : articles.filter(a => catName(a.category).toLowerCase() === c.toLowerCase()).length;
    return acc;
  }, {});

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";

  return (
    <div>
      {toast?.msg && <div className={`adm-toast${toast.err ? " adm-toast-error" : ""}`}>{toast.msg}</div>}

      {confirm && (
        <div className="adm-modal-bg">
          <div className="adm-modal">
            <p>Delete <strong>{confirm.title}</strong>? Cannot be undone.</p>
            <div className="adm-modal-btns">
              <button className="adm-btn adm-btn-danger"    onClick={() => handleDelete(confirm._id)}>Delete</button>
              <button className="adm-btn adm-btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="am-cat-tabs">
        {CATS.map(c => (
          <button key={c} className={`am-cat-tab${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
            <span className="am-cat-icon">{CAT_ICONS[c]}</span>
            {c}
            {counts[c] > 0 && <span className="am-cat-count">{counts[c]}</span>}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <FaSearch className="adm-search-icon" />
          <input className="adm-search" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="adm-btn adm-btn-primary" onClick={onNew}><FaPlus /> New Article</button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="am-bulk-bar">
          <span>{selected.length} selected</span>
          <select className="adm-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">Bulk action...</option>
            <option value="published">Publish</option>
            <option value="draft">Set to Draft</option>
            <option value="delete">Delete</option>
          </select>
          <button className="adm-btn adm-btn-primary" onClick={handleBulkAction} disabled={!bulkAction}>Apply</button>
          <button className="adm-btn adm-btn-secondary" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}

      {loading ? (
        <div className="adm-loading">Loading articles...</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <p>No articles found{cat !== "All" ? ` in ${cat}` : ""}.</p>
          <button className="adm-btn adm-btn-primary" onClick={onNew}><FaPlus /> Create First Article</button>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="am-results-bar">Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}</div>
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Breaking</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(art => (
                <tr key={art._id} className={selected.includes(art._id) ? "am-row-selected" : ""}>
                  <td>
                    <input type="checkbox" checked={selected.includes(art._id)} onChange={() => toggleSelect(art._id)} />
                  </td>
                  <td className="adm-td-title">
                    <div className="am-title-cell">
                      {art.coverImage && <img src={art.coverImage} alt="" className="am-thumb" />}
                      <div>
                        <div className="am-title-text">{art.title}</div>
                        {(art.summary || art.excerpt) && (
                          <div className="am-summary-text">{(art.summary || art.excerpt).slice(0, 80)}...</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td><span className="adm-badge-cat">{catName(art.category)}</span></td>
                  <td>
                    <button className={`adm-status-pill ${art.status}`} onClick={() => toggleStatus(art)} title="Click to toggle">
                      {art.status}
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button className={`am-flag-btn${art.isFeatured ? " on" : ""}`} onClick={() => toggleFeatured(art)} title="Toggle featured">
                      {art.isFeatured ? "?" : "?"}
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button className={`am-flag-btn${art.isBreaking ? " on" : ""}`} onClick={() => toggleBreaking(art)} title="Toggle breaking">
                      {art.isBreaking ? "??" : "?"}
                    </button>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatDate(art.createdAt)}</td>
                  <td>
                    <div className="adm-action-btns">
                      <button className="adm-action-btn edit" style={{background:"#fd7e14",color:"white",border:"none"}}   onClick={() => onEdit(art)}       title="Edit"><FaEdit /></button>
                      <button className="adm-action-btn delete" style={{background:"#dc3545",color:"white",border:"none"}} onClick={() => setConfirm(art)}   title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}






