// Importing the Express module to create a router for handling HTTP requests.
const express = require("express");
const router = express.Router();

// Importing the Users model from the current directory. This model is used to interact with the users table in the database.
const { Users } = require(".");

// Importing the bcrypt library for hashing and comparing passwords.
const bcrypt = require("bcrypt");

// Defining a POST route for user registration.
router.post("/", async (req, res) => {
  // Extracting username and password from the request body.
  const { username, password } = req.body;

  // Hashing the password using bcrypt with a salt round of 10.
  bcrypt.hash(password, 10).then((hash) => {
    // Creating a new user in the database with the hashed password.
    Users.create({
      username: username,
      password: hash,
    });
    // Sending a success response.
    res.json("SUCCESS");
  });
});

// Defining a POST route for user login.
router.post("/login", async (req, res) => {
  // Extracting username and password from the request body.
  const { username, password } = req.body;

  // Finding the user in the database by username.
  const user = await Users.findOne({ where: { username: username } });

  // If the user does not exist, send an error response.
  if (!user) res.json({ error: "User Doesn't Exist" });

  // Comparing the provided password with the hashed password stored in the database.
  bcrypt.compare(password, user.password).then((match) => {
    // If the passwords do not match, send an error response.
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    // If the passwords match, send a success response.
    res.json("YOU LOGGED IN!!!");
  });
});

// Exporting the router so it can be mounted in the main application file.
module.exports = router;
