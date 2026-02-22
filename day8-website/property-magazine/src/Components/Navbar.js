import { Link } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { FavoritesContext } from "./context/FavoritesContext";

function Navbar() {
    const { favorites } = useContext(FavoritesContext);
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div className="logo">PropertyMag</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li className="favorites-link">
  <Link to="/favorites">
    Favorites
    {favorites.length > 0 && (
      <span className="badge">{favorites.length}</span>
    )}
  </Link>
</li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
