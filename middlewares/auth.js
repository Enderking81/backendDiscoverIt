'use strict';
const jwt = require('jsonwebtoken');

// clave secreta para firmar y verificar tokens JWT
// en producción debe venir de una variable de entorno, nunca hardcodeada
const JWT_SECRET = process.env.JWT_SECRET || 'discoverit_secret_key';

// middleware que verifica si el request trae un token JWT válido
// se usa en rutas que requieren que el usuario esté logueado
function verifyToken(req, res, next) {
  // el token viene en el header Authorization con formato: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  // jwt.verify lanza error si el token está mal firmado o expiró
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.userId = decoded.id;          // id del usuario disponible en el siguiente middleware
    req.isAdmin = decoded.isAdmin || false; // flag de admin para el middleware isAdmin
    next();
  });
}

// middleware que solo permite pasar a usuarios administradores
// debe usarse DESPUÉS de verifyToken porque depende de req.isAdmin
function isAdmin(req, res, next) {
  if (!req.isAdmin) return res.status(403).json({ error: 'Acceso restringido a administradores' });
  next();
}

module.exports = { verifyToken, isAdmin, JWT_SECRET };
