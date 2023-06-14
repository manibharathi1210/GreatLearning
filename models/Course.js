const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fees: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Course.sync({ force: true })
  .then(() => {
    console.log("'Course' table created");
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = Course;
