const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Enrollment = sequelize.define('Enrollment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

Enrollment.sync({ force: true })
  .then(() => {
    console.log("'Enrollment' table created");
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = Enrollment;
