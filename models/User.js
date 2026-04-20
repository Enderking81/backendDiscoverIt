'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); // librería para hashear contraseñas de forma segura

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    // asociaciones: define cómo User se relaciona con otros modelos
    static associate(models) {
      User.hasMany(models.Comment, { foreignKey: 'idUser' });           // un usuario puede tener muchos comentarios
      User.hasMany(models.Recommendation, { foreignKey: 'idUser' });    // un usuario puede hacer muchas recomendaciones
      User.hasOne(models.Profile, { foreignKey: 'userId' });            // cada usuario tiene un perfil extendido
      User.hasMany(models.Reward, { foreignKey: 'userId' });            // un usuario acumula recompensas
      // relación Many-to-Many con Place_Product a través de la tabla intermedia UserLikes
      User.belongsToMany(models.Place_Product, { through: 'UserLikes', foreignKey: 'userId' });
    }

    // método de instancia para verificar la contraseña en el login
    // compara el texto plano con el hash guardado en la DB
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init({
    nickname: { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, allowNull: false, unique: true }, // único para evitar registros duplicados
    password: { type: DataTypes.STRING, allowNull: false },              // se guarda hasheado, nunca en texto plano
    seller:   DataTypes.BOOLEAN,                                         // indica si el usuario puede publicar lugares/productos
    isAdmin:  { type: DataTypes.BOOLEAN, defaultValue: false }           // por defecto ningún usuario es admin
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      // antes de crear un usuario, hashea la contraseña automáticamente
      // así nunca se guarda texto plano en la DB aunque alguien lo olvide
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10); // 10 = costo del salt (más alto = más seguro pero más lento)
      },
      // antes de actualizar, solo hashea si la contraseña cambió
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};
