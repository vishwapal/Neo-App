import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import products from "./products.js";

dotenv.config();
const app = express();

// Fix __dirname reference for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure distPath is correctly set
const distPath = path.join(__dirname, "dist");

// Serve static files from React build
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://YOUR_SERVER_IP:5000", // Replace with actual server IP
      "http://yourdomain.com",
    ],
    credentials: true,
  })
);

// Ensure `users.json` exists
const USERS_FILE = path.join(__dirname, "users.json");
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

// Read & Write Users
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Ensure `JWT_SECRET` is set
if (!process.env.JWT_SECRET) {
  console.error("❌ Error: Missing JWT_SECRET in environment variables.");
  process.exit(1);
}

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  writeUsers(users);
  res.json({ message: "User registered successfully" });
});

// Get Products API
app.get("/app/products", (req, res) => res.json(products));

// Get Single Product by ID
app.get("/app/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  res.json({ token, username });
});

// Protected Route
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  // Extract Bearer token
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ message: "Protected data accessed", user: decoded });
  });
});

// Start Server with Error Handling
const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Error: Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error("❌ Server error:", err);
    }
  });
