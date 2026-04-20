'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Place_Products', 'categoryId', {
      type: Sequelize.INTEGER,
      references: { model: 'Categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.removeColumn('Place_Products', 'type');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Place_Products', 'categoryId');
    await queryInterface.addColumn('Place_Products', 'type', { type: Sequelize.STRING });
  }
};
