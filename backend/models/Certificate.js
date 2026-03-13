const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  filePath:   { type: String, required: true },
  fileType:   { type: String, default: 'image' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
