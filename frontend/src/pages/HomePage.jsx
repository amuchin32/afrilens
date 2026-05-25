import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../components/common/ArticleCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NewsletterSignup from "../components/common/NewsletterSignup";
import { getFeaturedArticles, getArticles } from "../services/articleService";
import { PLACEHOLDER_IMG } from "../utils/constants";
import { timeAgo } from "../utils/formatDate";
import { FaArrowRight, FaFire, FaStar, FaNewspaper } from "react-icons/fa";

const extractArticles = (res) => {
  const d = res?.data;
  return Array.isArray(d?.articles) ? d.articles
       : Array.isArray(d?.data)     ? d.data
       : [];
};

const getCatName  = (cat) => typeof cat === "object" ? cat?.name  || "" : cat || "";
const getCatColor = (cat) => typeof cat === "object" ? cat?.color || "var(--primary)" : "var(--primary)";
const getCatSlug  = (cat) => typeof cat === "object" ? cat?.slug || cat?.name?.toLowerCase() || "news" : (cat || "news").toLowerCase();
const articleLink = (article) => `/${getCatSlug(article.category)}/${article.slug}`;

const EmptyState = ({ message }) => (
  <div style={{ textAlign:"center", padding:"60px 20px", color:"#888" }}>
    <FaNewspaper size={48} style={{ marginBottom:16, opacity:0.3 }} />
    <h3 style={{ fontWeight:600, marginBottom:8 }}>{message}</h3>
    <p style={{ fontSize:"0.9rem" }}>Check back soon — stories will appear here once published from the admin.</p>
  </div>
);

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [latest,   setLatest]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedArticles(),
      getArticles({ limit: 6, status: "published" })
    ])
      .then(([featRes, latRes]) => {
        setFeatured(extractArticles(featRes));
        setLatest(extractArticles(latRes));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hero = featured[0] || latest[0];

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"60vh" }}>
      <LoadingSpinner />
    </div>
  );

  return (
    <>
      {/* HERO SECTION */}
      <section className="py-4" style={{ background:"var(--off-white)" }}>
        <div className="container">
          {!hero ? (
            <EmptyState message="No published articles yet" />
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="hero-article">
                  <img src={hero.coverImage || PLACEHOLDER_IMG} alt={hero.title}
                    onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                  <div className="hero-content">
                    {hero.category && (
                      <span className="badge-category mb-2 d-inline-block"
                        style={{ background: getCatColor(hero.category) }}>
                        {getCatName(hero.category)}
                      </span>
                    )}
                    {hero.isBreaking && (
                      <span className="badge-category badge-breaking mb-2 ms-1 d-inline-block">Breaking</span>
                    )}
                    <h1 className="hero-title">
                      <Link to={articleLink(hero)} style={{ color:"white" }}>{hero.title}</Link>
                    </h1>
                    <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"0.9rem", marginBottom:12 }}>
                      {hero.excerpt || hero.summary}
                    </p>
                    <div className="article-meta" style={{ color:"rgba(255,255,255,0.7)" }}>
                      <span>By {hero.author?.name || hero.authorName || "AfriLENS Staff"}</span>
                      <span>{timeAgo(hero.publishedAt || hero.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-flex flex-column gap-3">
                {(featured.slice(1,3).length ? featured.slice(1,3) : latest.slice(1,3)).map(article => (
                  <div key={article._id} className="article-card card" style={{ flex:1 }}>
                    <div className="card-img-wrapper" style={{ height:"140px" }}>
                      <Link to={articleLink(article)}>
                        <img src={article.coverImage || PLACEHOLDER_IMG} alt={article.title}
                          onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                      </Link>
                    </div>
                    <div className="card-body p-3">
                      {article.category && (
                        <span className="badge-category mb-1 d-inline-block"
                          style={{ background: getCatColor(article.category), fontSize:"0.65rem" }}>
                          {getCatName(article.category)}
                        </span>
                      )}
                      <h6 className="card-title" style={{ fontSize:"0.92rem" }}>
                        <Link to={articleLink(article)}>{article.title}</Link>
                      </h6>
                      <div className="article-meta">
                        <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0">
              <FaFire style={{ color:"var(--accent)", marginRight:8 }} />Latest News
            </h2>
            <Link to="/news" className="btn-primary-custom d-flex align-items-center gap-2">
              All News <FaArrowRight size={12} />
            </Link>
          </div>
          {latest.length === 0 ? (
            <EmptyState message="No articles published yet" />
          ) : (
            <div className="row g-4">
              {latest.map(article => (
                <div className="col-lg-4 col-md-6" key={article._id}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup />

      {featured.length > 0 && (
        <section className="py-5" style={{ background:"var(--off-white)" }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">
                <FaStar style={{ color:"#FFD700", marginRight:8 }} />Featured Stories
              </h2>
            </div>
            <div className="row g-4">
              {featured.map(article => (
                <div className="col-lg-4 col-md-6" key={article._id + "-feat"}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;
