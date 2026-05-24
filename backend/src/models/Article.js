const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: [true, 'Content is required'] },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  isBreaking: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 0 },
  publishedAt: { type: Date },
  videoUrl: { type: String, default: "" },
  vidType: { type: String, default: "" },
}, { timestamps: true });

ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);

