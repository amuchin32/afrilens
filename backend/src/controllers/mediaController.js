const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'afrilens/media', resource_type: 'image' },
      async (error, result) => {
        if (error) return res.status(500).json({ success: false, message: error.message });
        const media = await Media.create({
          name:       req.file.originalname,
          filename:   result.public_id,
          url:        result.secure_url,
          size:       req.file.size,
          mimetype:   req.file.mimetype,
          uploadedBy: req.user._id,
        });
        res.json({ success: true, url: result.secure_url, media });
      }
    );
    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Not found' });
    if (media.filename) {
      await cloudinary.uploader.destroy(media.filename).catch(() => {});
    }
    await media.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
