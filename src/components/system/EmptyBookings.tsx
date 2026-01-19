import { Calendar, Search } from "lucide-react";
import { ErrorState } from "./ErrorState";

export interface EmptyBookingsProps {
  type: "upcoming" | "past" | "all";
  onExplore?: () => void;
  className?: string;
}

export function EmptyBookings({ type, onExplore, className }: EmptyBookingsProps) {
  const configs = {
    upcoming: {
      icon: Calendar,
      title: "No upcoming bookings",
      description: "You don't have any upcoming bookings yet. Start exploring workspaces to find your perfect space.",
      actionLabel: "Explore workspaces",
    },
    past: {
      icon: Calendar,
      title: "No past bookings",
      description: "Your completed and cancelled bookings will appear here once you start booking workspaces.",
      actionLabel: "Explore workspaces",
    },
    all: {
      icon: Calendar,
      title: "No bookings yet",
      description: "You haven't made any bookings yet. Discover amazing workspaces and book your first space today.",
      actionLabel: "Explore workspaces",
    },
  };

  const config = configs[type];

  return (
    <ErrorState
      icon={config.icon}
      title={config.title}
      description={config.description}
      actionLabel={config.actionLabel}
      onAction={onExplore}
      variant="info"
      className={className}
    />
  );
}
