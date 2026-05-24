const express = require('express');
const router  = express.Router();
const { getPage, updatePage } = require('../controllers/pageController');
const { protect, authorize }  = require('../middleware/auth');

router.get('/:key', getPage);
router.put('/:key', protect, authorize('admin'), updatePage);

module.exports = router;
