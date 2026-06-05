import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

const users: any[] = []; // Replace with DB in production

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).send("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Invalid email or password");

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'fallback-secret-key-1234');
  res.json({ token, user: { email } });
});

export default router;
