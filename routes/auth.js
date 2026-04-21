'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Profile, Comment, Recommendation, UserLike, Place_Product } = require('../models');
const { JWT_SECRET, verifyToken } = require('../middlewares/auth');

// POST /auth/register — crea usuario y devuelve token listo para usar
router.post('/register', async (req, res, next) => {
  try {
    const { nickname, email, password, seller } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    // el hook beforeCreate del modelo hashea la contraseña automáticamente
    const user = await User.create({ nickname, email, password, seller });

    // creamos un perfil vacío para el usuario nuevo
    await Profile.create({ userId: user.id });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      token,
      user: { id: user.id, nickname: user.nickname, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) { next(err); }
});

// POST /auth/login — valida credenciales y devuelve token JWT
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // validPassword usa bcrypt.compareSync para comparar texto plano con el hash
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      user: { id: user.id, nickname: user.nickname, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) { next(err); }
});

// GET /auth/profile — devuelve el perfil completo del usuario autenticado con sus estadísticas
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'nickname', 'email', 'isAdmin', 'seller'],
      include: [
        // perfil extendido (bio, avatar, etc.)
        { model: Profile, attributes: ['bio', 'avatar', 'location', 'birthdate'] },
        // separate:true ejecuta una query separada para que order+limit funcionen correctamente en MySQL
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'datetimecomment'],
          include: [{ model: Place_Product, attributes: ['id', 'name'] }],
          order: [['datetimecomment', 'DESC']],
          limit: 10,
          separate: true
        },
        {
          model: Recommendation,
          attributes: ['id', 'points', 'description'],
          include: [{ model: Place_Product, attributes: ['id', 'name'] }],
          order: [['createdAt', 'DESC']],
          limit: 10,
          separate: true
        }
      ]
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // cuenta total de likes (no los traemos todos, solo el número)
    const totalLikes = await UserLike.count({ where: { userId: req.userId } });

    res.json({
      ...user.toJSON(),
      stats: {
        comentarios:     user.Comments?.length ?? 0,
        recomendaciones: user.Recommendations?.length ?? 0,
        likes:           totalLikes
      }
    });
  } catch (err) { next(err); }
});

// PUT /auth/profile — actualiza nickname y/o bio del usuario autenticado
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const { nickname, bio } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // actualizamos solo los campos que llegaron en el body
    if (nickname && nickname.trim()) await user.update({ nickname: nickname.trim() });

    // upsert: crea el perfil si no existe, o lo actualiza
    const [profile] = await Profile.findOrCreate({ where: { userId: req.userId } });
    if (bio !== undefined) await profile.update({ bio });

    // actualizamos el token con el nuevo nickname
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, nickname: user.nickname, email: user.email, isAdmin: user.isAdmin },
      bio: profile.bio
    });
  } catch (err) { next(err); }
});

module.exports = router;
