import axios from "axios";
import { appConfig } from "../config/appConfig";
const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
  // e.g. "http://localhost:3000/api"
  timeout: 1e4
});
const authHeader = () => {
  const stored = localStorage.getItem("fintech_current_user");
  if (!stored) return {};
  try {
    const { token } = JSON.parse(stored);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};
const handleAxiosError = (err) => {
  console.log(err, "error from handleAxiosError");
  const errorMsg = err.response.data.error || "API error";
  if (errorMsg === "Unauthorized") {
    localStorage.removeItem("fintech_current_user");
    setTimeout(() => {
      window.location.reload();
    }, 5e3);
    throw new Error("Session expired. Please login again.");
  }
  throw new Error(err.response?.data?.error || err.message || "API error");
};
export const userApi = {
  async getUsers() {
    try {
      console.log("api called");
      const res = await api.get("/users/allUsers", { headers: authHeader() });
      const currentStored = userApi.getCurrentUser();
      const currentUserId = currentStored?.user?.id || currentStored?.id;
      const filteredUsers = Array.isArray(res.data.users) ? res.data.users.filter((u) => u.id !== currentUserId) : [];
      return filteredUsers;
    } catch (err) {
      console.log(err.response.data.error);
      handleAxiosError(err);
    }
  },
  async getUserById(id) {
    try {
      const res = await api.get(`/users/${id}`, { headers: authHeader() });
      return res.data || null;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  async login(email, password) {
    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("fintech_current_user", JSON.stringify(res.data));
      return res.data.user || res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  async signup(email, password, name) {
    try {
      const res = await api.post("/users/signup", { email, password, name });
      localStorage.setItem("fintech_current_user", JSON.stringify(res.data));
      return res.data.user || res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  logout() {
    localStorage.removeItem("fintech_current_user");
  },
  getCurrentUser() {
    const stored = localStorage.getItem("fintech_current_user");
    return stored ? JSON.parse(stored) : null;
  }
};
export const walletApi = {
  async getBalance() {
    try {
      const current = userApi.getCurrentUser();
      const id = current?.user?.id || current?.id;
      if (!id) throw new Error("User not authenticated");
      const res = await api.get(`/users/${id}/balance`, {
        headers: authHeader()
      });
      return res.data?.balance ?? 0;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  async addMoney(amount) {
    try {
      if (amount < appConfig.minTransactionAmount) {
        throw new Error(`Minimum amount is $${appConfig.minTransactionAmount}`);
      }
      if (amount > appConfig.maxTransactionAmount) {
        throw new Error(
          `Maximum amount is $${appConfig.maxTransactionAmount.toLocaleString()}`
        );
      }
      const current = userApi.getCurrentUser();
      const id = current?.user?.id || current?.id;
      if (!id) throw new Error("User not authenticated");
      const res = await api.post(
        "/transactions/addMoney",
        { amount, userId: id },
        { headers: authHeader() }
      );
      return res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  async transferMoney(recipientId, amount) {
    try {
      if (amount < appConfig.minTransactionAmount) {
        throw new Error(`Minimum amount is $${appConfig.minTransactionAmount}`);
      }
      if (amount > appConfig.maxTransactionAmount) {
        throw new Error(
          `Maximum amount is $${appConfig.maxTransactionAmount.toLocaleString()}`
        );
      }
      const current = userApi.getCurrentUser();
      const id = current?.user?.id || current?.id;
      const res = await api.post(
        "/transactions/transfer",
        { receiverId: Number(recipientId), amount, senderId: Number(id) },
        { headers: authHeader() }
      );
      return res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
};
export const transactionApi = {
  async getTransactions(filters = {}) {
    try {
      const current = await userApi.getCurrentUser();
      const id = current?.user?.id || current?.id;
      const Params = {
        status: filters.status,
        type: filters.type,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        page: filters.page || 1,
        limit: filters.limit || appConfig.transactionsPerPage,
        userId: Number(id)
      };
      const res = await api.get("/transactions/allTransactions", {
        params: Params,
        headers: authHeader()
      });
      return res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  async getRecentTransactions() {
    try {
      const current = await userApi.getCurrentUser();
      const id = current?.user?.id || current?.id;
      const Params = {
        userId: Number(id)
      };
      const res = await api.get("/transactions/allTransactions", {
        params: Params,
        headers: authHeader()
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  },
  // async updateTransaction(id, updates) {
  //   try {
  //     // const res = await api.put(`/transactions/${id}`, updates, {
  //     //   headers: authHeader(),
  //     // });
  //     // return res.data;
  //   } catch (err) {
  //     handleAxiosError(err);
  //   }
  // },
  async deleteTransaction(id) {
    try {
      const res = await api.put(
        `/transactions/${id}/delete`,
        {},
        { headers: authHeader() }
      );
      return res.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
};
export default {
  user: userApi,
  wallet: walletApi,
  transaction: transactionApi
};
