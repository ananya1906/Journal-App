const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Static upload route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const feedRoutes = require('./routes/feed');
app.use('/feed', feedRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/protected', protectedRoutes);

const journalRoutes = require('./routes/journals');
app.use('/journals', journalRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Toddle Journal API is running...');
});

// Sequelize and demo seeding
const { sequelize, User } = require('./models');

async function seedDemoUsers() {
  const demoUsers = [
    {
      name: 'Bob Student',
      email: 'bob@student.com',
      password: await bcrypt.hash('password123', 10),
      role: 'student'
    },
    {
      name: 'Alice Teacher',
      email: 'alice@teacher.com',
      password: await bcrypt.hash('password123', 10),
      role: 'teacher'
    }
  ];

  for (const user of demoUsers) {
    const existing = await User.findOne({ where: { email: user.email } });
    if (!existing) {
      await User.create(user);
    }
  }

  console.log('Demo users seeded');
}

// Start server and sync DB
sequelize.sync()
  .then(async () => {
    console.log('Database synced');
    await seedDemoUsers(); // Seed after sync
    app.listen(PORT, () => {
      console.log('Server is running on port ${PORT}');
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });