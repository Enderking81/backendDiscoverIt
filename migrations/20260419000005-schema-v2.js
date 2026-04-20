'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
    await queryInterface.changeColumn('Users', 'nickname', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.removeColumn('Users', 'rewardspoints');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'email', { type: Sequelize.STRING });
    await queryInterface.changeColumn('Users', 'nickname', { type: Sequelize.STRING });
    await queryInterface.changeColumn('Users', 'password', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'rewardspoints', { type: Sequelize.FLOAT });
  }
};
