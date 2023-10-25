// Importing the Nav component from react-bootstrap and the Link component from react-router-dom
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Defining the Header component that takes in the user and onLogout props
// user - The user object
// onLogout - The function to call when the user clicks the logout button
function Header({ user, onLogout }) {
  // Returning the JSX for the Header component
  return (
    <Nav className='ms-auto  d-flex flex-column'>
      {/* Rendering the Journal title */}
      <div className='d-flex'>
        <Link to='/' className='text-decoration-none'>
          <h1 className='display-3 text-black bold p-0 m-0'>Movie</h1>
        </Link>
      </div>
      {/* Rendering the navigation links */}
      <div className='d-flex'>
        {/* Rendering the Journal link */}
        <Link to='/' className='nav-link background-hover px-3'>
          Movie
          <i className='bi bi-journal-bookmark-fill ms-2'></i>
        </Link>
        {/* Rendering the user profile and logout links if the user is logged in */}
        {user ? (
          <>
            <Link to='profile' className='nav-link background-hover px-3'>
              {user.username}
              <i className='bi bi-person-fill ms-2'></i>
            </Link>

            <button onClick={onLogout} className='background-hover px-3'>
              Logout
              <i className='bi bi-person-badge ms-2'></i>
            </button>
          </>
        ) : (
          // Rendering the sign up and login links if the user is not logged in
          <>
            <Link to='signup' className='nav-link background-hover px-3'>
              Sign Up
              <i className='bi bi-person-badge ms-2'></i>
            </Link>
            <Link to='login' className='nav-link background-hover px-3'>
              Login
              <i className='bi bi-person-badge ms-2'></i>
            </Link>
          </>
        )}
      </div>
    </Nav>
  );
}

// Exporting the Header component as the default export of this module
export default Header;
