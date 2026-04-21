'use strict';
const express = require('express');
const router = express.Router();
const { Comment, User, Place_Product } = require('../models');
const { verifyToken } = require('../middlewares/auth');

// GET /comments/:placeProductId — todos los comentarios de un lugar específico
router.get('/:placeProductId', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { idPlaceProduct: req.params.placeProductId },
      include: [{ model: User, attributes: ['nickname'] }],
      order: [['datetimecomment', 'DESC']] // los más nuevos primero
    });
    res.json(comments);
  } catch (err) { next(err); }
});

// POST /comments — crea un comentario en un lugar (requiere login)
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { idPlaceProduct, comment_text } = req.body;

    // verificamos que el lugar exista antes de comentar
    const place = await Place_Product.findByPk(idPlaceProduct);
    if (!place) return res.status(404).json({ error: 'Lugar no encontrado' });

    const comment = await Comment.create({
      idUser: req.userId,          // viene del token, no del body (evita suplantación)
      idPlaceProduct,
      comment_text,
      datetimecomment: new Date()
    });

    res.status(201).json(comment);
  } catch (err) { next(err); }
});

// DELETE /comments/:id — elimina un comentario (solo el autor puede borrarlo)
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    // un usuario no puede borrar el comentario de otro
    if (comment.idUser !== req.userId) {
      return res.status(403).json({ error: 'No podés borrar un comentario ajeno' });
    }

    await comment.destroy();
    res.json({ message: 'Comentario eliminado' });
  } catch (err) { next(err); }
});

module.exports = router;
