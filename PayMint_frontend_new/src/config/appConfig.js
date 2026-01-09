export const appConfig = {
  // Fee configuration
  transactionFee: 0.02,
  // 2% fee on transfers
  apiBaseUrl: "https://paymint-1.onrender.com/api",
  // Limits
  maxTransactionAmount: 1e4,
  // Maximum per-transaction amount
  minTransactionAmount: 1,
  // Minimum transaction amount
  // Initial balance for new users
  initialBalance: 1e3,
  // Pagination
  transactionsPerPage: 10,
  // API simulation delay (ms)
  apiDelay: 500
};
export default appConfig;
