const express = require('express');
const router  = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public: submit contact form
router.post('/', submitContact);

// Admin only: view all messages
router.get('/messages', protect, authorize('admin'), getMessages);

module.exports = router;
