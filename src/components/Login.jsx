import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import { loginUser } from "./accountSlice";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("vk2@vk.com");
  const [password, setPassword] = useState("mk");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.account);

  console.log("isAuthenticated", isAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ username: email, password })
      ).unwrap();
      console.log("Login successful:", result);
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.headerContainer}>
        <Header />
      </div>

      <div className={styles.loginContent}>
        <motion.div
          className={styles.loginContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>

            <p className={styles.registerText}>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
