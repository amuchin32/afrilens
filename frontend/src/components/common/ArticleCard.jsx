import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaUser } from "react-icons/fa";
import { timeAgo } from "../../utils/formatDate";
import { PLACEHOLDER_IMG } from "../../utils/constants";

const getCatName  = (cat) => typeof cat === "object" ? cat?.name  || "" : cat || "";
const getCatColor = (cat) => typeof cat === "object" ? cat?.color || "#0047AB" : "#0047AB";
const getCatSlug  = (cat) => typeof cat === "object" ? cat?.slug  || cat?.name?.toLowerCase() || "news" : (cat || "news").toLowerCase();

const ArticleCard = ({ article }) => {
  if (!article) return null;
  const catSlug = getCatSlug(article.category);
  const link    = `/${catSlug}/${article.slug}`;
  return (
    <div className="article-card card">
      <div className="card-img-wrapper">
        <Link to={link}>
          <img
            src={article.coverImage || PLACEHOLDER_IMG}
            alt={article.title}
            onError={e => { e.target.src = PLACEHOLDER_IMG; }}
          />
        </Link>
      </div>
      <div className="card-body">
        {article.category && (
          <span className="badge-category mb-2 d-inline-block"
            style={{ background: getCatColor(article.category) }}>
            {getCatName(article.category)}
          </span>
        )}
        {article.isBreaking && (
          <span className="badge-category badge-breaking mb-2 ms-1 d-inline-block">Breaking</span>
        )}
        <h5 className="card-title mt-1">
          <Link to={link}>{article.title}</Link>
        </h5>
        <p className="card-text">{article.excerpt || article.summary}</p>
        <div className="article-meta mt-2">
          <span><FaUser size={10} /> {article.author?.name || article.authorName || "AfriLENS"}</span>
          <span><FaClock size={10} /> {timeAgo(article.publishedAt || article.createdAt)}</span>
          {article.readTime > 0 && <span>{article.readTime} min read</span>}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
