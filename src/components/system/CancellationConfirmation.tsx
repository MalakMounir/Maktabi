import { CheckCircle, Calendar, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CancellationConfirmationProps {
  bookingId?: string;
  bookingDate?: string;
  bookingTime?: string;
  refundAmount?: number;
  currency?: string;
  refundTimeline?: string;
  onViewBookings?: () => void;
  onBookAgain?: () => void;
  className?: string;
}

export function CancellationConfirmation({
  bookingId,
  bookingDate,
  bookingTime,
  refundAmount,
  currency = "AED",
  refundTimeline = "5-7 business days",
  onViewBookings,
  onBookAgain,
  className,
}: CancellationConfirmationProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 md:p-12 text-center",
        className
      )}
    >
      {/* Illustration */}
      <div className="mb-6 relative">
        <div className="w-32 h-32 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Booking cancelled successfully
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        Your booking has been cancelled. Your refund is being processed.
      </p>

      {/* Booking Details */}
      {(bookingDate || bookingTime || bookingId) && (
        <div className="bg-muted rounded-lg p-4 mb-6 w-full max-w-sm">
          <div className="space-y-2 text-sm">
            {bookingId && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>Booking ID: {bookingId}</span>
              </div>
            )}
            {bookingDate && (
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {new Date(bookingDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {bookingTime && (
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{bookingTime}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refund Information */}
      {refundAmount !== undefined && (
        <div className="bg-background/50 rounded-lg p-4 mb-6 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Refund information</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Refund amount:</span>
              <span className="font-semibold text-foreground">
                {currency} {refundAmount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your refund will be processed within {refundTimeline}. You'll receive a confirmation email once it's complete.
            </p>
          </div>
        </div>
      )}

      {/* Reassurance */}
      <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg mb-6 w-full max-w-md">
        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground text-left">
          <strong>No charges were made</strong> for the cancelled booking. Your refund is being processed automatically.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {onViewBookings && (
          <Button
            variant="default"
            onClick={onViewBookings}
            className="flex-1"
          >
            View My Bookings
          </Button>
        )}
        {onBookAgain && (
          <Button
            variant="outline"
            onClick={onBookAgain}
            className="flex-1"
          >
            Book Again
          </Button>
        )}
      </div>
    </div>
  );
}
