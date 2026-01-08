import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { transactionApi } from "../services/api";
import { Layout } from "../components/Layout";
import { TransactionCard } from "../components/TransactionCard";
import { TransactionSkeleton } from "../components/LoadingSkeleton";
import { NoTransactionsState, NoResultsState } from "../components/EmptyState";
import { ConfirmDeleteModal } from "../components/ConfirmModal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import {
  ArrowLeft,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    fromDate: "",
    toDate: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transactionApi.getTransactions({
        ...filters,
        page,
        limit: 10,
      });
      setTransactions(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast({
        title: "Failed to load transactions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, page, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      fromDate: "",
      toDate: "",
    });
    setPage(1);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.type !== "all" ||
    filters.fromDate ||
    filters.toDate;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await transactionApi.deleteTransaction(deleteId);
      toast({ title: "Transaction deleted" });
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Failed to delete transaction",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
                Transaction History
              </h1>
              <p className="text-muted-foreground">{total} transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchTransactions}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  From Date
                </Label>
                <Input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    handleFilterChange("fromDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">To Date</Label>
                <Input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => <TransactionSkeleton key={i} />)
          ) : transactions?.length > 0 ? (
            <>
              {transactions?.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  showDelete={true}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : hasActiveFilters ? (
            <NoResultsState onReset={resetFilters} />
          ) : (
            <NoTransactionsState />
          )}
        </div>

        <ConfirmDeleteModal
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </Layout>
  );
}

export default Transactions;
