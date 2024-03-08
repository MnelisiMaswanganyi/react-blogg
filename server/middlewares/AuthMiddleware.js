// Importing the verify function from jsonwebtoken package to validate JWTs
const { verify } = require("jsonwebtoken");

// Defining the validateToken middleware function
const validateToken = (req, res, next) => {
  // Retrieving the accessToken from the request headers
  const accessToken = req.header("accessToken");

  // If no accessToken is provided, return an error response
  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    // Verifying the accessToken with the secret key 'importantsecret'
    // If the token is valid, the payload of the token is returned
    const validToken = verify(accessToken, "importantsecret");

    // Setting a user property on the request object (example usage, typically you'd set something meaningful based on validToken)
    req.user = "pedro";

    // If the token is valid, proceed to the next middleware or route handler
    if (validToken) {
      return next();
    }
  } catch (err) {
    // If token verification fails, catch the error and return an error response
    return res.json({ error: err });
  }
};

// Exporting the validateToken middleware to be used in other parts of the application
module.exports = { validateToken };
