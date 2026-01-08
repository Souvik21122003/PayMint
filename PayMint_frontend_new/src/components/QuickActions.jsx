import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowRightLeft, History } from "lucide-react";

const actions = [
  {
    path: "/add-money",
    icon: PlusCircle,
    label: "Add Money",
    description: "Top up your wallet",
    color: "bg-success/10 text-success hover:bg-success/20",
  },
  {
    path: "/transfer",
    icon: ArrowRightLeft,
    label: "Transfer",
    description: "Send to others",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    path: "/transactions",
    icon: History,
    label: "History",
    description: "View all transactions",
    color: "bg-accent/10 text-accent hover:bg-accent/20",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.path}
            to={action.path}
            className={`flex flex-col items-center p-4 sm:p-6 rounded-xl transition-all duration-200 ${action.color} group`}
          >
            <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <span className="font-medium text-foreground text-sm sm:text-base">
              {action.label}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block mt-1">
              {action.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default QuickActions;
