const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  name:       { type: String },
  filename:   { type: String },
  url:        { type: String, required: true },
  size:       { type: Number },
  mimetype:   { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
