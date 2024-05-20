'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recommendation.belongsTo(models.Place_Product, {
        foreignKey: 'idPlaceProduct', // Utiliza idPlaceProduct como la clave externa
        targetKey: 'id' // Utiliza id como la clave primaria objetivo
      })
      Recommendation.belongsTo(models.User, {
        foreignKey:'idUser',
        targetKey:'id'
      })
    }
  }
  Recommendation.init({
    idUser: DataTypes.INTEGER,
    idPlaceProduct: DataTypes.INTEGER,
    points: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recommendation',
  });
  return Recommendation;
};