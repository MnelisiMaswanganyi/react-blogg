// Importing necessary hooks from React, react-router-dom for routing,
// and axios for making HTTP requests
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Defining the Profile functional component
function Profile() {
  // Retrieving the user ID from the URL parameters
  let { id } = useParams();
  // useNavigate hook for programmatically navigating to other routes
  let history = useNavigate();
  // State hooks for managing the username and list of posts
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);

  // useEffect hook to fetch user information and their posts on component mount
  useEffect(() => {
    // Fetching basic user information by ID
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username); // Setting the username state
    });

    // Fetching posts created by the user by their ID
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data); // Setting the list of posts state
    });
  }, [id]); // Dependency array includes id to refetch data if the id changes

  // Rendering the profile page
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {/* Displaying the username */}
        <h1> Username: {username} </h1>
      </div>
      <div className="listOfPosts">
        {/* Mapping through the listOfPosts state to display each post */}
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  // Navigating to the post detail page when the post body is clicked
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  {/* Displaying the number of likes each post has received */}
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Exporting the Profile component for use in other parts of the application
export default Profile;
