// This line exports a function from the module. The function takes two arguments:
// 'sequelize', which is an instance of Sequelize, and 'DataTypes', which contains the data types supported by Sequelize.
module.exports = (sequelize, DataTypes) => {
  // Inside the function, we define a new model named "Likes" using the sequelize.define method.
  // In this particular case, no attributes (columns) are explicitly defined for the "Likes" model within the define method call.
  // This might be because the model's attributes are either defined elsewhere or the model is used for a join table in a many-to-many relationship,
  // where only foreign keys are required, and they are automatically managed by Sequelize.
  const Likes = sequelize.define("Likes");

  // The function returns the defined model, making it available for import in other parts of the application.
  return Likes;
};
