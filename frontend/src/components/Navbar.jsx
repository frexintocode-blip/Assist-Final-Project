import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-dark fs-3" to="/">ASSIST</Link>
        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="me-3 text-secondary">Hello, <strong>{user.name}</strong></span>
              {user.role === 'admin' && (
                <Link className="btn btn-outline-dark btn-sm me-2" to="/admin">Admin Desk</Link>
              )}
              {user.role === 'provider' && (
                <Link className="btn btn-outline-dark btn-sm me-2" to="/dashboard">Dashboard</Link>
              )}
              <button className="btn btn-link text-danger text-decoration-none btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-link text-dark text-decoration-none me-3 fw-medium" to="/login">Log in</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;