import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form,     setForm]     = useState({ email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timed out")), 15000)
    );
    try {
      const res = await Promise.race([login(form), timeout]);
      loginUser(res.data.token, res.data.user);
      navigate("/admin");
    } catch (err) {
      if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
        setError("Cannot reach server. Please check your internet connection.");
      } else if (err.message === "timed out") {
        setError("Login timed out. Please try again.");
      } else if (err.response?.status === 429) {
        setError("Too many attempts. Please wait 15 minutes and try again.");
      } else {
        setError(err.response?.data?.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4ff", padding:"20px" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"40px 36px", maxWidth:440, width:"100%", boxShadow:"0 8px 32px rgba(0,71,171,0.12)" }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:"2.2rem", fontWeight:800, color:"#0047AB", lineHeight:1 }}>
            Afri<span style={{ color:"#FFD700" }}>LENS</span>
          </div>
          <p style={{ color:"#64748b", fontSize:"0.82rem", marginTop:6, textTransform:"uppercase", letterSpacing:"1.5px" }}>
            Admin &amp; Editor Access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fef2f2", color:"#dc2626", padding:"10px 14px", borderRadius:8, marginBottom:20, fontSize:"0.88rem", borderLeft:"4px solid #dc2626" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:"0.78rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@afrilens.com"
              required
              style={{ width:"100%", padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:"0.95rem", outline:"none", fontFamily:"inherit" }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <label style={{ fontSize:"0.78rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                Password
              </label>
            </div>
            <div style={{ position:"relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                required
                style={{ width:"100%", padding:"11px 50px 11px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:"0.95rem", outline:"none", fontFamily:"inherit" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.82rem", fontWeight:600 }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div style={{ textAlign:"right", marginBottom:24 }}>
            <Link to="/forgot-password" style={{ color:"#0047AB", fontSize:"0.85rem", fontWeight:600, textDecoration:"none" }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width:"100%", background: loading ? "#94a3b8" : "#0047AB", color:"#fff", border:"none", padding:"13px", borderRadius:8, fontWeight:700, fontSize:"1rem", cursor: loading ? "not-allowed" : "pointer", transition:"background 0.2s" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:24, color:"#94a3b8", fontSize:"0.78rem" }}>
          © {new Date().getFullYear()} AfriLENS.com — Secure Admin Portal
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
