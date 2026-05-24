import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  FaPlay, FaSearch, FaClock, FaFire, FaRegPlayCircle
} from "react-icons/fa";
import { PLACEHOLDER_IMG } from "../utils/constants";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const VideoCard = ({ article, large }) => {
  const img   = article.coverImage || PLACEHOLDER_IMG;
  const slug = `/videos/${article._id}`;
  const ytEmbed = article.videoUrl ? article.videoUrl.replace("youtu.be/","youtube.com/embed/").replace("watch?v=","embed/").split("?")[0] + (article.videoUrl.includes("?") ? "?" + article.videoUrl.split("?")[1] : "") : null;
  if (large) return (
    <div className="vid-hero-card">
      <div className="vid-hero-thumb" style={{position:"relative",display:"block",paddingTop:"56.25%",overflow:"hidden"}}>
        {article.url ? <iframe src={"https://www.youtube.com/embed/" + (article.url.match(/(?:youtu\.be\/|v=)([^&?/]+)/) || [])[1]} title={article.title} allowFullScreen frameBorder="0" style={{width:"100%",height:"100%",position:"absolute",top:0,left:0}} /> : <img src={img} alt={article.title} />}
        
        
        <div className="vid-hero-meta">
          {article.duration && <span className="vid-duration">{article.duration}</span>}
        </div>
      </div>
      <div className="vid-hero-body">
        <span className="vid-cat-pill">{typeof article.category === "object" ? article.category?.name : article.category || "Video"}</span>
        <h2 className="vid-hero-title">{article.title}</h2>
        <p className="vid-hero-summary">{article.summary}</p>
        <div className="vid-meta-row">
          <span className="cp-meta"><FaClock size={11} /> {formatDate(article.createdAt)}</span>
          {article.views && <span className="cp-meta">{article.views.toLocaleString()} views</span>}
        </div>
        
      </div>
    </div>
  );
  return (
    <div className="vid-card">
      <div className="vid-thumb" style={{position:"relative",paddingTop:"56.25%",overflow:"hidden"}}>
        {article.url ? <iframe src={"https://www.youtube.com/embed/" + (article.url.match(/(?:youtu\.be\/|v=)([^&?/]+)/) || [])[1]} title={article.title} allowFullScreen frameBorder="0" style={{width:"100%",height:"100%",position:"absolute",top:0,left:0,borderRadius:8}} /> : <img src={img} alt={article.title} loading="lazy" />}
      </div>
      <div className="vid-card-body">
        <h3 className="vid-card-title">{article.title}</h3>
        <div className="vid-card-meta">
          <span className="cp-meta"><FaClock size={10} /> {formatDate(article.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

const VIDEO_CATS = ["All", "Politics", "Business", "Culture", "Sports", "Opinion"];

export default function VideosPage() {
  const [videos,   setVideos]   = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [cat,      setCat]      = useState("All");
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(false);
  const PER_PAGE = 9;

  const load = (p = 1, q = "", c = "All") => {
    setLoading(true);
    API.get("/videos")
      .then((r) => {
        let arts = r.data?.videos || r.data?.data || [];
        if (q) arts = arts.filter(a => a.title?.toLowerCase().includes(q.toLowerCase()) || a.description?.toLowerCase().includes(q.toLowerCase()));
        if (c !== "All") arts = arts.filter(a => (a.category?.name || a.category || "").toLowerCase() === c.toLowerCase());
        setVideos((prev) => (p === 1 ? arts : [...prev, ...arts]));
        setHasMore(false);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1);
    API.get("/videos")
      .then((r) => setTrending(r.data?.data?.articles || r.data?.articles || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); load(1, search, cat); };

  const hero = videos[0];
  const rest = videos.slice(1);

  return (
    <div className="vid-page">
      {/* Banner */}
      <div className="vid-banner">
        <div className="vid-banner-bg" />
        <div className="container">
          <div className="vid-banner-inner">
            <div className="vid-banner-left">
              <div className="vid-banner-icon"><FaRegPlayCircle size={40} /></div>
              <div>
                <span className="cp-banner-eyebrow">AfriLENS Video Reports</span>
                <h1 className="cp-banner-title">Videos</h1>
                <p className="cp-banner-desc">Watch the stories that matter — documentaries, interviews, breaking reports and live coverage from across Africa.</p>
              </div>
            </div>
            <form className="cp-search-form" onSubmit={handleSearch}>
              <div className="cp-search-inner">
                <FaSearch className="cp-search-icon" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search videos..." className="cp-search-input" />
                <button type="submit" className="cp-search-btn">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="cp-filter-bar">
        <div className="container">
          <div className="cp-filter-inner">
            <div className="cp-filter-tabs">
              {VIDEO_CATS.map((c) => (
                <button
                  key={c}
                  className={`cp-filter-tab${cat === c ? " active" : ""}`}
                  onClick={() => { setCat(c); load(1, search, c); }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container cp-body">
        <div className="row g-4">
          <div className="col-lg-8">
            {loading && videos.length === 0 ? (
              <div className="cp-skeleton-grid">
                {[1,2,3].map((i)=><div key={i} className="cp-skeleton"><div className="cp-skeleton-img"/><div className="cp-skeleton-body"><div className="cp-skeleton-line"/><div className="cp-skeleton-line shorter"/></div></div>)}
              </div>
            ) : videos.length === 0 ? (
              <div className="cp-empty">
                <div className="cp-empty-icon">🎬</div>
                <h3>No videos yet</h3>
                <p>Video reports are coming soon. Stay tuned.</p>
              </div>
            ) : (
              <>
                {hero && <VideoCard article={hero} large />}
                <div className="vid-grid">
                  {rest.map((v) => <VideoCard key={v._id} article={v} />)}
                </div>
                {hasMore && (
                  <div className="cp-load-more">
                    <button className="cp-load-btn" onClick={() => load(page+1, search, cat)} disabled={loading}>
                      {loading ? "Loading..." : "Load More Videos"}
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
                  <FaFire style={{ color:"#e63946" }} /> Most Watched
                </div>
                <div className="vid-trending">
                  {trending.map((v, i) => (
                    <Link key={v._id} to={`/videos/${v._id}`} className="vid-trending-item">
                      <div className="vid-trending-thumb">
                        <img src={v.coverImage || PLACEHOLDER_IMG} alt={v.title} />
                        <FaPlay size={10} className="vid-trending-play" />
                      </div>
                      <div className="vid-trending-body">
                        <p className="vid-trending-title">{v.title}</p>
                        <span className="cp-meta"><FaClock size={10} /> {formatDate(v.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

































