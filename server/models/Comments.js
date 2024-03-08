// Exporting a function that defines a model in Sequelize
module.exports = (sequelize, DataTypes) => {
  // Using sequelize.define to create a new model called 'Comments'
  const Comments = sequelize.define("Comments", {
      // Defining a field/column 'commentBody' in the 'Comments' table
      commentBody: {
          type: DataTypes.STRING, // Setting the data type of 'commentBody' to string
          allowNull: false,      // Making this field required by setting allowNull to false
      },
  });

  // Returning the model after it's defined
  return Comments;
};
