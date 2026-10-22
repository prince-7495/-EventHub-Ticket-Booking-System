import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout, attendee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={token ? '/events' : '/'}>
            <h1>EventHub</h1>
          </Link>
        </div>

        <div className="navbar-menu">
          {token ? (
            <>
              <Link to="/events" className="nav-link">
                Events
              </Link>
              <Link to="/my-tickets" className="nav-link">
                My Tickets
              </Link>
              {role === 'organizer' && (
                <Link to="/organizer" className="nav-link">
                  Organizer Panel
                </Link>
              )}
              <span className="nav-user">
                {attendee?.name || attendee?.email}
              </span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
