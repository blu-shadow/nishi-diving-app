const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  age:      { type: Number, default: null },
  address:  { type: String, default: '' },
  profilePic: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  notificationsEnabled: { type: Boolean, default: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
