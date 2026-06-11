const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../services/emailService");

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+]).{8,}$/;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters with uppercase, lowercase, number and special character" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Please provide email and password" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = process.env.CLIENT_URL + "/reset-password/" + resetToken;
    const html = "<div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;'><div style='text-align:center;margin-bottom:24px;'><h1 style='color:#0047AB;font-size:2rem;margin:0;'>Afri<span style='color:#FFD700;'>LENS</span></h1><p style='color:#64748b;font-size:0.85rem;margin:4px 0 0;'>Africa Through a New Lens</p></div><h2 style='color:#0f172a;font-size:1.3rem;'>Password Reset Request</h2><p style='color:#334155;line-height:1.7;'>You requested a password reset for your AfriLENS admin account. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p><div style='text-align:center;margin:32px 0;'><a href='" + resetUrl + "' style='background:#0047AB;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem;display:inline-block;'>Reset My Password</a></div><p style='color:#64748b;font-size:0.85rem;'>If you did not request this, please ignore this email.</p><p style='color:#64748b;font-size:0.85rem;'>Or copy this link: <a href='" + resetUrl + "' style='color:#0047AB;'>" + resetUrl + "</a></p></div>";
    await sendEmail({ to: user.email, subject: "AfriLENS - Password Reset Request", html });
    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please provide password and confirmation" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters with uppercase, lowercase, number and special character" });
    }
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token. Please request a new one." });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, message: "Password reset successful.", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters with uppercase, lowercase, number and special character" });
    }
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, logout, getMe, forgotPassword, resetPassword, changePassword };
