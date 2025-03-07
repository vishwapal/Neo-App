import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../components/accountSlice";
import { emptyCart } from "../components/cartSlice";
import { debounce } from "../util/helper";
import styles from "./Header.module.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const dispatch = useDispatch();

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  }

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/search?q=${query}`);
      }
    }, 1000),
    [navigate]
  );

  function queryChangeHandler(e) {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }

  function handleLogout(e) {
    dispatch(emptyCart());
    dispatch(logoutUser());
  }

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo}>Neo Mart</h1>

        {isAuthenticated && (
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={queryChangeHandler}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={20} />
            </button>
          </form>
        )}

        <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <nav
          className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}
        >
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/app/products"
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                Products
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <Link to="/" className={styles.navLink} onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <Link
              to="/login"
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}

          {/* Cart Icon */}
          {isAuthenticated && (
            <Link
              to="/cart"
              className={styles.cartLink}
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className={styles.cartCount}>{cartCount}</span>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
