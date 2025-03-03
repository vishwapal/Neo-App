import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

const Homepage = () => {
  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Neo Mart!
      </motion.h1>
      <motion.p
        className={styles.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Explore our amazing products and features.
      </motion.p>

      <motion.button
        className={styles.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => alert("Welcome to Neo Mart! 🚀")}
      >
        Get Started
      </motion.button>

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <h2>🚀 New Features!</h2>
        <p>Check out our latest updates and improvements.</p>
        <Link to="/app/products">Explore Products →</Link>
      </motion.div>
    </div>
  );
};

export default Homepage;
