import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "./ProductItem";
import styles from "./ProductList.module.css";
import { fetchProducts } from "./productSlice";

function ProductList() {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading products...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <ul className={styles.grid}>
        {products.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
