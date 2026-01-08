export const appConfig = {
  // Fee configuration
  transactionFee: 0.02,
  // 2% fee on transfers
  apiBaseUrl: "http://localhost:3000/api",
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
