import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../../services/articleService";
import { FaClock, FaSearch, FaFire, FaChevronRight, FaShareAlt, FaBookmark } from "react-icons/fa";
import { PLACEHOLDER_IMG } from "../../utils/constants";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const readTime = (text = "") => Math.max(1, Math.round((text?.split(" ").length || 200) / 200));

const getCatName = (cat) => typeof cat === "object" ? cat?.name || "" : cat || "";
const getArticleLink = (article) => {
  const cat = getCatName(article.category).toLowerCase() || "news";
  return `/${cat}/${article.slug}`;
};

const HeroCard = ({ article }) => {
  const img = article.coverImage || PLACEHOLDER_IMG;
  return (
    <div className="cp-hero-card">
      <Link to={getArticleLink(article)} className="cp-hero-card-img-wrap">
        <img src={img} alt={article.title} loading="lazy" />
        <div className="cp-hero-card-overlay" />
        {article.isBreaking && <span className="cp-badge cp-badge-breaking">?? Breaking</span>}
      </Link>
      <div className="cp-hero-card-body">
        <span className="cp-cat-pill">{getCatName(article.category)}</span>
        <Link to={getArticleLink(article)}><h2 className="cp-hero-card-title">{article.title}</h2></Link>
        <p className="cp-hero-card-summary">{article.summary || article.excerpt}</p>
        <div className="cp-meta-row">
          <span className="cp-meta"><FaClock size={11} /> {formatDate(article.createdAt)}</span>
          <span className="cp-meta">{readTime(article.content)} min read</span>
          <button className="cp-icon-btn" title="Save"><FaBookmark size={12} /></button>
          <button className="cp-icon-btn" title="Share"><FaShareAlt size={12} /></button>
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  const img = article.coverImage || PLACEHOLDER_IMG;
  return (
    <div className="cp-card">
      <Link to={getArticleLink(article)} className="cp-card-img-wrap">
        <img src={img} alt={article.title} loading="lazy" />
        {article.isBreaking && <span className="cp-badge cp-badge-breaking">Breaking</span>}
        {article.isFeatured && !article.isBreaking && <span className="cp-badge cp-badge-featured">Featured</span>}
      </Link>
      <div className="cp-card-body">
        <span className="cp-cat-pill">{getCatName(article.category)}</span>
        <Link to={getArticleLink(article)}><h3 className="cp-card-title">{article.title}</h3></Link>
        <p className="cp-card-summary">{article.summary || article.excerpt}</p>
        <div className="cp-meta-row">
          <span className="cp-meta"><FaClock size={10} /> {formatDate(article.createdAt)}</span>
          <span className="cp-meta">{readTime(article.content)} min read</span>
        </div>
      </div>
    </div>
  );
};

const ListCard = ({ article, rank }) => (
  <Link to={getArticleLink(article)} className="cp-list-card">
    <span className="cp-list-rank">{String(rank).padStart(2, "0")}</span>
    <div className="cp-list-body">
      <p className="cp-list-title">{article.title}</p>
      <span className="cp-meta"><FaClock size={10} /> {formatDate(article.createdAt)}</span>
    </div>
    {article.coverImage && <img src={article.coverImage} alt="" className="cp-list-thumb" />}
  </Link>
);

const SidebarCard = ({ article }) => {
  const img = article.coverImage || PLACEHOLDER_IMG;
  return (
    <Link to={getArticleLink(article)} className="cp-sidebar-card">
      <img src={img} alt={article.title} loading="lazy" />
      <div className="cp-sidebar-card-body">
        <p className="cp-sidebar-card-title">{article.title}</p>
        <span className="cp-meta"><FaClock size={10} /> {formatDate(article.createdAt)}</span>
      </div>
    </Link>
  );
};

const safeArray = (val) => (Array.isArray(val) ? val : []);

export default function CategoryPage({ category, label, description, color, icon: Icon }) {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(false);
  const [filter,   setFilter]   = useState("latest");
  const PER_PAGE = 9;

  const load = useCallback((p = 1, q = "", f = "latest") => {
    setLoading(true);
    const params = {
      category: category.toLowerCase(),
      status: "published",
      limit: PER_PAGE,
      page: p,
      sort: f === "popular" ? "views" : "-createdAt",
    };
    if (q) params.search = q;
    getArticles(params)
      .then(r => {
        const arts = safeArray(r.data?.data?.articles || r.data?.articles || r.data?.data);
        setArticles(prev => p === 1 ? arts : [...prev, ...arts]);
        setHasMore(arts.length === PER_PAGE);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    load(1);
    getArticles({ status: "published", limit: 5, sort: "views" })
      .then(r => setTrending(safeArray(r.data?.data?.articles || r.data?.articles || r.data?.data)))
      .catch(() => setTrending([]));
  }, [load]);

  const handleSearch = (e) => { e.preventDefault(); load(1, search, filter); };
  const handleFilter = (f) => { setFilter(f); load(1, search, f); };

  const hero = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="cp-page">
      <div className="cp-banner" style={{ background: `linear-gradient(135deg, #0a1628 0%, ${color || "#0047AB"} 100%)` }}>
        <div className="cp-banner-pattern" />
        <div className="container">
          <div className="cp-banner-inner">
            <div className="cp-banner-left">
              {Icon && <div className="cp-banner-icon"><Icon size={36} /></div>}
              <div className="cp-banner-text">
                <span className="cp-banner-eyebrow">AfriLENS Coverage</span>
                <h1 className="cp-banner-title">{label}</h1>
                <p className="cp-banner-desc">{description}</p>
              </div>
            </div>
            <form className="cp-search-form" onSubmit={handleSearch}>
              <div className="cp-search-inner">
                <FaSearch className="cp-search-icon" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${label}...`} className="cp-search-input" />
                <button type="submit" className="cp-search-btn">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="cp-filter-bar">
        <div className="container">
          <div className="cp-filter-inner">
            <div className="cp-filter-tabs">
              {["latest", "popular", "featured"].map(f => (
                <button key={f} className={`cp-filter-tab${filter === f ? " active" : ""}`} onClick={() => handleFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <span className="cp-filter-count">{articles.length > 0 ? `${articles.length} stories` : ""}</span>
          </div>
        </div>
      </div>

      <div className="container cp-body">
        <div className="row g-4">
          <div className="col-lg-8">
            {loading && articles.length === 0 ? (
              <div className="cp-skeleton-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="cp-skeleton">
                    <div className="cp-skeleton-img" />
                    <div className="cp-skeleton-body">
                      <div className="cp-skeleton-line short" />
                      <div className="cp-skeleton-line" />
                      <div className="cp-skeleton-line" />
                      <div className="cp-skeleton-line shorter" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="cp-empty">
                <div className="cp-empty-icon">??</div>
                <h3>No articles yet</h3>
                <p>Check back soon for the latest {label} coverage from across Africa.</p>
              </div>
            ) : (
              <>
                {hero && <HeroCard article={hero} />}
                {rest.length > 0 && <div className="cp-grid">{rest.map(a => <ArticleCard key={a._id} article={a} />)}</div>}
                {hasMore && (
                  <div className="cp-load-more">
                    <button className="cp-load-btn" onClick={() => load(page + 1, search, filter)} disabled={loading}>
                      {loading ? <><span className="cp-spinner" /> Loading...</> : "Load More Stories"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="col-lg-4">
            <div className="cp-sidebar">
              <div className="cp-sidebar-widget">
                <div className="cp-widget-header">
                  <FaFire className="cp-widget-icon" style={{ color: "#e63946" }} />
                  <span>Trending Now</span>
                </div>
                <div className="cp-trending-list">
                  {trending.map((a, i) => <ListCard key={a._id} article={a} rank={i + 1} />)}
                </div>
              </div>
              <div className="cp-sidebar-widget">
                <div className="cp-widget-header">
                  <FaChevronRight className="cp-widget-icon" style={{ color: "var(--primary)" }} />
                  <span>Latest Stories</span>
                </div>
                {articles.slice(0, 5).map(a => <SidebarCard key={a._id} article={a} />)}
              </div>
              <div className="cp-newsletter-widget">
                <div className="cp-nl-icon">??</div>
                <h4>Stay Informed</h4>
                <p>Get the latest {label} stories delivered to your inbox.</p>
                <input type="email" placeholder="Your email address" className="cp-nl-input" />
                <button className="cp-nl-btn">Subscribe Free</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

