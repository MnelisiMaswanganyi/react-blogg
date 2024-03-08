// Importing the Express module to create a router for handling HTTP requests.
const express = require("express");
const router = express.Router();

// Importing the Likes model from the "../models" directory. This model is used to interact with the likes table in the database.
const { Likes } = require("../models");

// Importing the validateToken middleware from "../middlewares/AuthMiddleware". This middleware is used to authenticate users before allowing them to perform certain actions.
const { validateToken } = require("../middlewares/AuthMiddleware");

// Defining a POST route for liking or unliking a post.
// This route uses the validateToken middleware to ensure that only authenticated users can like or unlike posts.
router.post("/", validateToken, async (req, res) => {
  // Extracting the PostId from the request body. This is the ID of the post that the user wants to like or unlike.
  const { PostId } = req.body;
  // The validateToken middleware adds the authenticated user's information to req.user, from which the UserId is extracted.
  const UserId = req.user.id;

  // Checking if a like already exists for the given PostId and UserId.
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // If a like does not already exist, create a new like in the database.
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    // Sending a response indicating that the post has been liked.
    res.json({ liked: true });
  } else {
    // If a like already exists, remove it from the database.
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    // Sending a response indicating that the post has been unliked.
    res.json({ liked: false });
  }
});

// Exporting the router so it can be mounted in the main application file.
module.exports = router;
