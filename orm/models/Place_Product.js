'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Place_Product.hasMany( models.Comment, {
        foreignKey: 'idPlaceProduct'
      } )
      Place_Product.hasMany( models.Recommendation, {
        foreignKey: 'idPlaceProduct'
      } )
    }
  }
  Place_Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    type: DataTypes.STRING,
    image: DataTypes.STRING,
    average_rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Place_Product',
  });
  return Place_Product;
};