'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Recommendations', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Recommendations', 'description');
  }
};
