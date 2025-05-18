const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const feedRoutes = require('./routes/feed');
app.use('/feed', feedRoutes);


const protectedRoutes = require('./routes/protected');
app.use('/protected', protectedRoutes);


const journalRoutes = require('./routes/journals');
app.use('/journals', journalRoutes);


app.get('/', (req, res) => {
  res.send('Toddle Journal API is running...');
});
const { sequelize } = require('./models'); 

sequelize.sync({ force: false })  
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server is running...');
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });



app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
