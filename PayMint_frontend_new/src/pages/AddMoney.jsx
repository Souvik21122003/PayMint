import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { appConfig } from "../config/appConfig";
import {
  DollarSign,
  ArrowLeft,
  Check,
  Loader2,
  Wallet,
  Sparkles,
} from "lucide-react";

const quickAmounts = [50, 100, 250, 500, 1000];

export function AddMoney() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { addMoney, balance } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatBalance = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (numAmount < appConfig.minTransactionAmount) {
      toast({
        title: `Minimum amount is $${appConfig.minTransactionAmount}`,
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
    setLoading(true);
    try {
      await addMoney(numAmount);
      toast({
        title: "Money added successfully!",
        description: `${formatBalance(
          numAmount
        )} has been added to your wallet.`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Failed to add money",
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
            <h1 className="text-2xl font-bold text-foreground">Add Money</h1>
            <p className="text-muted-foreground">Top up your wallet balance</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-xl font-bold text-foreground">
              {formatBalance(balance)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-foreground">
              Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
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
              Min: ${appConfig.minTransactionAmount} • Max:{" "}
              {formatBalance(appConfig.maxTransactionAmount)}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground text-sm">
              Quick select
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={amount === value.toString() ? "default" : "outline"}
                  onClick={() => handleQuickAmount(value)}
                  disabled={loading}
                  className="h-12"
                >
                  ${value}
                </Button>
              ))}
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-4 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-success">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                New balance:{" "}
                {formatBalance(balance + parseFloat(amount || 0))}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-lg font-medium"
            disabled={loading || !amount}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Add {amount ? formatBalance(parseFloat(amount)) : "Money"}
              </span>
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}

export default AddMoney;
