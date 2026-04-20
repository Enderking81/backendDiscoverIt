'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Place_Product, {
        foreignKey: 'idPlaceProduct', // Utiliza idPlaceProduct como la clave externa
        targetKey: 'id' // Utiliza id como la clave primaria objetivo
      })
      Comment.belongsTo(models.User, {
        foreignKey:'idUser',
        targetKey:'id'
      })
    }
  }
  Comment.init({
    idUser: DataTypes.INTEGER,
    idPlaceProduct: DataTypes.INTEGER,
    comment_text: DataTypes.STRING,
    datetimecomment: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};