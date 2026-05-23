const express = require('express');
const router = express.Router();
const { getVideos, getVideo, createVideo, deleteVideo } = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getVideos);
router.get('/:id', getVideo);
router.post('/', protect, authorize('admin', 'editor'), createVideo);
router.delete('/:id', protect, authorize('admin'), deleteVideo);

module.exports = router;
