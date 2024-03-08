// Importing necessary hooks and components from React, react-router-dom for routing,
// axios for HTTP requests, and the AuthContext for authentication state management
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

// Defining the Post functional component
function Post() {
  // Retrieving the post ID from the URL parameters
  let { id } = useParams();
  // State hooks for managing the post object, comments array, and new comment input
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  // Using useContext to access the global authentication state
  const { authState } = useContext(AuthContext);

  // useNavigate hook for programmatically navigating to other routes
  let history = useNavigate();

  // useEffect hook to fetch the post details and comments on component mount
  useEffect(() => {
    // Fetching the post details by ID
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    // Fetching comments for the post by ID
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  // Function to handle adding a new comment
  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          // Adding the new comment to the comments array and resetting the input field
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  // Function to handle deleting a comment
  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // Removing the deleted comment from the comments array
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  // Function to handle deleting the post
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // Navigating back to the homepage after deleting the post
        history.push("/");
      });
  };

  // Function to handle editing the post title or body
  const editPost = (option) => {
    if (option === "title") {
      // Prompting the user for a new title and sending the update request
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Updating the post object with the new title
      setPostObject({ ...postObject, title: newTitle });
    } else {
      // Prompting the user for new post text and sending the update request
      let newPostText = prompt("Enter New Text:");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Updating the post object with the new text
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  // Rendering the post details, comment input field, and list of comments
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              // Allowing the post owner to edit the title by clicking on it
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              // Allowing the post owner to edit the body by clicking on it
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              // Showing the delete post button only to the post owner
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              // Updating the newComment state as the user types
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  // Showing the delete comment button only to the comment owner
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Exporting the Post component for use in other parts of the application
export default Post;
