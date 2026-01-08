//get all transactions
//post transaction
//update transaction
//delete transaction
import express from "express";
import {
  deleteTransaction,
  getAllTransactions,
  handleAddMoney,
  sendMoney,
} from "../controllers/transaction.controller.js";
import { verifyAuth } from "../middlewares/verify.auth.js";

const transactionRoute = express.Router();

//get all transactions
transactionRoute.get("/allTransactions", verifyAuth, getAllTransactions);
//post transaction
transactionRoute.post("/transfer", verifyAuth, sendMoney);

transactionRoute.post("/addMoney", verifyAuth, handleAddMoney);
//delete transaction
transactionRoute.put("/:id/delete", verifyAuth, deleteTransaction);

export { transactionRoute };
