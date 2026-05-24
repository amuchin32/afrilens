const Video = require('../models/Video');
const Category = require('../models/Category');

const resolveCategory = async (cat) => {
  if (!cat) return null;
  if (/^[a-f\d]{24}$/i.test(cat)) return cat;
  const found = await Category.findOne({ name: { $regex: cat, $options: 'i' } });
  return found ? found._id : null;
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true })
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, videos, data: videos });
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
    if (req.body.category) req.body.category = await resolveCategory(req.body.category);
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    if (req.body.category) req.body.category = await resolveCategory(req.body.category);
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: video });
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

module.exports = { getVideos, getVideo, createVideo, updateVideo, deleteVideo };
