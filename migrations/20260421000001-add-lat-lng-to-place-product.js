'use strict';
// agrega coordenadas geográficas a Place_Products para mostrarlos en el mapa Leaflet
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Place_Products', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('Place_Products', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Place_Products', 'latitude');
    await queryInterface.removeColumn('Place_Products', 'longitude');
  }
};
