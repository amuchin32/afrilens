const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Please add a name"], trim: true },
  email:    { type: String, required: [true, "Please add an email"], unique: true, lowercase: true },
  password: {
    type: String, required: [true, "Please add a password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false
  },
  role:     { type: String, enum: ["user","journalist","editor","admin"], default: "user" },
  avatar:   { type: String, default: "" },
  bio:      { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  resetPasswordToken:   { type: String },
  resetPasswordExpire:  { type: Date },
}, { timestamps: true });

// Strong password validation
UserSchema.path("password").validate(function(v) {
  if (!this.isModified("password")) return true;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+]).{8,}$/.test(v);
}, "Password must be at least 8 characters and include uppercase, lowercase, number and special character");

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken  = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
