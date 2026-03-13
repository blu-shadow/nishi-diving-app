const express      = require('express');
const router       = express.Router();
const Order        = require('../models/Order');
const User         = require('../models/User');
const Service      = require('../models/Service');
const Notification = require('../models/Notification');
const AppSettings  = require('../models/AppSettings');
const Certificate  = require('../models/Certificate');
const { protect }  = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes require admin
router.use(protect, adminOnly);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalOrders, pendingOrders, confirmedOrders, completedOrders, cancelledOrders, recentOrders] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'completed' }),
        Order.countDocuments({ status: 'cancelled' }),
        Order.find().populate('user', 'name email').populate('service', 'name icon').sort({ createdAt: -1 }).limit(5)
      ]);

    res.json({ totalUsers, totalOrders, pendingOrders, confirmedOrders, completedOrders, cancelledOrders, recentOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    let orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('service', 'name icon category')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      orders = orders.filter(o =>
        o.user?.name?.toLowerCase().includes(s) ||
        o.service?.name?.toLowerCase().includes(s) ||
        o._id.toString().includes(s)
      );
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, adminNote, totalPrice } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, totalPrice },
      { new: true }
    ).populate('user', 'name email _id').populate('service', 'name icon');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Status-based notifications
    const msgs = {
      confirmed:   '✅ Your order has been confirmed!',
      'in-progress': '🔧 Your order is now in progress.',
      completed:   '🎉 Your order has been completed!',
      cancelled:   '❌ Your order has been cancelled.'
    };

    if (msgs[status] && order.user?.notificationsEnabled !== false) {
      const notifTitle = `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`;
      const notifMsg   = `${msgs[status]} — ${order.service.name}`;

      await Notification.create({
        user: order.user._id,
        title: notifTitle,
        message: notifMsg,
        type: 'order',
        orderId: order._id
      });

      req.app.get('io').to(order.user._id.toString()).emit('newNotification', {
        title: notifTitle, message: notifMsg
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── USERS ────────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Order.deleteMany({ user: req.params.id });
    await Notification.deleteMany({ user: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── APP SETTINGS ─────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    let s = await AppSettings.findOne();
    if (!s) s = await AppSettings.create({});
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let s = await AppSettings.findOne();
    if (!s) s = await AppSettings.create({});
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CERTIFICATES ─────────────────────────────────────────────────────────────
router.get('/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ uploadedAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/certificates/:id', async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (cert) {
      const fs = require('fs');
      const p  = require('path');
      const fp = p.join(__dirname, '..', cert.filePath);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────
router.post('/notify', async (req, res) => {
  try {
    const { userId, title, message, sendToAll } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message required' });

    if (sendToAll) {
      const users = await User.find({ role: 'user', notificationsEnabled: true });
      if (users.length > 0) {
        await Notification.insertMany(users.map(u => ({ user: u._id, title, message, type: 'system' })));
      }
      req.app.get('io').emit('newNotification', { title, message });
    } else {
      await Notification.create({ user: userId, title, message, type: 'system' });
      req.app.get('io').to(userId).emit('newNotification', { title, message });
    }

    res.json({ message: 'Notification sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── SERVICES (admin manage) ──────────────────────────────────────────────────
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
