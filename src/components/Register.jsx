import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import styles from "./Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      setSuccess(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.headerContainer}>
        <Header />
      </div>

      <div className={styles.registerContent}>
        <motion.div
          className={styles.registerContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <div className={styles.inputGroup}>
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <button type="submit" className={styles.registerButton}>
              Register
            </button>

            <p className={styles.loginText}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
