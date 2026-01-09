import express from "express";
import cors from "cors";
// import morgan from "morgan";
import { transactionRoute } from "../routes/transaction.routes.js";
import { userRouter } from "../routes/user.routes.js";
// import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Global middlewares
app.use(
  cors({
    origin: "https://pay-mint-one.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/transactions", transactionRoute);
app.use("/api/users", userRouter);

export default app;
