import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticle } from "../services/articleService";
import { PLACEHOLDER_IMG } from "../utils/constants";
import { timeAgo } from "../utils/formatDate";
import { FaClock, FaUser, FaTag, FaArrowLeft } from "react-icons/fa";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getArticle(slug)
      .then(r => {
        const data = r.data?.data || r.data;
        setArticle(data);
      })
      .catch(() => setError("Article not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh" }}>
      <div className="cp-spinner" style={{ width:40, height:40 }} />
    </div>
  );

  if (error || !article) return (
    <div className="container py-5 text-center">
      <h2>Article not found</h2>
      <p>The article you are looking for does not exist or has been removed.</p>
      <Link to="/" className="adm-btn adm-btn-primary"><FaArrowLeft /> Back to Home</Link>
    </div>
  );

  const cat     = typeof article.category === "object" ? article.category?.name : article.category;
  const catSlug = (cat || "news").toLowerCase();
  const author  = article.author?.name || article.authorName || "AfriLENS Staff";

  return (
    <div className="article-page">
      {/* Banner */}
      <div className="article-hero" style={{ position:"relative", background:"#0a1628", minHeight:360 }}>
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.4 }}
            onError={e => { e.target.style.display = "none"; }}
          />
        )}
        <div className="container" style={{ position:"relative", zIndex:2, paddingTop:60, paddingBottom:60 }}>
          <Link to={`/${catSlug}`} style={{ color:"rgba(255,255,255,0.7)", textDecoration:"none", fontSize:"0.85rem" }}>
            <FaArrowLeft style={{ marginRight:6 }} />{cat}
          </Link>
          <h1 style={{ color:"#fff", fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:800, marginTop:16, lineHeight:1.2 }}>
            {article.title}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"1.05rem", marginTop:12, maxWidth:700 }}>
            {article.summary || article.excerpt}
          </p>
          <div style={{ display:"flex", gap:20, marginTop:20, color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", flexWrap:"wrap" }}>
            <span><FaUser style={{ marginRight:5 }} />By {author}</span>
            <span><FaClock style={{ marginRight:5 }} />{timeAgo(article.publishedAt || article.createdAt)}</span>
            {article.readTime && <span>~{article.readTime} min read</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ maxWidth:780, paddingTop:48, paddingBottom:64 }}>
        {article.isBreaking && (
          <div style={{ background:"#e63946", color:"#fff", padding:"8px 16px", borderRadius:6, marginBottom:24, fontWeight:700 }}>
            🔴 Breaking News
          </div>
        )}
        <div className="article-body" style={{ fontSize:"1.08rem", lineHeight:1.85, color:"var(--text)" }}>
          {(article.content || "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={{ marginBottom:20 }}>{para}</p>
          ))}
        </div>

        {article.tags?.length > 0 && (
          <div style={{ marginTop:40, display:"flex", gap:8, flexWrap:"wrap" }}>
            <FaTag style={{ color:"var(--primary)", marginTop:4 }} />
            {article.tags.map(tag => (
              <span key={tag} style={{ background:"#f0f4ff", color:"var(--primary)", padding:"4px 12px", borderRadius:20, fontSize:"0.8rem" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop:48, paddingTop:24, borderTop:"1px solid #eee" }}>
          <Link to={`/${catSlug}`} style={{ color:"var(--primary)", textDecoration:"none", fontWeight:600 }}>
            <FaArrowLeft style={{ marginRight:6 }} />Back to {cat}
          </Link>
        </div>
      </div>
    </div>
  );
}
