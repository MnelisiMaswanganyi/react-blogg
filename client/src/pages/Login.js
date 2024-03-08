// Importing necessary hooks from React for state and context, axios for HTTP requests,
// and useNavigate for navigation
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Importing AuthContext for accessing and updating authentication state
import { AuthContext } from "../helpers/AuthContext";

// Defining the Login functional component
function Login() {
  // State hooks for managing username and password inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // useContext hook to access the setAuthState function from AuthContext
  // for updating the global authentication state
  const { setAuthState } = useContext(AuthContext);

  // useNavigate hook for programmatically navigating to other routes
  let history = useNavigate();

  // Function to handle login when the login button is clicked
  const login = () => {
    // Preparing the data object with username and password
    const data = { username: username, password: password };
    // Making a POST request to the login endpoint with the user data
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        // If the server responds with an error, alert the user
        alert(response.data.error);
      } else {
        // On successful login, store the accessToken in localStorage
        localStorage.setItem("accessToken", response.data.token);
        // Update the global authentication state with the user's information and set status to true
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        // Navigate to the homepage
        history.push("/");
      }
    });
  };

  // Rendering the login form
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        // Update the username state as the user types
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        // Update the password state as the user types
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

// Exporting the Login component for use in other parts of the application
export default Login;
