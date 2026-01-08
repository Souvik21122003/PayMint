import React from "react";

export function LoadingSkeleton({ className = "", variant = "default" }) {
  const baseClass = "animate-shimmer rounded-lg";
  const variants = {
    default: "h-4 w-full",
    title: "h-6 w-3/4",
    card: "h-24 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
  };
  return <div className={`${baseClass} ${variants[variant]} ${className}`} />;
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-4">
        <LoadingSkeleton variant="avatar" className="rounded-xl" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
      </div>
      <LoadingSkeleton className="h-5 w-20" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl bg-primary/20 p-8">
        <LoadingSkeleton className="h-8 w-40 mb-4" />
        <LoadingSkeleton className="h-12 w-48" />
      </div>
      <div className="space-y-3">
        <LoadingSkeleton variant="title" />
        {[...Array(5)].map((_, i) => (
          <TransactionSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
