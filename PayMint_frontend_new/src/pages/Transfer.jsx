import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { userApi } from "../services/api";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ConfirmTransferModal } from "../components/ConfirmModal";
import { useToast } from "../hooks/use-toast";
import { appConfig } from "../config/appConfig";
import {
  IndianRupee,
  ArrowLeft,
  Send,
  Users,
  AlertCircle,
  Check
} from "lucide-react";

export function Transfer() {
  const [amount, setAmount] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { transferMoney, balance } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await userApi.getUsers();
        console.log("usersList:", usersList);
        setUsers(usersList);
      } catch (error) {
        toast({
          title: "Failed to load recipients",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const formatBalance = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * appConfig.transactionFee;
  const total = numAmount + fee;
  const hasInsufficientBalance = total > balance;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecipient) {
      toast({ title: "Please select a recipient", variant: "destructive" });
      return;
    }
    if (!amount || numAmount <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (numAmount < appConfig.minTransactionAmount) {
      toast({
        title: `Minimum amount is ₹${appConfig.minTransactionAmount}`,
        variant: "destructive",
      });
      return;
    }
    if (numAmount > appConfig.maxTransactionAmount) {
      toast({
        title: `Maximum amount is ${formatBalance(
          appConfig.maxTransactionAmount
        )}`,
        variant: "destructive",
      });
      return;
    }
    if (hasInsufficientBalance) {
      toast({
        title: "Insufficient balance",
        description: `You need ${formatBalance(total)} but only have ${formatBalance(balance)}`,
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    try {
      await transferMoney(selectedRecipient.id, numAmount);
      setShowConfirm(false);
      toast({
        title: "Transfer successful!",
        description: `${formatBalance(numAmount)} sent to ${selectedRecipient.name}`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto animate-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Transfer Money
            </h1>
            <p className="text-muted-foreground">Send money to another user</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-foreground">
                {formatBalance(balance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Transaction Fee</p>
              <p className="text-lg font-semibold text-foreground">
                {appConfig.transactionFee * 100}%
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Recipient
            </Label>
            {loadingUsers ? (
              <div className="grid grid-cols-1 gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted animate-shimmer rounded-xl"
                  />
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedRecipient(user)}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${selectedRecipient?.id === user.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                      }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {selectedRecipient?.id === user.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recipients available
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-foreground">
              Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-12 h-16 text-3xl font-bold text-center"
                disabled={loading}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Max per transaction: {formatBalance(appConfig.maxTransactionAmount)}
            </p>
          </div>

          {numAmount > 0 && (
            <div
              className={`rounded-xl p-4 space-y-3 animate-fade-in ${hasInsufficientBalance
                ? "bg-destructive/5 border border-destructive/20"
                : "bg-muted"
                }`}
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">
                  {formatBalance(numAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee (2%)</span>
                <span className="text-foreground">{formatBalance(fee)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">
                  {formatBalance(total)}
                </span>
              </div>
              {hasInsufficientBalance && (
                <div className="flex items-center gap-2 text-destructive text-sm pt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Insufficient balance</span>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-lg font-medium"
            disabled={
              loading || !selectedRecipient || !amount || hasInsufficientBalance
            }
          >
            <span className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Continue to Review
            </span>
          </Button>

          <ConfirmTransferModal
            open={showConfirm}
            onOpenChange={setShowConfirm}
            onConfirm={handleConfirmTransfer}
            recipient={selectedRecipient}
            amount={numAmount}
            fee={fee}
            total={total}
            loading={loading}
          />
        </form>
      </div>
    </Layout>
  );
}

export default Transfer;
