const express = require('express');
const router  = express.Router();
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage: upload } = require('../middleware/upload');

router.get('/',       protect, authorize('admin','editor'), getMedia);
router.post('/',      protect, authorize('admin','editor'), upload.single('image'), uploadMedia);
router.delete('/:id', protect, authorize('admin'), deleteMedia);

module.exports = router;
