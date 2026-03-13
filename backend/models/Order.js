const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  details:       { type: String, default: '' },
  location:      { type: String, default: '' },
  scheduledDate: { type: Date, default: null },
  adminNote:     { type: String, default: '' },
  totalPrice:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
