// Importing React for creating the component and Link from react-router-dom for navigation
import React from "react";
import { Link } from "react-router-dom";

// Defining the PageNotFound functional component
function PageNotFound() {
  // The component returns a simple UI indicating that the page was not found
  // and provides a link to navigate back to the Home page
  return (
    <div>
      <h1>Page Not Found :/</h1> {/* Displaying a message indicating the page is not found */}
      <h3>
        Go to the Home Page: {/* Suggesting the user to navigate to the Home page */}
        <Link to="/"> Home Page</Link> {/* Using the Link component to provide a clickable link that navigates to the Home page ("/") */}
      </h3>
    </div>
  );
}

// Exporting the PageNotFound component so it can be used in other parts of the application
export default PageNotFound;
