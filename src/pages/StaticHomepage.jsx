import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./StaticHomepage.module.css";

function StaticHomepage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  return (
    <motion.div
      className={styles.homepage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className={styles.hero}>
        <h1>Welcome to Our Platform</h1>
        <p>Your one-stop solution for seamless Shopping.</p>
        {!isAuthenticated && (
          <button
            className={styles.loginButton}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/login");
            }}
          >
            Get Started
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default StaticHomepage;
