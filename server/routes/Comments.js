// Importing the Express module to create a router for handling HTTP requests.
const express = require("express");
const router = express.Router();

// Importing the Comments model from the "../models" directory. This model is used to interact with the comments table in the database.
const { Comments } = require("../models");

// Importing the validateToken middleware from "../middlewares/AuthMiddleware". This middleware is used to authenticate users before allowing them to perform certain actions.
const { validateToken } = require("../middlewares/AuthMiddleware");

// Defining a GET route to fetch all comments associated with a specific post.
// The postId is obtained from the URL parameters.
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  // Using Sequelize's findAll method to retrieve comments where the PostId matches the postId from the request.
  const comments = await Comments.findAll({ where: { PostId: postId } });
  // Sending the retrieved comments as a JSON response.
  res.json(comments);
});

// Defining a POST route for creating a new comment.
// This route uses the validateToken middleware to ensure that only authenticated users can create comments.
router.post("/", validateToken, async (req, res) => {
  const comment = req.body; // Obtaining the comment data from the request body.
  const username = req.user.username; // The validateToken middleware adds the authenticated user's information to req.user.
  comment.username = username; // Adding the username to the comment object.
  // Using Sequelize's create method to insert the new comment into the database.
  await Comments.create(comment);
  // Sending the created comment as a JSON response.
  res.json(comment);
});

// Defining a DELETE route for removing a comment.
// This route also uses the validateToken middleware to ensure that only authenticated users can delete comments.
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId; // Obtaining the commentId from the URL parameters.
  // Using Sequelize's destroy method to delete the comment where the id matches the commentId from the request.
  await Comments.destroy({
    where: {
      id: commentId,
    },
  });
  // Sending a success message as a JSON response.
  res.json("DELETED SUCCESSFULLY");
});

// Exporting the router so it can be mounted in the main application file.
module.exports = router;
