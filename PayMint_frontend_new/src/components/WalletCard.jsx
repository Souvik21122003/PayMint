import React, { useState } from "react";
import { Wallet, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

export function WalletCard({ balance, loading }) {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 shadow-wallet">
        <div className="animate-shimmer h-32 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 shadow-wallet animate-fade-in">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-foreground" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-primary-foreground" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium">
                Available Balance
              </p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent font-medium">Active</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="space-y-1">
          <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground tracking-tight">
            {showBalance ? formatBalance(balance) : "••••••"}
          </h2>
          <p className="text-primary-foreground/60 text-sm">
            INR • Personal Wallet
          </p>
        </div>
      </div>
    </div>
  );
}

export default WalletCard;
