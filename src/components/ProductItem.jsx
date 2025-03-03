import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./ProductItem.module.css";
import { addItem } from "./cartSlice";

function ProductItem({ product }) {
  const dispatch = useDispatch();

  function handleAddToCart(e) {
    e.preventDefault();
    const productItem = {
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.price,
      quantity: 1,
      totalPrice: product.price * 1,
      rating: {
        rate: product.rating.rate,
        count: product.rating.count,
      },
    };
    dispatch(addItem(productItem));
  }
  return (
    <div className={styles["product-card"]}>
      <Link to={`/app/products/${product.id}`} className={styles.card}>
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
      </Link>
      <div className={styles["product-info"]}>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <div className={styles.rating}>
          ⭐ {product.rating.rate} ({product.rating.count} reviews)
        </div>
        <button className={styles["add-to-cart"]} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.shape({
      rate: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};
export default ProductItem;
