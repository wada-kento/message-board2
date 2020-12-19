'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            message.hasMany(models.reply);
            message.belongsTo(models.user);
            message.belongsToMany(models.user, { through: models.user_message_like });
        };
    };
    message.init({
        content: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'message',
        underscored: true,
    });
    return message;
};