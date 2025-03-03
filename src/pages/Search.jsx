import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductItem from "../components/ProductItem";
import { fetchProducts } from "../components/productSlice";
import styles from "./Search.module.css";

const Search = () => {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const [searchedProducts, setSearchedProducts] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchedProducts([]);
      return;
    }

    // Filter products from Redux store instead of making API calls
    const filteredResults = products.filter((item) =>
      item.title.toLowerCase().includes(searchQuery)
    );

    setSearchedProducts(filteredResults);
  }, [searchQuery, products]);

  return (
    <div className={styles.searchContainer}>
      <h2 className={styles.title}>
        Search Results for: <span className={styles.query}>{searchQuery}</span>
      </h2>

      {status === "loading" ? (
        <p>Loading products...</p>
      ) : searchedProducts.length > 0 ? (
        <div className={styles.resultsGrid}>
          {searchedProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyResults}>
          <img
            src="/images/no-results.png"
            alt="No results found"
            className={styles.noResultsImage}
          />
          <p className={styles.noResultsText}>
            Oops! No results found for `<strong>{searchQuery}</strong>`
          </p>
          <p className={styles.suggestionText}>
            Try searching with a different keyword or explore our latest
            products.
          </p>
          <a href="/app/products" className={styles.exploreButton}>
            Explore Products
          </a>
        </div>
      )}
    </div>
  );
};

export default Search;
