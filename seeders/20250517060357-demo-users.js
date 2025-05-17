const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice Teacher',
        email: 'alice@school.com',
        password: passwordHash,
        role: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob Student',
        email: 'bob@student.com',
        password: passwordHash,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};