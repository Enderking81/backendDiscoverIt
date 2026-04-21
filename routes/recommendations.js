'use strict';
const express = require('express');
const router = express.Router();
const { Recommendation, Place_Product, User } = require('../models');
const { verifyToken } = require('../middlewares/auth');

// GET /recommendations/:placeProductId — recomendaciones de un lugar con el autor
router.get('/:placeProductId', async (req, res, next) => {
  try {
    const recs = await Recommendation.findAll({
      where: { idPlaceProduct: req.params.placeProductId },
      include: [{ model: User, attributes: ['nickname'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(recs);
  } catch (err) { next(err); }
});

// POST /recommendations — crea una recomendación con puntaje y descripción (requiere login)
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { idPlaceProduct, points, description } = req.body;

    // validamos que el puntaje esté entre 1 y 5
    if (!points || points < 1 || points > 5) {
      return res.status(400).json({ error: 'El puntaje debe ser un número entre 1 y 5' });
    }

    const place = await Place_Product.findByPk(idPlaceProduct);
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });

    // un usuario no debería poder recomendar el mismo lugar dos veces
    const yaRecomendo = await Recommendation.findOne({
      where: { idUser: req.userId, idPlaceProduct }
    });
    if (yaRecomendo) return res.status(409).json({ error: 'Ya recomendaste este lugar' });

    const rec = await Recommendation.create({
      idUser: req.userId, // viene del token, no del body
      idPlaceProduct,
      points,
      description
    });

    // recalculamos el promedio del lugar después de cada nueva recomendación
    const todasLasRecs = await Recommendation.findAll({ where: { idPlaceProduct } });
    const promedio = todasLasRecs.reduce((sum, r) => sum + r.points, 0) / todasLasRecs.length;
    await place.update({ average_rating: Math.round(promedio * 10) / 10 }); // redondeo a 1 decimal

    res.status(201).json(rec);
  } catch (err) { next(err); }
});

// PUT /recommendations/:id — edita la descripción o puntaje de una recomendación propia
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const rec = await Recommendation.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Recomendación no encontrada' });

    if (rec.idUser !== req.userId) {
      return res.status(403).json({ error: 'No podés editar una recomendación ajena' });
    }

    const { points, description } = req.body;
    if (points && (points < 1 || points > 5)) {
      return res.status(400).json({ error: 'El puntaje debe ser un número entre 1 y 5' });
    }

    await rec.update({ points, description });

    // recalculamos el promedio del lugar después de editar el puntaje
    const place = await Place_Product.findByPk(rec.idPlaceProduct);
    const todasLasRecs = await Recommendation.findAll({ where: { idPlaceProduct: rec.idPlaceProduct } });
    const promedio = todasLasRecs.reduce((sum, r) => sum + r.points, 0) / todasLasRecs.length;
    await place.update({ average_rating: Math.round(promedio * 10) / 10 });

    res.json(rec);
  } catch (err) { next(err); }
});

// DELETE /recommendations/:id — elimina una recomendación propia
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const rec = await Recommendation.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Recomendación no encontrada' });

    if (rec.idUser !== req.userId) {
      return res.status(403).json({ error: 'No podés borrar una recomendación ajena' });
    }

    const idPlaceProduct = rec.idPlaceProduct;
    await rec.destroy();

    // recalculamos el promedio después de borrar (si no quedan recs, queda en null)
    const place = await Place_Product.findByPk(idPlaceProduct);
    const restantes = await Recommendation.findAll({ where: { idPlaceProduct } });
    const promedio = restantes.length
      ? restantes.reduce((sum, r) => sum + r.points, 0) / restantes.length
      : null;
    await place.update({ average_rating: promedio });

    res.json({ message: 'Recomendación eliminada' });
  } catch (err) { next(err); }
});

module.exports = router;
