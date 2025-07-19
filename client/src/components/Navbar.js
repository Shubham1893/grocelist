import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { token, logout } = useAuth(); // Use the context

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        FamilyGrocer 🛒
      </Link>
      <div className="navbar-links">
        {!token ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          // FIX: Call the logout function from the context
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;