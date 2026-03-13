const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const User    = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profiles/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, `profile_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, age, address } = req.body;

    if (name)    user.name    = name;
    if (phone)   user.phone   = phone;
    if (age)     user.age     = Number(age);
    if (address) user.address = address;
    if (req.body.theme) user.theme = req.body.theme;
    if (req.body.notificationsEnabled !== undefined)
      user.notificationsEnabled = req.body.notificationsEnabled === 'true';

    if (req.file) {
      // Delete old pic if exists
      if (user.profilePic && user.profilePic.includes('uploads/')) {
        const oldPath = path.join(__dirname, '..', user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePic = `/uploads/profiles/${req.file.filename}`;
    }

    const updated = await user.save();
    res.json({
      _id:                  updated._id,
      name:                 updated.name,
      email:                updated.email,
      phone:                updated.phone,
      age:                  updated.age,
      address:              updated.address,
      profilePic:           updated.profilePic,
      theme:                updated.theme,
      notificationsEnabled: updated.notificationsEnabled,
      role:                 updated.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/settings  (theme & notifications only)
router.put('/settings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.theme !== undefined) user.theme = req.body.theme;
    if (req.body.notificationsEnabled !== undefined)
      user.notificationsEnabled = req.body.notificationsEnabled;
    await user.save();
    res.json({ theme: user.theme, notificationsEnabled: user.notificationsEnabled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
