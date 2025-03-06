import { Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { mergeSameCartItems } from "../util/helper";
import styles from "./Cart.module.css";
import EmptyCart from "./EmptyCart";
import { decreaseItem, emptyCart, increaseItem, removeItem } from "./cartSlice";

function Cart() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const updatedCart = mergeSameCartItems(cart);
  const totalAmount = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (!cart.length) return <EmptyCart />;

  function handleClearCart() {
    dispatch(emptyCart());
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        <div className={styles.cartHeader}>
          <h2>Shopping Cart</h2>
          <button className={styles.clearCartButton} onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
        {updatedCart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              src={item.image}
              alt={item.title}
              className={styles.cartImage}
            />
            <div className={styles.itemDetails}>
              <h3>{item.title}</h3>
              <p className={styles.price}>${item.price.toFixed(2)}</p>
              <div className={styles.quantityContainer}>
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      dispatch(decreaseItem(item.id));
                    }
                  }}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(increaseItem(item.id))}>
                  +
                </button>
              </div>
            </div>
            <button
              className={styles.removeButton}
              onClick={() => dispatch(removeItem(item.id))}
            >
              <Trash size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.orderSummary}>
        <h3>
          Subtotal ({updatedCart.length} items):{" "}
          <span className={styles.totalPrice}>${totalAmount}</span>
        </h3>
        <button className={styles.checkoutButton}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
