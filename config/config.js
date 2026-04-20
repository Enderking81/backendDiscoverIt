'use strict';
require('dotenv').config(); // carga las variables del archivo .env en process.env

// las credenciales vienen del .env para no hardcodear datos sensibles en el repositorio
const conexion = {
  username: process.env.dbUser,
  password: process.env.dbPasswd,
  database: process.env.dbName,
  host:     process.env.dbHost,
  port:     process.env.dbPort || 3306,
  dialect:  'mysql'
};

// sequelize-cli espera un objeto con entornos (development, test, production)
module.exports = {
  development: conexion,
  test:        conexion,
  production:  conexion
};
