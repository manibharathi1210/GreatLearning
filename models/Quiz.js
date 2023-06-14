const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Quiz = sequelize.define('Quiz', {
  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
});

Quiz.sync({ force: true })
  .then(() => {
    console.log("'Quiz' table created");
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = Quiz;
