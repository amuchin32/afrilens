const Comment = require('../models/Comment');

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId, isApproved: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      article: req.params.articleId,
      author: req.user._id,
      content: req.body.content
    });
    res.status(201).json({ success: true, data: comment, message: 'Comment submitted for review' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getComments, addComment, deleteComment };
