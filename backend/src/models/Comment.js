const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  isApproved: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
