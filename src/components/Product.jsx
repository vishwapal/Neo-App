import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import styles from "./Product.module.css";
import SpinnerFullPage from "./SpinnerFullPage";
import { addItem } from "./cartSlice";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://54.86.28.232:5000";

function Product() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("Product ID from URL:", id);

  useEffect(() => {
    if (!id) return;

    async function getProduct(productId) {
      console.log("Fetching product with ID:", productId);
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found");

        const res = await fetch(`${API_BASE_URL}/app/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        console.log("Fetched Product:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getProduct(id);
  }, [id]);

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

  if (isLoading) return <SpinnerFullPage />;
  if (error) return <ErrorPage error={error} />;
  if (!product) return <p className={styles.message}>No product found.</p>;

  return (
    <>
      <button className={styles.goBackButton} onClick={() => navigate(-1)}>
        ← Go Back
      </button>

      <div className={styles.container}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />
        </div>

        {/* Product Details */}
        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.category}>{product.category}</p>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.rating}>
            ⭐ {product.rating.rate} ({product.rating.count} reviews)
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button className={styles.addToCart} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className={styles.buyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
