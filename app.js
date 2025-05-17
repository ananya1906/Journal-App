const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 🔧 Must come first to parse JSON bodies
app.use(express.json());

// 🖼 Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛡️ Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const feedRoutes = require('./routes/feed');
app.use('/feed', feedRoutes);

// 🔐 Protected routes test
const protectedRoutes = require('./routes/protected');
app.use('/protected', protectedRoutes);

// 📓 Journal routes
const journalRoutes = require('./routes/journals');
app.use('/journals', journalRoutes);

// 🌐 Root route
app.get('/', (req, res) => {
  res.send('Toddle Journal API is running...');
});
const { sequelize } = require('./models'); // adjust the path as needed

sequelize.sync({ force: false })  // Use `force: true` only for debugging
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server is running...');
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });


// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
