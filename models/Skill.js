const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Skill = sequelize.define('Skill', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Skill.sync({ force: true })
  .then(() => {
    console.log("'Skill' table created");
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = Skill;
