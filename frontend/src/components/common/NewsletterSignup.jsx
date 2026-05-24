import React, { useState } from 'react';
import API from '../../services/api';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/newsletter/subscribe', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'error');
    }
  };

  return (
    <div className="newsletter-section py-5" style={{background:'var(--primary)',color:'white'}}>
      <div className="container text-center">
        <h3 className="mb-2" style={{fontFamily:'var(--font-heading)',color:'white'}}>Stay Informed. Stay African.</h3>
        <p className="mb-4" style={{color:'rgba(255,255,255,0.85)'}}>Get the latest AfriLENS stories delivered to your inbox.</p>
        {status === 'success' ? (
          <div className="alert alert-success d-inline-block">Thank you for subscribing to AfriLENS!</div>
        ) : (
          <form onSubmit={handleSubmit} className="d-flex justify-content-center gap-0" style={{maxWidth:'460px',margin:'0 auto'}}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{padding:'12px 16px',border:'none',borderRadius:'4px 0 0 4px',flex:1,fontSize:'0.9rem'}}
            />
            <button type="submit" style={{background:'var(--accent)',color:'white',border:'none',padding:'12px 20px',borderRadius:'0 4px 4px 0',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
