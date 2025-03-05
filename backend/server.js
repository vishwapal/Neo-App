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

// Start Server
const PORT = process.env.PORT || 5000;

// Ensure correct __dirname definition for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the dist path is correct
const distPath = path.join(__dirname, "dist");

// Ensure `users.json` exists
const USERS_FILE = path.join(__dirname, "users.json");
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");

// Read & Write Users
const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
const writeUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Middleware
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(403).send("Token required");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = user;
    next();
  });
};

// User Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  writeUsers(users);
  res.json({ message: "User registered successfully" });
});

// Get Products API
app.get("/app/products", authenticateToken, (req, res) => res.json(products));

// Get Single Product by ID
app.get("/app/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, username });
});

// Protected Route
app.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ message: "Protected data accessed", user: decoded });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

if (!fs.existsSync(distPath)) {
  console.warn(
    "⚠️ Warning: React build folder not found. Run `npm run build`."
  );
}

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables.");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Backend running at http://0.0.0.0:${PORT}`)
);

// Serve static files from React build
app.use(express.static(distPath));
