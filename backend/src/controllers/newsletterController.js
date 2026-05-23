const Newsletter = require('../models/Newsletter');

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already subscribed' });
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Successfully subscribed to AfriLENS newsletter!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndDelete({ email });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { subscribe, unsubscribe };
