import React, { useState } from "react";
import API from "../services/api";

const rules = [
  { label: "At least 8 characters",              test: v => v.length >= 8 },
  { label: "One uppercase letter (A-Z)",          test: v => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a-z)",          test: v => /[a-z]/.test(v) },
  { label: "One number (0-9)",                    test: v => /\d/.test(v) },
  { label: "One special character (@$!%*?&#...)", test: v => /[@$!%*?&#^()\-_=+]/.test(v) },
];

export default function ChangePasswordPage() {
  const [form,    setForm]    = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [show,    setShow]    = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.newPassword !== form.confirmPassword) return setError("New passwords do not match.");
    const failed = rules.filter(r => !r.test(form.newPassword));
    if (failed.length) return setError("New password does not meet all requirements.");
    setLoading(true);
    try {
      await API.put("/auth/change-password", form);
      setSuccess("✅ Password changed successfully!");
      setForm({ currentPassword:"", newPassword:"", confirmPassword:"" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:520 }}>
      <h2 className="adm-section-title">Change Password</h2>
      <div style={{ background:"#fff", borderRadius:12, padding:"28px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        {error   && <div style={{ background:"#fef2f2", color:"#dc2626", padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:"0.88rem" }}>{error}</div>}
        {success && <div style={{ background:"#f0fdf4", color:"#16a34a", padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:"0.88rem" }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}>
            <label className="ae-label">Current Password</label>
            <div style={{ position:"relative" }}>
              <input type={show ? "text" : "password"} value={form.currentPassword} onChange={set("currentPassword")}
                className="ae-input" placeholder="Your current password" required
                style={{ paddingRight:60 }} />
              <button type="button" onClick={() => setShow(p => !p)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:"0.82rem" }}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={{ marginBottom:8 }}>
            <label className="ae-label">New Password</label>
            <input type={show ? "text" : "password"} value={form.newPassword} onChange={set("newPassword")}
              className="ae-input" placeholder="Enter new password" required />
          </div>

          {/* Strength indicator */}
          <div style={{ background:"#f8fafc", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
            <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#475569", marginBottom:8, textTransform:"uppercase" }}>Password Requirements</div>
            {rules.map(r => (
              <div key={r.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, fontSize:"0.82rem", color: r.test(form.newPassword) ? "#16a34a" : "#94a3b8" }}>
                <span>{r.test(form.newPassword) ? "✅" : "○"}</span>{r.label}
              </div>
            ))}
          </div>

          <div style={{ marginBottom:24 }}>
            <label className="ae-label">Confirm New Password</label>
            <input type={show ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
              className="ae-input" placeholder="Confirm new password" required
              style={{ border: form.confirmPassword && form.newPassword !== form.confirmPassword ? "1px solid #dc2626" : undefined }} />
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p style={{ color:"#dc2626", fontSize:"0.8rem", marginTop:4 }}>Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="adm-btn adm-btn-primary" disabled={loading} style={{ width:"100%" }}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
