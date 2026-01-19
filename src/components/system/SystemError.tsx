import { AlertTriangle, WifiOff, ServerCrash, RefreshCw } from "lucide-react";
import { ErrorState } from "./ErrorState";
import { Button } from "@/components/ui/button";

export interface SystemErrorProps {
  type: "network" | "server" | "generic";
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function SystemError({ type, onRetry, onGoHome, className }: SystemErrorProps) {
  const errorConfigs = {
    network: {
      icon: WifiOff,
      title: "Connection problem",
      description: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
      actionLabel: "Retry",
      variant: "warning" as const,
    },
    server: {
      icon: ServerCrash,
      title: "Service temporarily unavailable",
      description: "Our servers are experiencing issues. We're working on it and should be back shortly. Please try again in a few moments.",
      actionLabel: "Retry",
      variant: "destructive" as const,
    },
    generic: {
      icon: AlertTriangle,
      title: "Something went wrong",
      description: "An unexpected error occurred. Our team has been notified. Please try again or contact support if the problem persists.",
      actionLabel: "Retry",
      variant: "destructive" as const,
    },
  };

  const config = errorConfigs[type];

  return (
    <ErrorState
      icon={config.icon}
      title={config.title}
      description={config.description}
      actionLabel={config.actionLabel}
      onAction={onRetry}
      variant={config.variant}
      className={className}
    />
  );
}
