import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface UserNotificationPlaceholderProps {
  bookingId: string;
  message: string;
  reason?: string;
  refundAmount?: number;
  currency?: string;
  onDismiss?: () => void;
  className?: string;
}

export function UserNotificationPlaceholder({
  bookingId,
  message,
  reason,
  refundAmount,
  currency,
  onDismiss,
  className,
}: UserNotificationPlaceholderProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-warning/20 bg-warning/5 p-4 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-full bg-warning/20 p-2">
          <Bell className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">Booking Cancelled by Host</h4>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  New
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-background/50 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {reason && (
            <div className="bg-background/50 rounded-lg p-3 mb-2">
              <p className="text-xs text-muted-foreground mb-1">Cancellation Reason:</p>
              <p className="text-sm text-foreground">{reason}</p>
            </div>
          )}

          {refundAmount !== undefined && currency && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-2">
              <p className="text-xs text-muted-foreground mb-1">Refund Amount:</p>
              <p className="text-lg font-bold text-success">
                {currency} {refundAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Refund will be processed within 5-7 business days.
              </p>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              View Booking Details
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Contact Support
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Booking ID: {bookingId}
          </p>
        </div>
      </div>
    </div>
  );
}
