'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.addColumn('messages', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        });
    },

    down: async(queryInterface, Sequelize) => {
        return queryInterface.removeColumn('messages', 'user_id');
    }
};