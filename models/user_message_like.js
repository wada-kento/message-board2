'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user_message_like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_message_like.belongsTo(models.message);
            user_message_like.belongsTo(models.user);
        }
    };
    user_message_like.init({
        message_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'user_message_like',
        underscored: true,
    });
    return user_message_like;
};