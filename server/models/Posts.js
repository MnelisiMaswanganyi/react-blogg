// Importing the Express module and using its Router function to create a new router object.
const express = require("express");
const router = express.Router();

// Importing the Posts model from the "../models" directory. This model represents the posts table in the database.
const { Posts } = require("../models");

// Defining a GET route for fetching all posts.
// This is an asynchronous function that waits for the findAll method of the Posts model to retrieve all entries from the posts table.
router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  // Sending the list of posts as a JSON response.
  res.json(listOfPosts);
});

// Defining a GET route for fetching a single post by its ID.
// The ID is extracted from the request parameters (req.params.id).
router.get("/byId/:id", async (req, res) => {
  const id = req.params.id; // Getting the post ID from the URL parameter
  const post = await Posts.findByPk(id); // Using findByPk (find by primary key) to retrieve the post with the given ID
  res.json(post); // Sending the retrieved post as a JSON response
});

// Defining a POST route for creating a new post.
// The post data is expected to be in the request body (req.body).
router.post("/", async (req, res) => {
  const post = req.body; // Getting the post data from the request body
  await Posts.create(post); // Using the create method of the Posts model to insert the new post into the database
  res.json(post); // Sending the created post back in the response
});

// Exporting the router object so it can be used in other parts of the application, typically in the main server file where routes are defined.
module.exports = router;
