'use strict';
const { Model } = require('sequelize');

// una recomendación es cuando un usuario recomienda un lugar/producto con puntaje y descripción
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {

    // asociaciones: la recomendación pertenece a un usuario y a un lugar/producto
    static associate(models) {
      Recommendation.belongsTo(models.Place_Product, {
        foreignKey: 'idPlaceProduct',
        targetKey: 'id'
      });
      Recommendation.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'id'
      });
    }
  }

  Recommendation.init({
    idUser:         DataTypes.INTEGER, // quién recomienda
    idPlaceProduct: DataTypes.INTEGER, // qué se recomienda
    points:         DataTypes.INTEGER, // puntaje numérico (ej: 1 a 5)
    description:    DataTypes.TEXT     // texto libre con la opinión del usuario
  }, {
    sequelize,
    modelName: 'Recommendation',
  });

  return Recommendation;
};
