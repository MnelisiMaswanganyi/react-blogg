'use strict';

// Importing necessary Node.js core modules
const fs = require('fs');
const path = require('path');
// Importing Sequelize, an ORM for Node.js
const Sequelize = require('sequelize');
// Determining the base filename to exclude it from model imports
const basename = path.basename(__filename);
// Determining the environment (development, test, production)
const env = process.env.NODE_ENV || 'development';
// Loading the database configuration for the current environment
const config = require(__dirname + '/../config/config.json')[env];
// Initializing an object to hold the database models
const db = {};

let sequelize;
// Checking if the configuration uses an environment variable to specify the database connection
if (config.use_env_variable) {
  // Creating a Sequelize instance using the environment variable
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Creating a Sequelize instance using the details specified in the config file
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Reading all files in the current directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    // Filtering out the current file, hidden files, and non-JavaScript files
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Importing each model file and initializing it with Sequelize
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Storing the model in the 'db' object using its name as the key
    db[model.name] = model;
  });

// Associating models with each other if they have any associations defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adding the Sequelize instance and the Sequelize class to the 'db' object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporting the 'db' object containing all models and the Sequelize instance
module.exports = db;
