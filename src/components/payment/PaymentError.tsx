import { AlertCircle, Clock, CreditCard, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaymentErrorType = "failed" | "timeout";

export interface PaymentErrorProps {
  type: PaymentErrorType;
  onRetry?: () => void;
  onCancel?: () => void;
  onChangePaymentMethod?: () => void;
  className?: string;
}

export function PaymentError({ type, onRetry, onCancel, onChangePaymentMethod, className }: PaymentErrorProps) {
  const config = {
    failed: {
      icon: XCircle,
      title: "Payment couldn't be processed",
      description: "This can happen during high demand or network issues. No charges were made.",
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/20",
    },
    timeout: {
      icon: Clock,
      title: "Payment is taking longer than usual",
      description: "This can happen during high demand. No charges were made. Your booking details are saved.",
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
    },
  };

  const errorConfig = config[type];
  const Icon = errorConfig.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        errorConfig.bgColor,
        errorConfig.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 rounded-full p-3", errorConfig.bgColor)}>
          <Icon className={cn("h-6 w-6", errorConfig.iconColor)} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{errorConfig.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{errorConfig.description}</p>
          
          {/* Reassurance message */}
          <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>No charges were made.</strong> Your payment method was not charged.
              </p>
              <p>
                <strong>Your booking details are safe.</strong> All your selected information (date, time, space) is preserved. 
                No booking was created. You can safely retry your payment or choose a different payment method.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                variant="default"
                size="lg"
                onClick={onRetry}
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry payment
              </Button>
            )}
            {onChangePaymentMethod && (
              <Button
                variant="outline"
                size="lg"
                onClick={onChangePaymentMethod}
                className="flex-1 gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Change payment method
              </Button>
            )}
            {onCancel && (
              <Button
                variant="ghost"
                size="lg"
                onClick={onCancel}
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
