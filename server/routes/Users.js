// Importing necessary modules
const express = require("express");
const router = express.Router();
const { Users } = require("../models"); // Sequelize model for users
const bcrypt = require("bcrypt"); // For hashing passwords
const { validateToken } = require("../middlewares/AuthMiddleware"); // Middleware for validating JWTs
const { sign } = require("jsonwebtoken"); // For signing JWTs

// Route for user registration
router.post("/", async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from request body
  bcrypt.hash(password, 10).then((hash) => { // Hashing the password with bcrypt
    Users.create({ // Creating a new user in the database with the hashed password
      username: username,
      password: hash,
    });
    res.json("SUCCESS"); // Sending a success response
  });
});

// Route for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from request body

  const user = await Users.findOne({ where: { username: username } }); // Finding the user in the database

  if (!user) res.json({ error: "User Doesn't Exist" }); // If user not found, send an error

  bcrypt.compare(password, user.password).then(async (match) => { // Comparing the provided password with the hashed password in the database
    if (!match) res.json({ error: "Wrong Username And Password Combination" }); // If passwords don't match, send an error

    const accessToken = sign( // Signing a new JWT for the user
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id }); // Sending the JWT along with username and ID in the response
  });
});

// Route for validating the authentication token
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user); // Sending back the user information added to req by validateToken middleware
});

// Route for fetching basic user information by ID
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id; // Extracting user ID from URL parameters

  const basicInfo = await Users.findByPk(id, { // Fetching user from database excluding the password
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo); // Sending the user's basic information in the response
});

// Route for changing user password
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body; // Extracting old and new passwords from request body
  const user = await Users.findOne({ where: { username: req.user.username } }); // Finding the user in the database

  bcrypt.compare(oldPassword, user.password).then(async (match) => { // Comparing the old password with the user's current password
    if (!match) res.json({ error: "Wrong Password Entered!" }); // If passwords don't match, send an error

    bcrypt.hash(newPassword, 10).then((hash) => { // Hashing the new password
      Users.update( // Updating the user's password in the database
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS"); // Sending a success response
    });
  });
});

// Exporting the router to be used in the main application file
module.exports = router;
