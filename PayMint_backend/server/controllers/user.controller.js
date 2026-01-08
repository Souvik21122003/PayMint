import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../src/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "4h";

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        balance: 0,
      },
    });

    const token = signToken({ id: user.id, email: user.email });
    const { password: _, ...userSafe } = user;
    // normalize id to string for consistent client/server usage
    userSafe.id = user.id.toString();

    return res.status(201).json({ token, user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //const match = await bcrypt.compare(password, user.password);
    //if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email });
    const { password: _, ...userSafe } = user;

    return res.status(200).json({ token, user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getBalance = async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ balance: user.balance });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const usersSafe = users.map(({ password, ...user }) => user);
    return res.status(200).json({ users: usersSafe });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { handleLogin, handleSignup, getBalance, getAllUsers };
