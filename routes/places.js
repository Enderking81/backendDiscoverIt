'use strict';
const express = require('express');
const router = express.Router();
const { Place_Product, Category, Comment, Recommendation, User } = require('../models');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// GET /places — lista todos los lugares con su categoría
router.get('/', async (req, res, next) => {
  try {
    const places = await Place_Product.findAll({
      include: [{ model: Category, attributes: ['name'] }],
      order: [['average_rating', 'DESC']]
    });
    res.json(places);
  } catch (err) { next(err); }
});

// GET /places/:id — detalle con comentarios y recomendaciones
router.get('/:id', async (req, res, next) => {
  try {
    const place = await Place_Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['name'] },
        { model: Comment,      include: [{ model: User, attributes: ['nickname'] }], order: [['datetimecomment', 'DESC']] },
        { model: Recommendation, include: [{ model: User, attributes: ['nickname'] }], order: [['createdAt', 'DESC']] }
      ]
    });
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });
    res.json(place);
  } catch (err) { next(err); }
});

// POST /places — crea un lugar (seller o admin)
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { name, description, location, categoryId, image } = req.body;
    const place = await Place_Product.create({ name, description, location, categoryId, image });
    res.status(201).json(place);
  } catch (err) { next(err); }
});

// PUT /places/:id — actualiza un lugar (solo admins)
router.put('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const place = await Place_Product.findByPk(req.params.id);
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });
    const { name, description, location, categoryId, image } = req.body;
    await place.update({ name, description, location, categoryId, image });
    res.json(place);
  } catch (err) { next(err); }
});

// DELETE /places/:id — elimina un lugar (solo admins)
router.delete('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const place = await Place_Product.findByPk(req.params.id);
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });
    await place.destroy();
    res.json({ message: 'Lugar eliminado' });
  } catch (err) { next(err); }
});

module.exports = router;
