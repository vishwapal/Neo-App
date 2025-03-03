import styles from "./EmptyCart.module.css";

function EmptyCart() {
  return (
    <div className={styles.cartPage}>
      <h2 className={styles.title}>Shopping Cart</h2>
      <div className={styles.cartContainer}>
        <p className={styles.emptyMessage}>Your cart is currently empty.</p>
      </div>
    </div>
  );
}

export default EmptyCart;
