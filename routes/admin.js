'use strict';
const express = require('express');
const router = express.Router();
const { User, Place_Product, Recommendation, Comment } = require('../models');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// todas las rutas del panel de admin requieren token + rol isAdmin
router.use(verifyToken, isAdmin);

// GET /admin/stats — contadores globales del sistema para las stat-cards del dashboard
router.get('/stats', async (req, res, next) => {
  try {
    const [users, places, recommendations, comments] = await Promise.all([
      User.count(),
      Place_Product.count(),
      Recommendation.count(),
      Comment.count()
    ]);
    res.json({ users, places, recommendations, comments });
  } catch (err) { next(err); }
});

module.exports = router;
