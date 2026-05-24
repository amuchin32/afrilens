import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../components/common/ArticleCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import NewsletterSignup from "../components/common/NewsletterSignup";
import { getFeaturedArticles, getArticles } from "../services/articleService";
import API from "../services/api";
import { PLACEHOLDER_IMG } from "../utils/constants";
import { timeAgo } from "../utils/formatDate";
import { FaArrowRight, FaFire, FaStar } from "react-icons/fa";

const MOCK_ARTICLES = [
  { _id:"1", title:"Liberia Launches New Economic Development Initiative for 2026", slug:"liberia-economic-development-2026", excerpt:"The government of Liberia has unveiled a comprehensive economic development plan aimed at boosting growth across key sectors.", coverImage:"", category:{name:"Business",slug:"business",color:"#198754"}, author:{name:"AfriLENS Staff"}, publishedAt:new Date().toISOString(), readTime:4, isFeatured:true, isBreaking:false },
  { _id:"2", title:"African Tech Startups Raise Record Funding in First Quarter", slug:"african-tech-startups-funding", excerpt:"Technology companies across the continent attracted unprecedented investment as global investors bet big on African innovation.", coverImage:"", category:{name:"Tech",slug:"tech",color:"#0dcaf0"}, author:{name:"AfriLENS Staff"}, publishedAt:new Date().toISOString(), readTime:3, isFeatured:true, isBreaking:true },
  { _id:"3", title:"West African Cultural Festival Draws Thousands to Monrovia", slug:"west-african-cultural-festival", excerpt:"Vibrant celebrations of music, dance, and art united communities from across West Africa in Liberias capital city.", coverImage:"", category:{name:"Culture",slug:"culture",color:"#fd7e14"}, author:{name:"AfriLENS Reporter"}, publishedAt:new Date().toISOString(), readTime:5, isFeatured:true, isBreaking:false },
  { _id:"4", title:"Super Eagles Defeat Lone Star FC in Friendly Match", slug:"super-eagles-lone-star", excerpt:"Nigeria national team edged past Liberias Lone Star in an exciting international friendly played in Abuja.", coverImage:"", category:{name:"Sport",slug:"sport",color:"#dc3545"}, author:{name:"Sports Desk"}, publishedAt:new Date().toISOString(), readTime:2, isFeatured:false, isBreaking:false },
  { _id:"5", title:"New Scholarship Opportunities Open for Liberian Students", slug:"scholarship-opportunities-liberian-students", excerpt:"Several international organizations have announced scholarship programs specifically targeting Liberian and West African students.", coverImage:"", category:{name:"Opportunities",slug:"opportunities",color:"#6f42c1"}, author:{name:"AfriLENS Staff"}, publishedAt:new Date().toISOString(), readTime:3, isFeatured:false, isBreaking:false },
  { _id:"6", title:"Monrovia Infrastructure Projects Move Forward Under New Plan", slug:"monrovia-infrastructure-projects", excerpt:"City authorities reveal ambitious plans to upgrade roads, water systems, and public spaces across the Liberian capital.", coverImage:"", category:{name:"News",slug:"news",color:"#0047AB"}, author:{name:"News Desk"}, publishedAt:new Date().toISOString(), readTime:4, isFeatured:false, isBreaking:false },
];

// Extract articles from any response shape
const extractArticles = (res) => {
  const d = res?.data?.data || res?.data;
  return d?.articles || d?.data || [];
};

// Build article link from category and slug
const articleLink = (article) => {
  const cat = typeof article.category === "object" ? article.category?.slug || article.category?.name : article.category;
  const catPath = (cat || "news").toLowerCase();
  return `/${catPath}/${article.slug}`;
};

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [videos, setVideos] = useState([]);
  const [latest,   setLatest]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedArticles(), getArticles({ limit: 6, status: "published" })])
      .then(([featRes, latRes]) => {
        const featArts = extractArticles(featRes);
        const latArts  = extractArticles(latRes);
        setFeatured(featArts.length ? featArts : MOCK_ARTICLES.slice(0, 3));
        setLatest(latArts.length   ? latArts  : MOCK_ARTICLES);
      })
      .catch(() => {
        setFeatured(MOCK_ARTICLES.slice(0, 3));
        setLatest(MOCK_ARTICLES);
      })
      .finally(() => setLoading(false));
    API.get("/videos").then(r => setVideos(r.data?.videos || r.data?.data || [])).catch(() => {});
  }, []);

  const hero = featured[0] || MOCK_ARTICLES[0];

  return (
    <>
      {/* HERO SECTION */}
      <section className="py-4" style={{ background: "var(--off-white)" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="hero-article">
                <img src={hero.coverImage || PLACEHOLDER_IMG} alt={hero.title} onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                <div className="hero-content">
                  {hero.category && (
                    <span className="badge-category mb-2 d-inline-block"
                      style={{ background: hero.category?.color || "var(--primary)" }}>
                      {typeof hero.category === "object" ? hero.category.name : hero.category}
                    </span>
                  )}
                  {hero.isBreaking && <span className="badge-category badge-breaking mb-2 ms-1 d-inline-block">Breaking</span>}
                  <h1 className="hero-title">
                    <Link to={articleLink(hero)} style={{ color: "white" }}>{hero.title}</Link>
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: 12 }}>
                    {hero.excerpt || hero.summary}
                  </p>
                  <div className="article-meta" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span>By {hero.author?.name || hero.authorName}</span>
                    <span>{timeAgo(hero.publishedAt || hero.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-flex flex-column gap-3">
              {(featured.slice(1, 3).length ? featured.slice(1, 3) : MOCK_ARTICLES.slice(1, 3)).map(article => (
                <div key={article._id} className="article-card card" style={{ flex: 1 }}>
                  <div className="card-img-wrapper" style={{ height: "140px" }}>
                    <Link to={articleLink(article)}>
                      <img src={article.coverImage || PLACEHOLDER_IMG} alt={article.title} onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
                    </Link>
                  </div>
                  <div className="card-body p-3">
                    {article.category && (
                      <span className="badge-category mb-1 d-inline-block"
                        style={{ background: article.category?.color || "var(--primary)", fontSize: "0.65rem" }}>
                        {typeof article.category === "object" ? article.category.name : article.category}
                      </span>
                    )}
                    <h6 className="card-title" style={{ fontSize: "0.92rem" }}>
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
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0"><FaFire style={{ color: "var(--accent)", marginRight: 8 }} />Latest News</h2>
            <Link to="/news" className="btn-primary-custom d-flex align-items-center gap-2">All News <FaArrowRight size={12} /></Link>
          </div>
          {loading ? <LoadingSpinner /> : (
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

      {/* NEWSLETTER */}
      <NewsletterSignup />
      {videos.length > 0 && (
        <section className="py-5">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">?? Latest Videos</h2>
              <a href="/videos" className="btn-primary-custom">All Videos</a>
            </div>
            <div className="row g-4">
              {videos.slice(0,3).map(v => {
                const m = v.url?.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
                const embed = m ? "https://www.youtube.com/embed/" + m[1] : v.url;
                return (
                  <div className="col-lg-4 col-md-6" key={v._id}>
                    <div className="card h-100">
                      <div style={{position:"relative",paddingTop:"56.25%"}}>
                        <iframe src={embed} title={v.title} allowFullScreen frameBorder="0" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",borderRadius:"8px 8px 0 0"}} />
                      </div>
                      <div className="card-body">
                        <h6 className="card-title">{v.title}</h6>
                        {v.description && <p className="card-text small text-muted">{v.description}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED SECTION */}
      <section className="py-5" style={{ background: "var(--off-white)" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title mb-0"><FaStar style={{ color: "#FFD700", marginRight: 8 }} />Featured Stories</h2>
          </div>
          <div className="row g-4">
            {(featured.length ? featured : MOCK_ARTICLES.slice(0, 3)).map(article => (
              <div className="col-lg-4 col-md-6" key={article._id + "-feat"}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;





