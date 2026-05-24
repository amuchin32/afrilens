const Article = require('../models/Article');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');
const pagination = require('../utils/pagination');

// Generate a unique slug
const generateUniqueSlug = async (title, excludeId = null) => {
  let slug = slugify(title);
  let exists = await Article.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
  if (!exists) return slug;
  let counter = 2;
  while (exists) {
    slug = slugify(title, counter);
    exists = await Article.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    counter++;
  }
  return slug;
};

// Helper: resolve category name string to ObjectId
const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) return null;
  if (/^[a-f\d]{24}$/i.test(categoryInput)) return categoryInput;
  let cat = await Category.findOne({ name: { $regex: new RegExp('^' + categoryInput + '$', 'i') } });
  if (!cat) cat = await Category.create({ name: categoryInput, slug: categoryInput.toLowerCase() });
  return cat._id;
};

// Helper: normalize request body fields
const normalizeBody = async (body) => {
  // Remove author if it is a name string not an ObjectId
  if (body.author && !/^[a-f\d]{24}$/i.test(body.author)) delete body.author;
  const normalized = { ...body };
  if (normalized.summary && !normalized.excerpt) normalized.excerpt = normalized.summary;
  if (!normalized.excerpt) normalized.excerpt = normalized.title || 'No excerpt provided';
  if (normalized.category) normalized.category = await resolveCategoryId(normalized.category);
  delete normalized.authorName;
  delete normalized.slug; // never trust client slug
  return normalized;
};

// Normalize output for frontend
const normalizeOut = (a) => ({
  ...a.toObject(),
  category:   a.category?.name  || a.category,
  summary:    a.excerpt          || '',
  authorName: a.author?.name     || '',
});

const getArticles = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;
    const query = {};

    if (req.query.status && req.query.status !== 'All') query.status = req.query.status;
    else if (!req.query.status) query.status = 'published';
    // status=All => no filter

    if (req.query.category) {
      if (/^[a-f\d]{24}$/i.test(req.query.category)) {
        query.category = req.query.category;
      } else {
        const cat = await Category.findOne({ name: { $regex: new RegExp('^' + req.query.category + '$', 'i') } });
        if (cat) query.category = cat._id;
        else query.category = null; // no match = no results
      }
    }

    if (req.query.search) query.$text = { $search: req.query.search };

    const sortStr = req.query.sort === 'views' ? '-views' : '-createdAt';
    const total    = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author',   'name avatar')
      .populate('category', 'name slug color')
      .sort(sortStr)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: { articles: articles.map(normalizeOut) },
      pagination: pagination(query, total, page, limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author',   'name avatar bio')
      .populate('category', 'name slug color');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    article.views += 1;
    await article.save();
    res.json({ success: true, data: normalizeOut(article) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const articles = await Article.find({ isFeatured: true, status: 'published' })
      .populate('author',   'name avatar')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(6);
    res.json({ success: true, data: articles.map(normalizeOut) });
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
    const body  = await normalizeBody(req.body);
    body.author = req.user._id;
    body.slug   = await generateUniqueSlug(body.title);
    if (body.status === 'published') body.publishedAt = new Date();
    body.readTime = Math.ceil((body.content || '').split(' ').length / 200);
    const article = await Article.create(body);
    const populated = await Article.findById(article._id)
      .populate('author',   'name avatar')
      .populate('category', 'name slug color');
    res.status(201).json({ success: true, data: normalizeOut(populated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const body = await normalizeBody(req.body);
    if (body.title) body.slug = await generateUniqueSlug(body.title, req.params.id);
    if (body.status === 'published' && !body.publishedAt) body.publishedAt = new Date();
    const article = await Article.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true })
      .populate('author',   'name avatar')
      .populate('category', 'name slug color');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.json({ success: true, data: normalizeOut(article) });
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

