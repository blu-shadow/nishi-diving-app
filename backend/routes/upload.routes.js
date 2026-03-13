const express     = require('express');
const router      = express.Router();
const multer      = require('multer');
const path        = require('path');
const fs          = require('fs');
const AppSettings = require('../models/AppSettings');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const makeStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${folder}/`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) =>
    cb(null, `${folder}_${Date.now()}${path.extname(file.originalname)}`)
});

const logoUpload = multer({
  storage: makeStorage('logos'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'), false);
  }
});

const certUpload = multer({
  storage: makeStorage('certificates'),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/upload/logo
router.post('/logo', protect, adminOnly, logoUpload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    let settings = await AppSettings.findOne();
    if (!settings) settings = await AppSettings.create({});

    // Remove old logo
    if (settings.logo) {
      const old = path.join(__dirname, '..', settings.logo);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    settings.logo = `/uploads/logos/${req.file.filename}`;
    await settings.save();
    res.json({ logo: settings.logo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/upload/certificate
router.post('/certificate', protect, adminOnly, certUpload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const cert = await Certificate.create({
      name:     req.body.name || req.file.originalname,
      filePath: `/uploads/certificates/${req.file.filename}`,
      fileType: req.file.mimetype.startsWith('image/') ? 'image' : 'pdf'
    });
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/upload/settings  (public — for frontend logo)
router.get('/settings', async (req, res) => {
  try {
    let settings = await AppSettings.findOne();
    if (!settings) settings = await AppSettings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/upload/certificates  (public)
router.get('/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ uploadedAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
