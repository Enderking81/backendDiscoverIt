'use strict';
const express = require('express');
const router = express.Router();
const { UserLike, Place_Product, Category } = require('../models');
const { verifyToken } = require('../middlewares/auth');

// todas las rutas de likes requieren estar logueado
router.use(verifyToken);

// GET /likes — devuelve los lugares con like del usuario, con categoría y rating incluidos
router.get('/', async (req, res, next) => {
  try {
    const likes = await UserLike.findAll({
      where: { userId: req.userId },
      include: [{
        model: Place_Product,
        include: [{ model: Category, attributes: ['name'] }]
      }]
    });
    res.json(likes);
  } catch (err) { next(err); }
});

// POST /likes/:placeProductId — agrega un like al lugar indicado
router.post('/:placeProductId', async (req, res, next) => {
  try {
    const { placeProductId } = req.params;
    const place = await Place_Product.findByPk(placeProductId);
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });

    // findOrCreate evita duplicados si el usuario ya había dado like
    const [like, created] = await UserLike.findOrCreate({
      where: { userId: req.userId, placeProductId }
    });

    if (!created) return res.status(409).json({ error: 'Ya le diste like a este lugar' });
    res.status(201).json({ message: 'Like agregado', like });
  } catch (err) { next(err); }
});

// DELETE /likes/:placeProductId — saca el like del lugar indicado
router.delete('/:placeProductId', async (req, res, next) => {
  try {
    const deleted = await UserLike.destroy({
      where: { userId: req.userId, placeProductId: req.params.placeProductId }
    });
    if (!deleted) return res.status(404).json({ error: 'No tenías like en este lugar' });
    res.json({ message: 'Like eliminado' });
  } catch (err) { next(err); }
});

module.exports = router;
