// Importing React and the useState hook from the React library
import React, { useState } from "react";
// Importing axios, a promise-based HTTP client for making requests to backend
import axios from "axios";

// Defining the ChangePassword functional component
function ChangePassword() {
  // Using the useState hook to create state variables for oldPassword and newPassword
  // and functions to update these states (setOldPassword, setNewPassword)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Function to handle the password change process
  const changePassword = () => {
    // Making a PUT request using axios to the specified endpoint
    // to change the user's password. The request body includes
    // the old and new passwords. The request headers include an
    // accessToken retrieved from localStorage for authentication
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        // Handling the response from the server. If there's an error
        // in the response data, it is displayed to the user via an alert
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  // Rendering the component UI
  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="text"
        placeholder="Old Password..."
        // Updating the oldPassword state with the value entered by the user
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password..."
        // Updating the newPassword state with the value entered by the user
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Save Changes</button>
    </div>
  );
}

// Exporting the ChangePassword component to be used in other parts of the application
export default ChangePassword;
