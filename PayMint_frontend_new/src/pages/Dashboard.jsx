import React from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/Layout";
import { WalletCard } from "../components/WalletCard";
import { TransactionCard } from "../components/TransactionCard";
import { QuickActions } from "../components/QuickActions";
import { NoTransactionsState } from "../components/EmptyState";
import { TransactionSkeleton } from "../components/LoadingSkeleton";
import { Button } from "../components/ui/button";
import { ArrowRight, RefreshCw } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { balance, transactions, loading, refreshData } = useWallet();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Layout>
      <div className="space-y-8 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your wallet overview
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshData}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <WalletCard balance={balance} loading={loading} />

        <QuickActions />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Transactions
            </h2>
            {transactions.length > 0 && (
              <Button variant="ghost" asChild className="text-primary">
                <Link to="/transactions" className="flex items-center gap-1">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => <TransactionSkeleton key={i} />)
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <NoTransactionsState />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
