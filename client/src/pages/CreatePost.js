// Importing necessary hooks and components from React, Formik, Yup for validation, axios for HTTP requests,
// and useNavigate for programmatically navigating between routes
import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Importing the AuthContext to use the authentication state throughout the app
import { AuthContext } from "../helpers/AuthContext";

// Defining the CreatePost functional component
function CreatePost() {
  // Destructuring authState from the AuthContext to access authentication status
  const { authState } = useContext(AuthContext);

  // Using the useNavigate hook for redirecting the user
  let history = useNavigate();

  // Initial values for the form fields
  const initialValues = {
    title: "",
    postText: "",
  };

  // useEffect hook to redirect the user to the login page if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, [history]);

  // Validation schema for the form fields using Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"), // Validation for the title field
    postText: Yup.string().required(), // Validation for the postText field
  });

  // Function to handle form submission
  const onSubmit = (data) => {
    // Making a POST request to the backend with the form data
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") }, // Including the accessToken for authentication
      })
      .then((response) => {
        history.push("/"); // Redirecting to the homepage after successful post creation
      });
  };

  // Rendering the form using Formik
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

// Exporting the CreatePost component for use in other parts of the application
export default CreatePost;
