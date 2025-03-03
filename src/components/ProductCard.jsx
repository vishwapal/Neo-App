function ProductCard() {
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

export default ProductCard;
