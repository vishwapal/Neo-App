import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import products from "./products.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment variables.");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "dist");

const USERS_FILE = path.join(__dirname, "users.json");

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");

const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
const writeUsers = (users) =>
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

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
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Welcome to the backend API!");
});

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

app.get("/app/products", authenticateToken, (req, res) => res.json(products));

app.get("/app/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, username });
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected data accessed", user: req.user });
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.warn(" Warning: React build folder not found. Run `npm run build`.");
}

app.listen(PORT, "0.0.0.0", () =>
  console.log(` Backend running at http://0.0.0.0:${PORT}`)
);
