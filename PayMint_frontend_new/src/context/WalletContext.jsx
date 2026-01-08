import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { walletApi, transactionApi } from "../services/api";
import { useAuth } from "./AuthContext";
const WalletContext = createContext(null);
export function WalletProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchBalance = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const bal = await walletApi.getBalance();
      setBalance(bal);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  const fetchRecentTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const txns = await transactionApi.getRecentTransactions();
      setTransactions(txns.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);
  const addMoney = useCallback(async (amount) => {
    const result = await walletApi.addMoney(amount);
    console.log(transactions, "---");
    const balanceFromResult = await walletApi.getBalance();
    setBalance(balanceFromResult);
    setTransactions((prev) => [result.successTxn, ...prev.slice(0, 9)]);
    return result;
  }, []);
  const transferMoney = useCallback(async (recipientId, amount) => {
    const result = await walletApi.transferMoney(recipientId, amount);
    const balanceFromResult = await walletApi.getBalance();
    setBalance(balanceFromResult);
    setTransactions((prev) => [result.debitTransaction, result.feeTransaction, ...prev.slice(0, 9)]);
    return result;
  }, []);
  const refreshData = useCallback(async () => {
    await Promise.all([fetchBalance(), fetchRecentTransactions()]);
  }, [fetchBalance, fetchRecentTransactions]);
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [isAuthenticated, refreshData]);
  const value = {
    balance,
    transactions,
    loading,
    error,
    addMoney,
    transferMoney,
    refreshData,
    fetchBalance,
    fetchRecentTransactions
  };
  return /* @__PURE__ */ React.createElement(WalletContext.Provider, { value }, children);
}
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
export default WalletContext;
