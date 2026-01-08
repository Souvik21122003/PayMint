//log in
//sign up
//get balance
//get user details
import express from "express";
import {
  getAllUsers,
  getBalance,
  handleLogin,
  handleSignup,
} from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/verify.auth.js";
const userRouter = express.Router();
//log in

userRouter.post("/login", handleLogin);

//sign up
userRouter.post("/signup", handleSignup);

//get balance
userRouter.get("/:userId/balance", verifyAuth, getBalance);

userRouter.get("/allUsers", verifyAuth, getAllUsers);

export { userRouter };
