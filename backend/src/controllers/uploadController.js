const path = require('path');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
