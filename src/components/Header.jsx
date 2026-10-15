import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ cartCount, onCartClick }) {

  const {
    isAuthenticated,
    logout,
  } = useAuth();


  const handleLogout = () => {

    logout();

    window.location.href = "/";

  };


  return (

    <header className="header">


      {/* =========================
          LOGO
      ========================= */}

      <Link
        to="/"
        className="logo"
      >

        <span>
          ✦
        </span>

        Atlas Aura

      </Link>


      {/* =========================
          NAVIGATION
      ========================= */}

      <nav>

        <Link to="/">
          Home
        </Link>

        <Link to="/packages">
          Packages
        </Link>

        <Link to="/about">
          About
        </Link>

        {isAuthenticated && (

          <Link to="/bookings">
            Bookings
          </Link>

        )}

      </nav>


      {/* =========================
          HEADER ACTIONS
      ========================= */}

      <div className="header-actions">


        {isAuthenticated ? (

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <Link to="/login">
            Login
          </Link>

        )}


        <button
          className="cart-button"
          onClick={onCartClick}
        >

          🛒 Cart ({cartCount})

        </button>


      </div>

    </header>

  );

}


export default Header;