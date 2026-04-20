'use strict';
const { Model } = require('sequelize');

// modelo unificado para lugares y productos (ej: restaurante, museo, artesanía)
// se usa un solo modelo porque comparten los mismos atributos y lógica
module.exports = (sequelize, DataTypes) => {
  class Place_Product extends Model {

    // asociaciones del modelo
    static associate(models) {
      Place_Product.hasMany(models.Comment, { foreignKey: 'idPlaceProduct' });       // puede recibir muchos comentarios
      Place_Product.hasMany(models.Recommendation, { foreignKey: 'idPlaceProduct' }); // puede recibir muchas recomendaciones
      Place_Product.belongsTo(models.Category, { foreignKey: 'categoryId' });         // pertenece a una categoría
      // relación Many-to-Many con User a través de UserLikes (los "me gusta")
      Place_Product.belongsToMany(models.User, { through: 'UserLikes', foreignKey: 'placeProductId' });
    }
  }

  Place_Product.init({
    name:           DataTypes.STRING,  // nombre del lugar o producto
    description:    DataTypes.STRING,  // descripción breve
    location:       DataTypes.STRING,  // dirección o coordenadas
    categoryId:     DataTypes.INTEGER, // FK a la tabla Categories
    image:          DataTypes.STRING,  // URL de la imagen
    average_rating: DataTypes.FLOAT    // promedio calculado a partir de las recomendaciones
  }, {
    sequelize,
    modelName: 'Place_Product',
  });

  return Place_Product;
};
