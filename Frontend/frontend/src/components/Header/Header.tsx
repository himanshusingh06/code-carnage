import logo from "../../assets/react.svg"
import "./Header.css"
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/accounts/login');
  };

  const accessToken = localStorage.getItem('accessToken');

  return (
    <div className="header">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="home" className="logo">
            <img src={logo} alt="AceIt Logo" />
            <span className="logo-text">AceIt</span>
          </Link>
          <ul className="nav-links">
            {["Home", "Features", "Pricing", "Contact"].map((linkss) => (
              <li key={linkss}>
                <Link className="Services" to={linkss}>{linkss}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          {accessToken ? (
            <button className="btn-primary" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/accounts/login">
              <button className="btn-outline">Sign In</button>
              </Link>
              <Link to="/accounts/register">
                <button className="btn-primary">Register</button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;