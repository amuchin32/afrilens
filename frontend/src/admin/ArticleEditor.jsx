import React, { useState, useEffect, useRef } from "react";
import { createArticle, updateArticle } from "../services/articleService";
import { uploadImage } from "../services/uploadService";
import { FaUpload, FaTimes, FaEye, FaEdit, FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaHeading } from "react-icons/fa";

const CATS = ["News", "Business", "Tech", "Culture", "Opportunities", "Sport", "Videos"];
const EMPTY = {
  title: "", category: "News", status: "draft", summary: "",
  content: "", tags: "",
  oppType: "", vidType: "", videoUrl: "", isFeatured: false, isBreaking: false,
  coverImage: "", coverImageAlt: "", author: ""
};

export default function ArticleEditor({ article, categories, onDone }) {
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState("");
  const [imgPrev,   setImgPrev]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(false);
  const [tab,       setTab]       = useState("content");
  const fileRef    = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (article) {
      setForm({
        title:         article.title         || "",
        category: (typeof article.category === "object" ? article.category?.name : article.category) || "News",
        status:        article.status        || "draft",
        summary:       article.summary       || "",
        content:       article.content       || "",
        tags:          (article.tags || []).join(", "),
        isFeatured:    article.isFeatured    || false,
        isBreaking:    article.isBreaking    || false,
        coverImage:    article.coverImage    || "",
        coverImageAlt: article.coverImageAlt || "",
        author:        article.authorName    || "",
      });
      setImgPrev(article.coverImage || "");
    } else {
      setForm(EMPTY);
      setImgPrev("");
    }
    setPreview(false);
    setTab("content");
  }, [article]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const showToast = (m, err = false) => {
    setToast({ msg: m, err });
    setTimeout(() => setToast(""), 4000);
  };

  const insertText = (before, after = "") => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const selected = form.content.substring(start, end);
    const newVal = form.content.substring(0, start) + before + selected + after + form.content.substring(end);
    set("content", newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(start + before.length, end + before.length); }, 0);
  };

  const handleImage = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImgPrev(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", file);
      const res = await uploadImage(fd);
      set("coverImage", res.data?.url || res.data?.path || "");
      showToast("Image uploaded.");
    } catch {
      showToast("Upload failed.", true);
      setImgPrev(form.coverImage);
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e, forcePublish = false) => {
    e.preventDefault();
    if (!form.title.trim())   return showToast("Title is required.", true);
    if (!form.content.trim() && form.category !== 'Videos') return showToast('Content is required.', true);
    setSaving(true);
    const payload = { ...form, content: form.content || form.videoUrl || "Video content", excerpt: form.summary || form.title, videoUrl: form.videoUrl || "", tags: form.tags.split(",").map(t => t.trim()).filter(Boolean).concat(form.oppType && form.category === "Opportunities" ? [form.oppType] : []).concat(form.vidType && form.category === "Videos" ? [form.vidType] : []), ...(forcePublish ? { status: "published", publishedAt: new Date() } : {}) };
    try {
      if (article?._id) {
        await updateArticle(article._id, payload);
        showToast("? Article updated!");
      } else {
        await createArticle(payload);
        showToast("? Article created!");
      }
      setTimeout(onDone, 1200);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Save failed."; console.error("SUBMIT ERROR:", errMsg, err.response?.data); showToast(errMsg, true);
    } finally { setSaving(false); }
  };

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="ae-wrap">
      {toast?.msg && <div className={`adm-toast${toast.err ? " adm-toast-error" : ""}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="ae-header">
        <div>
          <h2 className="adm-section-title" style={{ marginBottom: 2 }}>
            {article ? "Edit Article" : "New Article"}
          </h2>
          <span className="ae-meta-info">{wordCount} words · ~{readTime} min read</span>
        </div>
        <div className="ae-header-actions">
          <button type="button" className={`adm-btn adm-btn-secondary${preview ? " active" : ""}`}
            onClick={() => setPreview(p => !p)}>
            {preview ? <><FaEdit /> Edit</> : <><FaEye /> Preview</>}
          </button>
          <button type="button" className="adm-btn adm-btn-secondary" onClick={onDone}>Cancel</button>
          <button type="button" className="adm-btn adm-btn-primary" disabled={saving} onClick={(e) => handleSubmit(e, form.status === "published" || !article)}>
            {saving ? "Saving..." : article ? "?? Update" : "?? Publish"}
          </button>
        </div>
      </div>

      {preview ? (
        <ArticlePreview form={form} imgPrev={imgPrev} />
      ) : (
        <form className="ae-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="ae-title-field">
            <input
              className="ae-title-input"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Article headline..."
              required
            />
          </div>

          {/* Quick meta row */}
          <div className="ae-meta-row">
            <div className="ae-meta-item">
              <label>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}>
                {(categories || CATS).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="ae-meta-item">
              <label>Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="ae-meta-item">
              <label>Author Name</label>
              <input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Reporter name..." />
            </div>
            {form.category === "Videos" && (
              <div className="ae-meta-item" style={{width:"100%"}}>
                <label>YouTube / Video URL</label>
                <input className="ae-input" value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)} placeholder="https://youtu.be/..." />
              </div>
            )}
            {form.category === "Videos" && (
              <div className="ae-meta-item">
                <label>Video Type</label>
                <select value={form.vidType} onChange={e => set("vidType", e.target.value)}>
                  <option value="">Select type...</option>
                  <option value="politics">Politics</option>
                  <option value="business">Business</option>
                  <option value="culture">Culture</option>
                  <option value="sports">Sports</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
            )}
            {form.category === "Opportunities" && (
              <div className="ae-meta-item">
                <label>Type</label>
                <select value={form.oppType} onChange={e => set("oppType", e.target.value)}>
                  <option value="">Select type...</option>
                  <option value="jobs">Jobs</option>
                  <option value="scholarships">Scholarships</option>
                  <option value="grants">Grants</option>
                  <option value="fellowships">Fellowships</option>
                  <option value="partnerships">Partnerships</option>
                </select>
              </div>
            )}
            <div className="ae-flags">
              <label className="ae-flag-label">
                <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} />
                ? Featured
              </label>
              <label className="ae-flag-label">
                <input type="checkbox" checked={form.isBreaking} onChange={e => set("isBreaking", e.target.checked)} />
                ?? Breaking
              </label>
            </div>
          </div>

          {/* Tabs */}
          <div className="ae-tabs">
            {["content", "media", "seo"].map(t => (
              <button key={t} type="button"
                className={`ae-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Tab */}
          {tab === "content" && (
            <div className="ae-content-tab">
              <div className="ae-toolbar">
                <button type="button" className="ae-tool-btn" title="Bold" onClick={() => insertText("**", "**")}><FaBold /></button>
                <button type="button" className="ae-tool-btn" title="Italic" onClick={() => insertText("_", "_")}><FaItalic /></button>
                <button type="button" className="ae-tool-btn" title="Heading" onClick={() => insertText("## ")}><FaHeading /></button>
                <button type="button" className="ae-tool-btn" title="Bullet List" onClick={() => insertText("\n- ")}><FaListUl /></button>
                <button type="button" className="ae-tool-btn" title="Numbered List" onClick={() => insertText("\n1. ")}><FaListOl /></button>
                <button type="button" className="ae-tool-btn" title="Link" onClick={() => insertText("[", "](url)")}><FaLink /></button>
              </div>
              <textarea
                ref={contentRef}
                className="ae-content-area"
                value={form.content}
                onChange={e => set("content", e.target.value)}
                placeholder="Write your article here... (Markdown supported)"
                rows={20}
              />
              <div className="ae-summary-field">
                <label className="ae-label">Summary / Excerpt</label>
                <textarea
                  className="ae-summary-area"
                  value={form.summary}
                  onChange={e => set("summary", e.target.value)}
                  placeholder="Brief summary shown in article cards (max 160 chars)..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Media Tab */}
          {tab === "media" && (
            <div className="ae-media-tab">
              <label className="ae-label">Cover Image</label>
              <div className="ae-img-upload-area" onClick={() => fileRef.current?.click()}>
                {imgPrev ? (
                  <div className="ae-img-preview-wrap">
                    <img src={imgPrev} alt="Cover preview" className="ae-img-preview" />
                    <button type="button" className="ae-img-remove"
                      onClick={e => { e.stopPropagation(); setImgPrev(""); set("coverImage", ""); }}>
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="ae-img-placeholder">
                    <FaUpload size={28} />
                    <p>Click to upload cover image</p>
                    <small>JPG, PNG, WebP — max 5MB</small>
                  </div>
                )}
                {uploading && <div className="ae-img-uploading">Uploading...</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
              <div style={{ marginTop: 12 }}>
                <label className="ae-label">Image Alt Text</label>
                <input
                  className="ae-input"
                  value={form.coverImageAlt}
                  onChange={e => set("coverImageAlt", e.target.value)}
                  placeholder="Describe the image for accessibility..."
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <label className="ae-label">Or paste image URL</label>
                <input
                  className="ae-input"
                  value={form.coverImage}
                  onChange={e => { set("coverImage", e.target.value); setImgPrev(e.target.value); }}
                  placeholder="https://..."
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {tab === "seo" && (
            <div className="ae-seo-tab">
              <label className="ae-label">Tags (comma separated)</label>
              <input
                className="ae-input"
                value={form.tags}
                onChange={e => set("tags", e.target.value)}
                placeholder="africa, politics, economy..."
              />

              <div className="ae-seo-checklist">
                <div className="ae-seo-row">
                  <span>Title length:</span>
                  <span className={form.title.length > 70 ? "ae-seo-warn" : form.title.length > 0 ? "ae-seo-ok" : ""}>
                    {form.title.length} / 70 chars {form.title.length > 70 ? "?? Too long" : form.title.length > 0 ? "?" : ""}
                  </span>
                </div>
                <div className="ae-seo-row">
                  <span>Summary length:</span>
                  <span className={form.summary.length > 160 ? "ae-seo-warn" : form.summary.length > 0 ? "ae-seo-ok" : ""}>
                    {form.summary.length} / 160 chars {form.summary.length > 160 ? "??" : form.summary.length > 0 ? "?" : ""}
                  </span>
                </div>
                <div className="ae-seo-row">
                  <span>Word count:</span>
                  <span className={wordCount < 300 ? "ae-seo-warn" : "ae-seo-ok"}>
                    {wordCount} words {wordCount < 300 ? "?? Short" : "? Good"}
                  </span>
                </div>
                <div className="ae-seo-row">
                  <span>Cover image:</span>
                  <span className={form.coverImage ? "ae-seo-ok" : "ae-seo-warn"}>
                    {form.coverImage ? "? Set" : "?? Missing"}
                  </span>
                </div>
                <div className="ae-seo-row">
                  <span>Tags:</span>
                  <span className={form.tags ? "ae-seo-ok" : "ae-seo-warn"}>
                    {form.tags ? `? ${form.tags.split(",").filter(Boolean).length} tag(s)` : "?? None"}
                  </span>
                </div>
              </div>

              <div className="ae-seo-preview">
                <div className="ae-seo-preview-label">Google Preview</div>
                <div className="ae-seo-preview-box">
                  <div className="ae-seo-preview-url">afrilens.com › {form.category?.toLowerCase()} › {form.title.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}</div>
                  <div className="ae-seo-preview-title">{form.title || "Article Title"}</div>
                  <div className="ae-seo-preview-desc">{form.summary || "Article summary will appear here..."}</div>
                </div>
              </div>
            </div>
          )}

          <div className="adm-form-actions" style={{ marginTop: 24 }}>
            <button type="button" className="adm-btn adm-btn-primary" disabled={saving} onClick={(e) => handleSubmit(e, form.status === "published" || !article)}>
              {saving ? "Saving..." : article ? "?? Update Article" : "?? Publish Article"}
            </button>
            <button type="button" className="adm-btn adm-btn-secondary" onClick={onDone}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

function ArticlePreview({ form, imgPrev }) {
  return (
    <div className="ae-preview">
      <div className="ae-preview-badge-row">
        {form.isBreaking && <span className="ae-preview-badge breaking">?? Breaking</span>}
        {form.isFeatured && <span className="ae-preview-badge featured">? Featured</span>}
      </div>
      {imgPrev && <img src={imgPrev} alt={form.coverImageAlt || form.title} className="ae-preview-cover" />}
      <div className="ae-preview-meta">
        <span className="ae-preview-cat">{form.category}</span>
        {form.author && <span className="ae-preview-author">By {form.author}</span>}
      </div>
      <h1 className="ae-preview-title">{form.title || "Article Title"}</h1>
      {form.summary && <p className="ae-preview-summary">{form.summary}</p>}
      <div className="ae-preview-body">
        {form.content ? form.content.split("\n").map((line, i) => <p key={i}>{line}</p>) : <p style={{ color: "#aaa" }}>No content yet...</p>}
      </div>
    </div>
  );
}




















