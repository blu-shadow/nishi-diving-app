const express      = require('express');
const router       = express.Router();
const Order        = require('../models/Order');
const Notification = require('../models/Notification');
const { protect }  = require('../middleware/authMiddleware');

// POST /api/orders  — place order
router.post('/', protect, async (req, res) => {
  try {
    const { serviceId, details, location, scheduledDate } = req.body;
    if (!serviceId) return res.status(400).json({ message: 'Service required' });

    const order = await Order.create({
      user: req.user._id, service: serviceId, details, location, scheduledDate
    });
    const populated = await Order.findById(order._id)
      .populate('service', 'name icon');

    // Notification
    await Notification.create({
      user: req.user._id,
      title: '✅ Order Placed',
      message: `Your order for "${populated.service.name}" has been received. We will confirm shortly.`,
      type: 'order',
      orderId: order._id
    });

    req.app.get('io').to(req.user._id.toString()).emit('newNotification', {
      title: '✅ Order Placed',
      message: `Order for "${populated.service.name}" received!`
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('service', 'name icon category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service', 'name icon description price')
      .populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
