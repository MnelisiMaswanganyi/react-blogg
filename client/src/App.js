// Importing the main CSS file for global styles
import "./App.css";
// Importing components from react-router-dom for routing
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// Importing page components
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

// Importing the AuthContext for managing global authentication state
import { AuthContext } from "./helpers/AuthContext.js";
// Importing useState and useEffect hooks from React
import { useState, useEffect } from "react";
// Importing axios for making HTTP requests
import axios from "axios";

// Defining the App functional component
function App() {
  // State for managing authentication status, including the user's username, id, and login status
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // useEffect hook to check authentication status when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          // If there's an error (e.g., invalid token), set auth status to false
          setAuthState({ ...authState, status: false });
        } else {
          // If authentication is successful, update the authState with user details
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("accessToken"); // Removing the accessToken from localStorage
    setAuthState({ username: "", id: 0, status: false }); // Resetting the authState
  };

  // Rendering the application UI
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {/* Conditional rendering of navigation links based on authentication status */}
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page</Link>
                  <Link to="/createpost"> Create A Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              {/* Displaying the username and a logout button if the user is logged in */}
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Routes>
            {/* Defining routes for the application */}
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            {/* Fallback route for handling 404 Page Not Found */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

// Exporting the App component for use in the index.js file
export default App;
