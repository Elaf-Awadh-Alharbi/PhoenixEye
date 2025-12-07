import express from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


const usersFilePath = path.join(process.cwd(), "backend", "data", "users.json");


function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading users file:", err.message);
    return [];
  }
}


function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}


const JWT_SECRET = process.env.JWT_SECRET || "phoenix_eye_super_secret";


router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const users = readUsers();

    
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      fullName,
      email,
      password: hashedPassword,
      role, 
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

   
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      message: "Account created successfully.",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { password: _, ...safeUser } = user;

    res.json({
      message: "Login successful.",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
});

export default router;
