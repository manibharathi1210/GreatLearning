const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

User.sync({ force: true }) // This will create the 'User' table in the database
  .then(() => {
    console.log("'User' table created");
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

module.exports = User;
