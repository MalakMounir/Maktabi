import { AlertTriangle, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface PriceChangeAlertProps {
  oldPrice: number;
  newPrice: number;
  currency: string;
  onAccept?: () => void;
  onCancel?: () => void;
  onReviewPrice?: () => void;
  onContinueBooking?: () => void;
  className?: string;
}

export function PriceChangeAlert({
  oldPrice,
  newPrice,
  currency,
  onAccept,
  onCancel,
  onReviewPrice,
  onContinueBooking,
  className,
}: PriceChangeAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const priceDifference = newPrice - oldPrice;
  const isIncrease = priceDifference > 0;

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-warning/30 bg-warning/10 p-4 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-full bg-warning/20 p-2">
          <TrendingUp className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Price updated
              </h4>
              <p className="text-sm text-muted-foreground">
                This can happen during high demand. Your booking details are saved.
              </p>
            </div>
            {onCancel && (
              <button
                onClick={() => {
                  setDismissed(true);
                  onCancel?.();
                }}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-background/50 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Price comparison */}
          <div className="bg-background/50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Previous price:</span>
              <span className="line-through text-muted-foreground">
                {currency} {oldPrice}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">New price:</span>
              <span className="font-semibold text-foreground">
                {currency} {newPrice}
              </span>
            </div>
            {isIncrease && (
              <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>Price increased by {currency} {Math.abs(priceDifference)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onReviewPrice ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onReviewPrice}
                className="flex-1"
              >
                Review price
              </Button>
            ) : onAccept && (
              <Button
                variant="default"
                size="sm"
                onClick={onAccept}
                className="flex-1"
              >
                Review Updated Price
              </Button>
            )}
            {onContinueBooking ? (
              <Button
                variant="default"
                size="sm"
                onClick={onContinueBooking}
                className="flex-1"
              >
                Continue booking
              </Button>
            ) : onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDismissed(true);
                  onCancel();
                }}
                className="flex-1"
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
