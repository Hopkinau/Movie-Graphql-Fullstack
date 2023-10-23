import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//Simple 404 page component
function NotFound() {
  return (
    <Card className="shadow m-3 bg-4">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="emoji display-6 me-2 p-2 rounded-circle inner-shadow-emoji">
            🤔
          </div>
          <div className="title">
            <Card.Title className="bold text-white">404 Not Found</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <i className="bi bi-calendar-event"></i> The page you are looking
              for does not exist.
            </Card.Subtitle>
          </div>
        </div>
        <Link to="/" className="mt-3 btn btn-dark w-100">
          <i className="bi bi-house-fill"></i> Go back to homepage
        </Link>
      </Card.Body>
    </Card>
  );
}

export default NotFound;
