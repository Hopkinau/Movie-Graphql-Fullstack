// Import React hooks and components
import { useState, useEffect } from 'react'; // React Hooks
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // React Router Libraries
import { Container } from 'react-bootstrap'; // React Bootstrap Library

// Import custom components
import Header from './Components/Header';
import Movie from './Pages/Movie';
import MovieEntryEdit from './Pages/MovieEntryEdit';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import NotFound from './Pages/NotFound';

//? APOLLO CLIENT
// Import Apollo Client and related dependencies
// ApolloClient - Used to connect to the GraphQL server
// InMemoryCache - Used to cache GraphQL data
// ApolloProvider - Used to provide access to the Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

function App() {
  const [user, setUser] = useState(null); // User state

  //Saves user to State and Session Storage
  const handleLogin = (user) => {
    setUser(user); // Set user to state
    saveTokenToSessionStorage(user); // Save user to session storage
  };

  //Clears user from State and Session Storage
  const handleLogout = () => {
    client.clearStore(); // Clear Apollo Client cache
    sessionStorage.removeItem('user'); // Clear session storage
    setUser(null); // Clear user from state
  };

  //Saves user to Session Storage
  function saveTokenToSessionStorage(user) {
    sessionStorage.setItem('user', JSON.stringify(user)); // Save user to session storage as a string
  }

  //Gets user from Session Storage
  const getUserFromSessionStorage = () => {
    try {
      const userString = sessionStorage.getItem('user'); // Get user from session storage
      const user = JSON.parse(userString); // Parse user to JSON
      return user;
    } catch (error) {
      sessionStorage.setItem('user', ''); // Clear session storage
      return null;
    }
  };

  //Protected Route
  // If user is not logged in, redirect to login page
  // Component - Component to render
  // ...rest - Other props
  function ProtectedRoute({ component: Component, ...rest }) {
    const user = getUserFromSessionStorage(); // Get user from session storage
    // If user is not logged in, redirect to login page
    if (!user) {
      return <Navigate to='/login' replace />; // Redirect to login page
    }
    return <Component {...rest} user={user} />; // Render protected component
  }

  //Check if user is logged in on page load
  useEffect(() => {
    const user = getUserFromSessionStorage();
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Apollo Provider wraps the entire app to provide access to the Apollo Client */}
      <ApolloProvider client={client}>
        <Container className='min-width'>
          <Header user={user} onLogout={handleLogout} />
          <Routes>
            <Route path='/login' element={<Login onLogin={handleLogin} />} />
            <Route path='/signup' element={<SignUp onLogin={handleLogin} />} />
            {/* Protected Movie Routes */}
            <Route
              path='/'
              element={<ProtectedRoute component={Movie} user={user} />}
            />
            {/* Protected Movie Entry Edit Route */}
            <Route
              path='/movie/edit/:movieEntryId'
              element={
                <ProtectedRoute component={MovieEntryEdit} user={user} />
              }
            />
            {/* 404 Page */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
