'use strict';
const { Model } = require('sequelize');

// tabla intermedia de la relación Many-to-Many entre User y Place_Product
// un usuario puede dar "like" a muchos lugares/productos, y cada lugar puede tener likes de muchos usuarios
module.exports = (sequelize, DataTypes) => {
  class UserLike extends Model {

    // asociaciones directas para poder consultar desde este modelo si se necesita
    static associate(models) {
      UserLike.belongsTo(models.User, { foreignKey: 'userId' });
      UserLike.belongsTo(models.Place_Product, { foreignKey: 'placeProductId' });
    }
  }

  UserLike.init({
    userId:         { type: DataTypes.INTEGER, allowNull: false }, // FK hacia Users
    placeProductId: { type: DataTypes.INTEGER, allowNull: false }  // FK hacia Place_Products
  }, {
    sequelize,
    modelName: 'UserLike',
    tableName: 'UserLikes' // nombre explícito para que Sequelize no lo pluralice mal
  });

  return UserLike;
};
