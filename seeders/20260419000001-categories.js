'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Categories', [
      { name: 'Restaurantes',  description: 'Lugares para comer',              createdAt: now, updatedAt: now },
      { name: 'Museos',        description: 'Espacios culturales y arte',       createdAt: now, updatedAt: now },
      { name: 'Bares',         description: 'Bares y vida nocturna',            createdAt: now, updatedAt: now },
      { name: 'Parques',       description: 'Espacios verdes y aire libre',     createdAt: now, updatedAt: now },
      { name: 'Hoteles',       description: 'Alojamiento y hospedaje',          createdAt: now, updatedAt: now },
      { name: 'Cafeterías',    description: 'Cafés y espacios de trabajo',      createdAt: now, updatedAt: now },
      { name: 'Tiendas',       description: 'Comercios y locales de compra',    createdAt: now, updatedAt: now },
      { name: 'Entretenimiento', description: 'Cines, teatros y espectáculos', createdAt: now, updatedAt: now }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
