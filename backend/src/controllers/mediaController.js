const Media = require('../models/Media');

exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
    const media = await Media.create({
      name:       req.file.originalname,
      filename:   req.file.filename,
      url,
      size:       req.file.size,
      mimetype:   req.file.mimetype,
      uploadedBy: req.user._id,
    });
    res.json({ success: true, url, media });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Not found' });
    await media.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
