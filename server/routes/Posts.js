// Importing the Express module to create a router for handling HTTP requests.
const express = require("express");
const router = express.Router();

// Importing the Posts and Likes models from the "../models" directory. These models are used to interact with the posts and likes tables in the database, respectively.
const { Posts, Likes } = require("../models");

// Importing the validateToken middleware from "../middlewares/AuthMiddleware". This middleware is used to authenticate users before allowing them to perform certain actions.
const { validateToken } = require("../middlewares/AuthMiddleware");

// Defining a GET route to fetch all posts. This route is protected by the validateToken middleware, ensuring that only authenticated users can access it.
router.get("/", validateToken, async (req, res) => {
  // Fetching all posts from the database, including the likes associated with each post.
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  // Fetching all likes made by the authenticated user.
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  // Sending the list of posts and the posts liked by the user as a JSON response.
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

// Defining a GET route to fetch a single post by its ID.
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id; // Extracting the post ID from the URL parameters.
  const post = await Posts.findByPk(id); // Fetching the post from the database by its primary key (ID).
  res.json(post); // Sending the post as a JSON response.
});

// Defining a GET route to fetch all posts created by a specific user.
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id; // Extracting the user ID from the URL parameters.
  // Fetching all posts from the database where the UserId matches the provided ID, including the likes associated with each post.
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts); // Sending the list of posts as a JSON response.
});

// Defining a POST route for creating a new post. This route is protected by the validateToken middleware.
router.post("/", validateToken, async (req, res) => {
  const post = req.body; // Extracting the post data from the request body.
  // Adding the username and user ID of the authenticated user to the post object.
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post); // Creating a new post in the database with the provided data.
  res.json(post); // Sending the created post as a JSON response.
});

// Defining a PUT route for updating the title of a post. This route is protected by the validateToken middleware.
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body; // Extracting the new title and post ID from the request body.
  await Posts.update({ title: newTitle }, { where: { id: id } }); // Updating the title of the post in the database.
  res.json(newTitle); // Sending the new title as a JSON response.
});

// Defining a PUT route for updating the text of a post. This route is protected by the validateToken middleware.
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body; // Extracting the new text and post ID from the request body.
  await Posts.update({ postText: newText }, { where: { id: id } }); // Updating the text of the post in the database.
  res.json(newText); // Sending the new text as a JSON response.
});

// Defining a DELETE route for removing a post. This route is protected by the validateToken middleware.
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId; // Extracting the post ID from the URL parameters.
  await Posts.destroy({
    where: {
      id: postId,
    },
  }); // Deleting the post from the database.

  res.json("DELETED SUCCESSFULLY"); // Sending a success message as a JSON response.
});

// Exporting the router so it can be mounted in the main application file.
module.exports = router;
