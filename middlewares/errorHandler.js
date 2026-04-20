'use strict';

// middleware global de errores — captura cualquier error no manejado y devuelve JSON limpio
// se registra DESPUÉS de todas las rutas en app.js (Express lo detecta por los 4 parámetros)
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // en desarrollo imprimimos el stack; en producción solo el mensaje
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ${status} — ${message}`);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = errorHandler;
