import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.error("Error caught in ErrorPage = ", error);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>Sorry, the page you are looking for doesn't exist.</p>
      {error && (
        <p>
          <i>{error.message || error.data || "Unknown error occurred."}</i>
        </p>
      )}
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>
        Go back to homepage
      </a>
    </div>
  );
}

export default ErrorPage;
