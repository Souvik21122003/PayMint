import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";

export function TransactionCard({ transaction, onDelete, showDelete = false }) {
  const isCredit = transaction.type === "CREDIT";

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "SUCCESS":
        return <Check className="w-3 h-3" />;
      case "FAILED":
        return <X className="w-3 h-3" />;
      case "PENDING":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "SUCCESS":
        return "bg-success/10 text-success";
      case "FAILED":
        return "bg-destructive/10 text-destructive";
      case "PENDING":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-200 animate-fade-in">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCredit ? "bg-success/10" : "bg-primary/10"
            }`}
        >
          {isCredit ? (
            <ArrowDownLeft className="w-5 h-5 text-success" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-primary" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {formatDate(transaction.date)}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusIcon()}
              {transaction.status}
            </span>
          </div>
          {transaction.fee > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Fee: {formatAmount(transaction.fee)}
            </p>
          )}
          {transaction.failureReason && (
            <p className="text-xs text-destructive mt-1">
              {transaction.failureReason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-lg font-semibold ${isCredit ? "text-success" : "text-foreground"
              }`}
          >
            {isCredit ? "+" : "-"}
            {formatAmount(transaction.amount)}
          </p>
          {!isCredit && transaction.fee > 0 && (
            <p className="text-xs text-muted-foreground">
              Total: {formatAmount(transaction.amount + transaction.fee)}
            </p>
          )}
        </div>
        {showDelete && onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(transaction.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default TransactionCard;
