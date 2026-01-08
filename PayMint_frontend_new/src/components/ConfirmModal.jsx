import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { ArrowRightLeft, AlertTriangle, Check } from "lucide-react";

export function ConfirmTransferModal({
  open,
  onOpenChange,
  onConfirm,
  recipient,
  amount,
  fee,
  total,
  loading,
}) {
  const formatAmount = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ArrowRightLeft className="w-7 h-7 text-primary" />
          </div>
          <AlertDialogTitle className="text-center">
            Confirm Transfer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please review the transfer details below
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium text-foreground">
                {recipient?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-foreground">
                {formatAmount(amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fee (2%)</span>
              <span className="font-medium text-foreground">
                {formatAmount(fee)}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatAmount(total)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground bg-warning/10 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p>
              This action cannot be undone. The funds will be transferred
              immediately.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Confirm Transfer
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ConfirmDeleteModal({ open, onOpenChange, onConfirm, loading }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center">
            Delete Transaction
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmTransferModal;
