import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUser } from 'react-icons/fa';
import { timeAgo } from '../../utils/formatDate';
import { PLACEHOLDER_IMG } from '../../utils/constants';

const ArticleCard = ({ article, size = 'normal' }) => {
  if (!article) return null;

  return (
    <div className="article-card card">
      <div className="card-img-wrapper">
        <Link to={'/article/' + article.slug}>
          <img
            src={article.coverImage || PLACEHOLDER_IMG}
            alt={article.title}
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
        </Link>
      </div>
      <div className="card-body">
        {article.category && (
          <Link to={'/news?category=' + article.category.slug}>
            <span className="badge-category mb-2 d-inline-block" style={{background: article.category.color || '#0047AB'}}>
              {article.category.name}
            </span>
          </Link>
        )}
        {article.isBreaking && (
          <span className="badge-category badge-breaking mb-2 ms-1 d-inline-block">Breaking</span>
        )}
        <h5 className="card-title mt-1">
          <Link to={'/article/' + article.slug}>{article.title}</Link>
        </h5>
        <p className="card-text">{article.excerpt}</p>
        <div className="article-meta mt-2">
          <span><FaUser size={10} /> {article.author?.name || 'AfriLENS'}</span>
          <span><FaClock size={10} /> {timeAgo(article.publishedAt || article.createdAt)}</span>
          {article.readTime > 0 && <span>{article.readTime} min read</span>}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
