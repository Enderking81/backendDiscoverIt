'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    static associate(models) {
      Reward.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Reward.init({
    userId: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    description: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};
