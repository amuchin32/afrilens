const express = require('express');
const router  = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage: upload } = require('../middleware/upload');

const mw = [protect, authorize('admin','editor','journalist'), upload.single('image')];

router.post('/',       mw, uploadImage);
router.post('/image',  mw, uploadImage);

module.exports = router;
