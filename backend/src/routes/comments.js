const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:articleId', getComments);
router.post('/:articleId', protect, addComment);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteComment);

module.exports = router;
