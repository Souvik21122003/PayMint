import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There's nothing here yet.",
  actionLabel,
  actionPath,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (actionPath || onAction) && (
        actionPath ? (
          <Button asChild>
            <Link to={actionPath}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}

export function NoTransactionsState() {
  return (
    <EmptyState
      icon={Inbox}
      title="No transactions yet"
      description="Start by adding money to your wallet or making your first transfer."
      actionLabel="Add Money"
      actionPath="/add-money"
    />
  );
}

export function NoResultsState({ onReset }) {
  return (
    <EmptyState
      icon={Inbox}
      title="No matching transactions"
      description="Try adjusting your filters to find what you're looking for."
      actionLabel="Clear Filters"
      onAction={onReset}
    />
  );
}

export default EmptyState;
