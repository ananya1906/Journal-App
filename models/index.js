const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json')["development"];
const db = {};

const sequelize = new Sequelize(config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return file !== basename && file.endsWith('.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations
const { User, Journal, JournalStudent } = db;

User.hasMany(Journal, { foreignKey: 'created_by' });
Journal.belongsTo(User, { foreignKey: 'created_by' });

Journal.belongsToMany(User, { through: JournalStudent, as: 'taggedStudents' });
User.belongsToMany(Journal, { through: JournalStudent, as: 'taggedJournals' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
