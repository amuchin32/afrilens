const express = require('express');
const router = express.Router();
const { getArticles, getArticle, createArticle, updateArticle, deleteArticle, getFeatured, getBreaking } = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getArticles);
router.get('/featured', getFeatured);
router.get('/breaking', getBreaking);
router.get('/:slug', getArticle);
router.post('/', protect, authorize('admin', 'editor', 'journalist'), createArticle);
router.put('/:id', protect, authorize('admin', 'editor'), updateArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);

module.exports = router;
