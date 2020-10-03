'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('messages', [{
                content: 'hoge',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                content: 'fuga',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('messages');
    }
};