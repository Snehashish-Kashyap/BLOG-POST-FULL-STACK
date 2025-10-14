import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey123";

export const UserController = {
  // 🔹 Register new user
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ error: "All fields are required." });

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser)
        return res.status(400).json({ error: "Email already registered." });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.createUser(name, email, hashedPassword);

      res.status(201).json({
        message: "✅ Registration successful!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ error: "Failed to register user." });
    }
  },

  // 🔹 Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Email and password required." });

      const user = await UserModel.findByEmail(email);
      if (!user)
        return res.status(401).json({ error: "Invalid credentials." });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch)
        return res.status(401).json({ error: "Invalid credentials." });

      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "✅ Login successful!",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Login failed." });
    }
  },

  // 🔹 Get user profile from token
  async profile(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.id);

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Error in profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },
};
