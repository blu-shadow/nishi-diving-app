const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, default: '🌊' },
  price:       { type: String, default: 'Contact for pricing' },
  category:    { type: String, default: 'General' },
  image:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
