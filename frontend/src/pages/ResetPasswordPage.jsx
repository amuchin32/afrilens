import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const rules = [
  { label: "At least 8 characters",              test: v => v.length >= 8 },
  { label: "One uppercase letter (A-Z)",          test: v => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a-z)",          test: v => /[a-z]/.test(v) },
  { label: "One number (0-9)",                    test: v => /\d/.test(v) },
  { label: "One special character (@$!%*?&#...)", test: v => /[@$!%*?&#^()\-_=+]/.test(v) },
];

export default function ResetPasswordPage() {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const [form,      setForm]    = useState({ password: "", confirmPassword: "" });
  const [loading,   setLoading] = useState(false);
  const [error,     setError]   = useState("");
  const [success,   setSuccess] = useState(false);
  const [showPass,  setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    const failed = rules.filter(r => !r.test(form.password));
    if (failed.length) return setError("Password does not meet all requirements.");
    setLoading(true);
    try {
      await API.put(`/auth/reset-password/${token}`, { password: form.password, confirmPassword: form.confirmPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4ff", padding:"20px" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"40px 36px", maxWidth:460, width:"100%", boxShadow:"0 8px 32px rgba(0,71,171,0.12)" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:"2rem", fontWeight:800, color:"#0047AB" }}>Afri<span style={{ color:"#FFD700" }}>LENS</span></div>
          <p style={{ color:"#64748b", fontSize:"0.85rem", marginTop:4 }}>Admin Portal</p>
        </div>

        {success ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:"3rem", marginBottom:16 }}>✅</div>
            <h2 style={{ color:"#16a34a", marginBottom:12 }}>Password Reset!</h2>
            <p style={{ color:"#334155", marginBottom:8 }}>Your password has been changed successfully.</p>
            <p style={{ color:"#64748b", fontSize:"0.88rem" }}>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontWeight:800, color:"#0f172a", marginBottom:8 }}>Set New Password</h2>
            <p style={{ color:"#64748b", marginBottom:24, fontSize:"0.9rem" }}>Choose a strong password for your admin account.</p>

            {error && (
              <div style={{ background:"#fef2f2", color:"#dc2626", padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:"0.88rem" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:"0.8rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:6 }}>
                  New Password
                </label>
                <div style={{ position:"relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Enter new password"
                    required
                    style={{ width:"100%", padding:"11px 40px 11px 14px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:"0.95rem", outline:"none" }}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.85rem" }}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Password strength rules */}
              <div style={{ background:"#f8fafc", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#475569", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.4px" }}>Password Requirements</div>
                {rules.map(r => (
                  <div key={r.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, fontSize:"0.83rem", color: r.test(form.password) ? "#16a34a" : "#94a3b8" }}>
                    <span>{r.test(form.password) ? "✅" : "○"}</span>
                    {r.label}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:"0.8rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:6 }}>
                  Confirm Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                  style={{ width:"100%", padding:"11px 14px", border: form.confirmPassword && form.password !== form.confirmPassword ? "1px solid #dc2626" : "1px solid #e2e8f0", borderRadius:8, fontSize:"0.95rem", outline:"none" }}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p style={{ color:"#dc2626", fontSize:"0.8rem", marginTop:4 }}>Passwords do not match</p>
                )}
              </div>

              <button type="submit" disabled={loading}
                style={{ width:"100%", background:"#0047AB", color:"#fff", border:"none", padding:"13px", borderRadius:8, fontWeight:700, fontSize:"1rem", cursor:"pointer" }}>
                {loading ? "Resetting..." : "Reset Password"}
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
