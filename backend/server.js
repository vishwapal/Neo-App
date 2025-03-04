import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import products from "./products.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "*",
  })
);

const USERS_FILE = "users.json";

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

app.get("/app/products", (req, res) => {
  res.json(products);
});

// Add this route below the existing `/app/products` route
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

app.listen(5000, () => console.log("Server running on port 5000"));
