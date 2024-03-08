// Importing necessary React hooks and components
import React, { useContext, useEffect, useState } from "react";
// Axios for making HTTP requests
import axios from "axios";
// useNavigate for navigation, Link for declarative navigation
import { Link, useNavigate } from "react-router-dom";
// Importing the ThumbUpAltIcon from MUI icons for like button
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
// Importing the AuthContext for authentication state management
import { AuthContext } from "../helpers/AuthContext";

// Defining the Home functional component
function Home() {
  // State for storing the list of posts and liked posts
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  // Using useContext to access the global authentication state
  const { authState } = useContext(AuthContext);
  // useNavigate hook for programmatically navigating
  let history = useNavigate();

  // useEffect hook to fetch posts and liked posts on component mount
  useEffect(() => {
    // Redirect to login if no accessToken found, ensuring user is authenticated
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      // Fetching posts from backend if authenticated
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          // Setting the posts and liked posts state with response data
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, [history]);

  // Function to handle liking a post
  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        // Updating the posts state to reflect the like action
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                // If liked, add a dummy like to the Likes array
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                // If unliked, remove the last like from the Likes array
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        // Updating the likedPosts state to reflect the like action
        if (likedPosts.includes(postId)) {
          // If already liked, remove from likedPosts
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          // If not liked, add to likedPosts
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  // Rendering the list of posts
  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                // Navigating to the post detail page on click
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                {/* Link to the user's profile */}
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                {/* Like button with dynamic class based on whether the post is liked */}
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                {/* Displaying the number of likes */}
                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Exporting the Home component for use in other parts of the application
export default Home;
