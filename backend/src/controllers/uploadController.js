const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'afrilens/articles', resource_type: 'image' },
      (error, result) => {
        if (error) return res.status(500).json({ success: false, message: error.message });
        res.json({ success: true, url: result.secure_url, filename: result.public_id });
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
