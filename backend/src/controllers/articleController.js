const Article = require('../models/Article');
const slugify = require('../utils/slugify');
const pagination = require('../utils/pagination');

const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = { status: 'published' };
    if (req.query.category) query.category = req.query.category;
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ success: true, data: articles, pagination: pagination(query, total, page, limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug color');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    article.views += 1;
    await article.save();
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const articles = await Article.find({ isFeatured: true, status: 'published' })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBreaking = async (req, res) => {
  try {
    const articles = await Article.find({ isBreaking: true, status: 'published' })
      .select('title slug publishedAt')
      .sort({ publishedAt: -1 })
      .limit(5);
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {
    req.body.author = req.user._id;
    req.body.slug = slugify(req.body.title);
    if (req.body.status === 'published') req.body.publishedAt = new Date();
    const words = req.body.content.split(' ').length;
    req.body.readTime = Math.ceil(words / 200);
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.status === 'published' && !req.body.publishedAt) req.body.publishedAt = new Date();
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getArticles, getArticle, getFeatured, getBreaking, createArticle, updateArticle, deleteArticle };
