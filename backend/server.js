import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url"; // Import for handling __dirname in ES Modules
import products from "./products.js";

const app = express();
dotenv.config();

// Correctly resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the correct path for `dist` (located at the root level of `Neo-App`)
app.use(express.static(path.join(__dirname, "../dist"))); // Adjust path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html")); // Adjust path
});

const PORT = process.env.PORT || 5000;

// Free the port if it's already in use
app.listen(PORT, (err) => {
  if (err) {
    if (err.code === "EADDRINUSE") {
      console.error(
        `❌ Port ${PORT} is already in use. Try killing the process using it.`
      );
      process.exit(1);
    }
    console.error("❌ Server error:", err);
  } else {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  }
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://YOUR_SERVER_IP:5000",
      "http://yourdomain.com",
    ],
    credentials: true,
  })
);

const USERS_FILE = path.join(__dirname, "users.json");

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment variables");
  process.exit(1);
}

// Function to read users from JSON file
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Function to write users to JSON file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// **Register User**
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  // Check if user already exists
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  writeUsers(users);
  res.json({ message: "User registered successfully" });
});

// **Get Products API**
app.get("/app/products", (req, res) => {
  res.json(products);
});

// **Get Single Product by ID**
app.get("/app/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// **Login User (JWT Token Generation)**
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  res.json({ token, username });
});

// **Protected Route**
app.get("/protected", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ message: "Protected data accessed", user: decoded });
  });
});
