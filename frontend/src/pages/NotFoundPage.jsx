import React from 'react';
import { Link } from 'react-router-dom';
const NotFoundPage = () => <div className="container py-5 text-center"><h1 style={{fontSize:'6rem',color:'var(--primary)'}}>404</h1><h2>Page Not Found</h2><p className="text-muted mb-4">The page you are looking for does not exist.</p><Link to="/" className="btn-primary-custom">Back to Home</Link></div>;
export default NotFoundPage;
