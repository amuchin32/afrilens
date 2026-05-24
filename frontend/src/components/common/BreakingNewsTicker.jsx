import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBreakingNews } from '../../services/articleService';

const DEFAULT_HEADLINES = [
  { _id: '1', title: 'Welcome to AfriLENS.com — Africa Through a New Lens', slug: '#' },
  { _id: '2', title: 'Stay informed with the latest news from across Africa and the world', slug: '#' },
  { _id: '3', title: 'AfriLENS: Your trusted source for news from Liberia and beyond', slug: '#' },
];

const BreakingNewsTicker = () => {
  const [headlines, setHeadlines] = useState(DEFAULT_HEADLINES);

  useEffect(() => {
    getBreakingNews()
      .then(res => { if (res.data.data?.length > 0) setHeadlines(res.data.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="breaking-news-bar">
      <div className="container d-flex align-items-center" style={{gap: 0}}>
        <span className="breaking-label">Breaking</span>
        <div className="breaking-ticker ms-3">
          <div className="breaking-ticker-inner">
            {[...headlines, ...headlines].map((item, i) => (
              <span className="ticker-item" key={i}>
                <Link to={'/article/' + item.slug} style={{color:'inherit'}}>{item.title}</Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;

