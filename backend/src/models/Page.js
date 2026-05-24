const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  key:     { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
