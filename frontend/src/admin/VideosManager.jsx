import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaPlus, FaTimes, FaEdit, FaSearch } from "react-icons/fa";

const CATS = ["News", "Business", "Tech", "Culture", "Opportunities", "Sport", "Politics", "Sports", "Opinion"];
const EMPTY_FORM = { title: "", url: "", description: "", category: "News", isPublished: true };

export default function VideosManager() {
  const [videos,   setVideos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [confirm,  setConfirm]  = useState(null);
  const [editing,  setEditing]  = useState(null); // null = new, object = editing
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [search,   setSearch]   = useState("");
  const [filterCat,setFilterCat]= useState("All");

  const load = () => {
    setLoading(true);
    API.get("/videos")
      .then(r => setVideos(r.data?.videos || r.data?.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showToast = (m, err = false) => { setToast({ msg: m, err }); setTimeout(() => setToast(""), 3000); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm({ title: v.title || "", url: v.url || "", description: v.description || "", category: (typeof v.category === "object" ? v.category?.name : v.category) || "News", isPublished: v.isPublished !== false });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return showToast("Title and URL required.", true);
    setSaving(true);
    try {
      if (editing) {
        await API.put("/videos/" + editing._id, form);
        setVideos(p => p.map(v => v._id === editing._id ? { ...v, ...form } : v));
        showToast("✅ Video updated!");
      } else {
        const res = await API.post("/videos", form);
        setVideos(p => [res.data?.data || res.data, ...p]);
        showToast("✅ Video added!");
      }
      closeForm();
    } catch { showToast("Save failed.", true); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete("/videos/" + id);
      setVideos(v => v.filter(x => x._id !== id));
      showToast("Video deleted.");
    } catch { showToast("Delete failed.", true); }
    setConfirm(null);
  };

  const togglePublish = async (v) => {
    try {
      await API.put("/videos/" + v._id, { isPublished: !v.isPublished });
      setVideos(p => p.map(x => x._id === v._id ? { ...x, isPublished: !x.isPublished } : x));
      showToast(`Video ${!v.isPublished ? "published" : "unpublished"}.`);
    } catch { showToast("Update failed.", true); }
  };

  const embed = (url) => {
    const m = url?.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
    return m ? "https://www.youtube.com/embed/" + m[1] : url;
  };

  const filtered = videos.filter(v => {
    const q = search.toLowerCase();
    const matchQ = v.title?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q);
    const matchC = filterCat === "All" || (typeof v.category === "object" ? v.category?.name : v.category)?.toLowerCase() === filterCat.toLowerCase();
    return matchQ && matchC;
  });

  return (
    <div>
      {toast?.msg && <div className={`adm-toast${toast.err ? " adm-toast-error" : ""}`}>{toast.msg}</div>}

      {confirm && (
        <div className="adm-modal-bg"><div className="adm-modal">
          <p>Delete <strong>{confirm.title}</strong>? Cannot be undone.</p>
          <div className="adm-modal-btns">
            <button className="adm-btn adm-btn-danger"    onClick={() => handleDelete(confirm._id)}>Delete</button>
            <button className="adm-btn adm-btn-secondary" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div></div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="adm-section-title" style={{ marginBottom: 0 }}>
          Videos <span style={{ fontSize: 14, fontWeight: 400, color: "var(--mid-gray)" }}>({videos.length})</span>
        </h2>
        <button className="adm-btn adm-btn-primary" onClick={showForm ? closeForm : openNew}>
          {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Video</>}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="adm-form adm-card vm-form">
          <h3 style={{ marginBottom: 16, fontFamily: "var(--font-heading)", fontSize: 16 }}>
            {editing ? "✏️ Edit Video" : "➕ Add New Video"}
          </h3>
          <form onSubmit={handleSave}>
            <div className="adm-row">
              <div className="adm-field">
                <label>Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Video title..." required />
              </div>
              <div className="adm-field">
                <label>Category</label>
                <select value={form.category} onChange={e => set("category", e.target.value)}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="adm-field">
              <label>YouTube / Video URL *</label>
              <input value={form.url} onChange={e => set("url", e.target.value)}
                placeholder="https://youtube.com/watch?v=..." required />
              {form.url && embed(form.url) !== form.url && (
                <div className="vm-embed-preview">
                  <iframe src={embed(form.url)} title="preview" allowFullScreen frameBorder="0" style={{ width: "100%", height: 200, borderRadius: 8, marginTop: 8 }} />
                </div>
              )}
            </div>
            <div className="adm-field">
              <label>Description</label>
              <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Brief description of the video..." />
            </div>
            <div className="adm-field">
              <label className="adm-check-label">
                <input type="checkbox" checked={form.isPublished} onChange={e => set("isPublished", e.target.checked)} />
                &nbsp; Published (visible on site)
              </label>
            </div>
            <div className="adm-form-actions">
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                {saving ? "Saving..." : editing ? "💾 Update Video" : "➕ Add Video"}
              </button>
              <button type="button" className="adm-btn adm-btn-secondary" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="adm-toolbar" style={{ marginTop: showForm ? 20 : 0 }}>
        <div className="adm-search-wrap">
          <FaSearch className="adm-search-icon" />
          <input className="adm-search" placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="adm-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option>All</option>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? <div className="adm-loading">Loading videos...</div>
      : filtered.length === 0 ? (
        <div className="adm-empty">
          <p>No videos found.</p>
          <button className="adm-btn adm-btn-primary" onClick={openNew}><FaPlus /> Add First Video</button>
        </div>
      ) : (
        <div className="adm-video-grid">
          {filtered.map(v => (
            <div key={v._id} className="adm-video-card">
              <div className="adm-video-thumb">
                <iframe src={embed(v.url)} title={v.title} allowFullScreen frameBorder="0" />
              </div>
              <div className="adm-video-info">
                <div className="adm-video-title">{v.title}</div>
                <div className="adm-video-cat">{(typeof v.category === "object" ? v.category?.name : v.category)}</div>
                {v.description && <div className="adm-video-desc">{v.description}</div>}
                <div className="vm-status-row">
                  <button className={`adm-status-pill ${v.isPublished ? "published" : "draft"}`}
                    onClick={() => togglePublish(v)} title="Click to toggle visibility">
                    {v.isPublished ? "Published" : "Hidden"}
                  </button>
                </div>
              </div>
              <div className="vm-card-actions">
                <button className="adm-icon-btn edit"   onClick={() => openEdit(v)}   title="Edit"><FaEdit /></button>
                <button className="adm-icon-btn delete" onClick={() => setConfirm(v)} title="Delete"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



