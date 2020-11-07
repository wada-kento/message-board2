'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user.hasMany(models.message);
            user.hasMany(models.reply);
        }
    };
    user.init({
        name: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'user',
        underscored: true,
    });
    return user;
};