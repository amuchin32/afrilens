import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{maxWidth:420}}>
      <div className="text-center mb-4">
        <h2 style={{fontFamily:'var(--font-heading)',color:'var(--primary)'}}>AfriLENS Login</h2>
        <p className="text-muted">Editor & Admin Access</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-600">Email Address</label>
          <input type="email" className="form-control" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        </div>
        <div className="mb-4">
          <label className="form-label fw-600">Password</label>
          <input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        </div>
        <button type="submit" className="btn-primary-custom w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
