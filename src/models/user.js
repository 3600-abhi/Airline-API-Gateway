'use strict';

const bcrypt = require('bcrypt');
const { ServerConfig } = require('../config');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role, {through: 'User_Roles', as: 'role'});
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 50]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  // Adding hooks (triggers) for encrypting password before inserting in inside table 
  User.beforeCreate(function encrypt(user) {
    // user is the javascript object which is going to be inserted in table
    // user: {email: 'abc@gmail.com', password: '123456'}
    
    // convert it to number because by default it will be string
    const saltRounds = parseInt(ServerConfig.SALT_ROUNDS);

    const encryptedPassword = bcrypt.hashSync(user.password, saltRounds);

    user.password = encryptedPassword;
  });
 

  return User;
};