import { AlertCircle, Clock, CreditCard, Calendar, XCircle } from "lucide-react";
import { ErrorState } from "./ErrorState";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface BookingErrorProps {
  type: "unavailable" | "conflict" | "payment" | "expired" | "generic";
  onRetry?: () => void;
  onChooseAnother?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function BookingError({ type, onRetry, onChooseAnother, onGoHome, className }: BookingErrorProps) {
  const navigate = useNavigate();

  const errorConfigs = {
    unavailable: {
      icon: XCircle,
      title: "Space no longer available",
      description: "This can happen during high demand. Your booking details are saved. Try selecting a different time or explore similar spaces.",
      actionLabel: "Choose another time",
      variant: "destructive" as const,
      onAction: onChooseAnother || (() => navigate("/search")),
    },
    conflict: {
      icon: Calendar,
      title: "Time slot unavailable",
      description: "This time slot is already booked. Your booking details are saved. Try selecting a different date or time.",
      actionLabel: "Choose another time",
      variant: "warning" as const,
      onAction: onChooseAnother || (() => window.history.back()),
    },
    payment: {
      icon: CreditCard,
      title: "Payment couldn't be processed",
      description: "This can happen during high demand or network issues. No charges were made. Your booking details are saved.",
      actionLabel: "Try again",
      variant: "destructive" as const,
      onAction: onRetry,
    },
    expired: {
      icon: Clock,
      title: "Booking session expired",
      description: "Your booking session has expired for security. Your details are saved. Start a new booking to continue.",
      actionLabel: "Start new booking",
      variant: "warning" as const,
      onAction: onGoHome || (() => navigate("/search")),
    },
    generic: {
      icon: AlertCircle,
      title: "Something unexpected happened",
      description: "We encountered an issue processing your booking. Your booking details are saved. Please try again or contact support if this continues.",
      actionLabel: "Try again",
      variant: "destructive" as const,
      onAction: onRetry,
    },
  };

  const config = errorConfigs[type];

  return (
    <ErrorState
      icon={config.icon}
      title={config.title}
      description={config.description}
      actionLabel={config.actionLabel}
      onAction={config.onAction}
      variant={config.variant}
      className={className}
    />
  );
}
