const Video = require('../models/Video');

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true })
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('author', 'name')
      .populate('category', 'name slug');
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    video.views += 1;
    await video.save();
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    req.body.author = req.user._id;
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVideos, getVideo, createVideo, deleteVideo };
