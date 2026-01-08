import { prisma } from "../src/db.js";

import { v4 as uuidv4 } from "uuid";

const FEE_PERCENTAGE = 2; // 2%

const sendMoney = async (req, res) => {
  const { senderId, receiverId, amount, description } = req.body;
  console.log(senderId, receiverId, amount, description);

  if (!senderId || !receiverId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ message: "Sender and receiver cannot be same" });
  }

  const feeAmount = Number(((amount * FEE_PERCENTAGE) / 100).toFixed(2));

  let debitTxn;
  let feeTxn;

  try {
    // 1️⃣ Create DEBIT transaction (PENDING)
    debitTxn = await prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        userId: senderId,
        amount,
        type: "DEBIT",
        status: "PENDING",
        description: description || "Wallet transfer",
      },
    });

    // 2️⃣ Create FEE transaction (PENDING)
    feeTxn = await prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        userId: senderId,
        amount: feeAmount,
        type: "FEE",
        status: "PENDING",
        description: "Transfer fee",
      },
    });

    // 3️⃣ Atomic balance updates + credit creation
    const result = await prisma.$transaction(async (tx) => {
      // 3a️⃣ Fetch sender
      const sender = await tx.user.findUnique({
        where: { id: senderId },
      });

      const totalDebit = amount + feeAmount;

      if (!sender || sender.balance < totalDebit) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      // 3b️⃣ Deduct total amount (transfer + fee)
      await tx.user.update({
        where: { id: senderId },
        data: {
          balance: { decrement: totalDebit },
        },
      });

      // 3c️⃣ Credit receiver
      await tx.user.update({
        where: { id: receiverId },
        data: {
          balance: { increment: amount },
        },
      });

      // 3d️⃣ Create CREDIT transaction
      const creditTxn = await tx.transaction.create({
        data: {
          transactionId: uuidv4(),
          userId: receiverId,
          amount,
          type: "CREDIT",
          status: "SUCCESS",
          description: `Received from user ${senderId}`,
        },
      });

      // 3e️⃣ Mark DEBIT as SUCCESS
      const successDebit = await tx.transaction.update({
        where: { id: debitTxn.id },
        data: { status: "SUCCESS" },
      });

      // 3f️⃣ Mark FEE as SUCCESS
      const successFee = await tx.transaction.update({
        where: { id: feeTxn.id },
        data: { status: "SUCCESS" },
      });

      return { successDebit, creditTxn, successFee };
    });

    return res.status(201).json({
      message: "Transfer successful",
      debitTransaction: result.successDebit,
      feeTransaction: result.successFee,
      creditTransaction: result.creditTxn,
    });
  } catch (error) {
    console.error("Transfer failed:", error.message);

    // 4️⃣ Mark DEBIT & FEE as FAILED
    if (debitTxn?.id) {
      await prisma.transaction.update({
        where: { id: debitTxn.id },
        data: {
          status: "FAILED",
          description:
            error.message === "INSUFFICIENT_BALANCE"
              ? "Insufficient balance"
              : "Transfer failed",
        },
      });
    }

    if (feeTxn?.id) {
      await prisma.transaction.update({
        where: { id: feeTxn.id },
        data: {
          status: "FAILED",
          description: "Fee charge failed",
        },
      });
    }

    return res.status(500).json({
      message:
        error.message === "INSUFFICIENT_BALANCE"
          ? "Insufficient balance"
          : "Transfer failed",
    });
  }
};

const handleAddMoney = async (req, res) => {
  const { userId, amount, description } = req.body;
  console.log(description);

  let transaction;

  try {
    // 1️⃣ Create PENDING transaction
    console.log(12);
    transaction = await prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        userId: Number(userId),
        amount,
        type: "CREDIT",
        status: "PENDING",
        description: "Add money to wallet",
      },
    });
    console.log(13);

    // 2️⃣ Update balance inside DB transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: Number(userId) },
        data: { balance: { increment: amount } },
      });

      const successTxn = await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCESS" },
      });

      return { updatedUser, successTxn };
    });

    res.status(201).json(result);
  } catch (err) {
    // 3️⃣ Mark FAILED
    if (transaction?.id) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" },
      });
    }
    console.error("Add money failed:", err);
    res.status(500).json({ message: "Transaction failed" });
  }
};

//get all transactions

// Prisma model fields used: id, amount, transactionId, description, date, deletedAt, status, type, userId
const getAllTransactions = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "date",
      order = "desc",
      status,
      type,
      userId,
      fromDate,
      toDate,
      includeDeleted = "false",
    } = req.query;
    console.log(req.query);

    // console.log("Query Params:", req.query);

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ["date", "amount", "status", "type"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";

    const sortOrder = order === "asc" ? "asc" : "desc";

    const where = {
      ...(includeDeleted !== "true" && { deletedAt: null }),
      ...(status !== "all" && { status }),
      ...(type !== "all" && { type }),
      ...(userId && { userId: parseInt(userId, 10) }),
      ...((fromDate || toDate) && {
        date: {
          ...(fromDate && { gte: new Date(fromDate) }),
          ...(toDate && { lte: new Date(toDate) }),
        },
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where }),
    ]);

    return res.json({
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(11111);

    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Transaction deleted (soft delete)",
      id: transaction.id,
      deletedAt: transaction.deletedAt,
    });
  } catch (err) {
    console.error("Delete transaction error:", err);

    // Prisma throws this if record doesn't exist
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

export { sendMoney, getAllTransactions, deleteTransaction, handleAddMoney };
