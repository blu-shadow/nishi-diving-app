const express     = require('express');
const router      = express.Router();
const Service     = require('../models/Service');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services  (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/services/:id  (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/services/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
