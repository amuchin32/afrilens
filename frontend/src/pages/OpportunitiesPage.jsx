import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../services/articleService";
import {
  FaSearch, FaBriefcase, FaGraduationCap, FaHandshake,
  FaGlobe, FaClock, FaChevronRight, FaMapMarkerAlt, FaExternalLinkAlt
} from "react-icons/fa";
import { PLACEHOLDER_IMG } from "../utils/constants";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const OPP_CATS = [
  { key: "all",           label: "All",            icon: FaGlobe },
  { key: "jobs",          label: "Jobs",           icon: FaBriefcase },
  { key: "scholarships",  label: "Scholarships",   icon: FaGraduationCap },
  { key: "grants",        label: "Grants",         icon: FaHandshake },
  { key: "fellowships",   label: "Fellowships",    icon: FaGlobe },
  { key: "partnerships",  label: "Partnerships",   icon: FaHandshake },
];

const OppCard = ({ article }) => {
  const img   = article.coverImage || PLACEHOLDER_IMG;
  const slug  = `/opportunities/${article.slug}`;
  const tag   = article.tags?.[0] || "Opportunity";
  return (
    <div className="opp-card">
      <div className="opp-card-img-wrap">
        <img src={img} alt={article.title} loading="lazy" />
        <span className="opp-card-tag">{tag}</span>
      </div>
      <div className="opp-card-body">
        <Link to={slug}><h3 className="opp-card-title">{article.title}</h3></Link>
        <p className="opp-card-summary">{article.summary}</p>
        <div className="opp-card-meta">
          {article.location && (
            <span className="opp-meta-item">
              <FaMapMarkerAlt size={11} /> {article.location}
            </span>
          )}
          <span className="opp-meta-item">
            <FaClock size={11} /> {formatDate(article.createdAt)}
          </span>
        </div>
        <Link to={slug} className="opp-apply-btn">
          View Details <FaChevronRight size={10} />
        </Link>
      </div>
    </div>
  );
};

const FeaturedOpp = ({ article }) => {
  if (!article) return null;
  const img  = article.coverImage || PLACEHOLDER_IMG;
  const slug = `/opportunities/${article.slug}`;
  return (
    <div className="opp-featured">
      <img src={img} alt={article.title} className="opp-featured-img" />
      <div className="opp-featured-overlay" />
      <div className="opp-featured-body">
        <span className="opp-featured-label">Featured Opportunity</span>
        <Link to={slug}><h2 className="opp-featured-title">{article.title}</h2></Link>
        <p className="opp-featured-summary">{article.summary}</p>
        <Link to={slug} className="opp-featured-btn">
          Apply / Learn More <FaExternalLinkAlt size={12} />
        </Link>
      </div>
    </div>
  );
};

export default function OpportunitiesPage() {
  const [articles,  setArticles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(false);
  const PER_PAGE = 8;

  const load = (p = 1, q = "", f = "all") => {
    setLoading(true);
    const params = { category: "opportunities", status: "published", limit: PER_PAGE, page: p };
    if (q) params.search = q;
    if (f !== "all") params.search = f;
    getArticles(params)
      .then((r) => {
        const arts = r.data?.data?.articles || r.data?.articles || [];
        setArticles((prev) => (p === 1 ? arts : [...prev, ...arts]));
        setHasMore(arts.length === PER_PAGE);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(1); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(1, search, filter); };
  const handleFilter = (f) => { setFilter(f); load(1, search, f); };

  const featured = articles.find((a) => a.isFeatured) || articles[0];
  const rest = articles.filter((a) => a._id !== featured?._id);

  return (
    <div className="opp-page">
      {/* Banner */}
      <div className="opp-banner">
        <div className="opp-banner-pattern" />
        <div className="container">
          <div className="opp-banner-content">
            <div className="opp-banner-icon"><FaBriefcase size={40} /></div>
            <div>
              <span className="opp-banner-eyebrow">AfriLENS Opportunities</span>
              <h1 className="opp-banner-title">Opportunities</h1>
              <p className="opp-banner-desc">
                Jobs, scholarships, grants, fellowships and partnerships — curated for African professionals, students and changemakers.
              </p>
            </div>
          </div>

          <form className="opp-search-form" onSubmit={handleSearch}>
            <FaSearch className="opp-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="opp-search-input"
            />
            <select
              className="opp-search-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {OPP_CATS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="opp-search-btn">Search</button>
          </form>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="opp-filter-bar">
        <div className="container">
          <div className="opp-filter-pills">
            {OPP_CATS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`opp-pill${filter === key ? " active" : ""}`}
                onClick={() => handleFilter(key)}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container opp-body">
        {loading && articles.length === 0 ? (
          <div className="cp-skeleton-grid">
            {[1, 2, 3, 4].map((i) => <div key={i} className="cp-skeleton"><div className="cp-skeleton-img" /><div className="cp-skeleton-body"><div className="cp-skeleton-line short" /><div className="cp-skeleton-line" /><div className="cp-skeleton-line shorter" /></div></div>)}
          </div>
        ) : articles.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">🎯</div>
            <h3>No opportunities yet</h3>
            <p>Check back soon — new opportunities are posted regularly.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && <FeaturedOpp article={featured} />}

            {/* Grid */}
            <div className="opp-grid">
              {rest.map((a) => <OppCard key={a._id} article={a} />)}
            </div>

            {hasMore && (
              <div className="cp-load-more">
                <button
                  className="cp-load-btn"
                  onClick={() => load(page + 1, search, filter)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More Opportunities"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}



