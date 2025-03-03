import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const USERS_FILE = "users.json";

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
    expiresIn: "1h",
  });
  res.json({ token });
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
