'use strict';
const express = require('express');
const cors    = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

// habilita CORS para que el frontend Angular (puerto 4200) pueda consumir la API
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// rutas de la API
app.use('/auth',            require('./routes/auth'));
app.use('/places',          require('./routes/places'));
app.use('/likes',           require('./routes/likes'));
app.use('/comments',        require('./routes/comments'));
app.use('/recommendations', require('./routes/recommendations'));

// 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

// middleware de errores global — debe ir al final, después de todas las rutas
app.use(errorHandler);

app.listen(3000, () => {
  console.log('DiscoverIt API escuchando en http://localhost:3000');
});
