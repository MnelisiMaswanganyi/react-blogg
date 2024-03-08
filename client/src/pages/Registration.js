// Importing React for creating the component
import React from "react";
// Importing Formik components for handling form submission, validation, and input fields
import { Formik, Form, Field, ErrorMessage } from "formik";
// Importing Yup for defining the schema for form validation
import * as Yup from "yup";
// Importing axios for making HTTP requests to a backend server
import axios from "axios";

// Defining the Registration functional component
function Registration() {
  // Initial values for the form fields
  const initialValues = {
    username: "",
    password: "",
  };

  // Defining the validation schema using Yup
  // This schema requires the username to be between 3 and 15 characters
  // and the password to be between 4 and 20 characters
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  // Function to handle form submission
  const onSubmit = (data) => {
    // Making a POST request to the specified endpoint with the form data
    axios.post("http://localhost:3001/auth", data).then(() => {
      // Logging the submitted data to the console
      console.log(data);
    });
  };

  // Rendering the registration form using Formik
  return (
    <div>
      <Formik
        initialValues={initialValues} // Setting the initial form values
        onSubmit={onSubmit} // Specifying the function to call on form submission
        validationSchema={validationSchema} // Applying the validation schema
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" /> {/* Displaying validation error messages for username */}
          <Field
            autocomplete="off" // Disabling browser autocomplete
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John123...)"
          />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" /> {/* Displaying validation error messages for password */}
          <Field
            autocomplete="off" // Disabling browser autocomplete
            type="password" // Hiding password input
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />

          <button type="submit"> Register</button> {/* Submit button for the form */}
        </Form>
      </Formik>
    </div>
  );
}

// Exporting the Registration component for use in other parts of the application
export default Registration;
