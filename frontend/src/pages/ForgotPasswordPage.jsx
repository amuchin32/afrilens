import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/forgot-password", { email });
      setStatus("sent");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4ff", padding:"20px" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"40px 36px", maxWidth:440, width:"100%", boxShadow:"0 8px 32px rgba(0,71,171,0.12)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:"2rem", fontWeight:800, color:"#0047AB" }}>Afri<span style={{ color:"#FFD700" }}>LENS</span></div>
          <p style={{ color:"#64748b", fontSize:"0.85rem", marginTop:4 }}>Admin Portal</p>
        </div>

        {status === "sent" ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:16 }}>📧</div>
            <h2 style={{ color:"#16a34a", marginBottom:12 }}>Check Your Email</h2>
            <p style={{ color:"#334155", lineHeight:1.7, marginBottom:24 }}>
              If <strong>{email}</strong> is registered, you will receive a password reset link within a few minutes. The link expires in <strong>15 minutes</strong>.
            </p>
            <p style={{ color:"#64748b", fontSize:"0.85rem", marginBottom:24 }}>Check your spam folder if you do not see it.</p>
            <Link to="/login" style={{ color:"#0047AB", fontWeight:600 }}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontWeight:800, color:"#0f172a", marginBottom:8 }}>Forgot Password?</h2>
            <p style={{ color:"#64748b", marginBottom:24, fontSize:"0.9rem" }}>
              Enter your admin email address and we will send you a secure reset link.
            </p>
            {error && (
              <div style={{ background:"#fef2f2", color:"#dc2626", padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:"0.88rem" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <label style={{ display:"block", fontSize:"0.8rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@afrilens.com"
                required
                style={{ width:"100%", padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:"0.95rem", outline:"none", marginBottom:20 }}
              />
              <button type="submit" disabled={loading}
                style={{ width:"100%", background:"#0047AB", color:"#fff", border:"none", padding:"13px", borderRadius:8, fontWeight:700, fontSize:"1rem", cursor:"pointer" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <div style={{ textAlign:"center", marginTop:20 }}>
              <Link to="/login" style={{ color:"#0047AB", fontSize:"0.88rem" }}>← Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
