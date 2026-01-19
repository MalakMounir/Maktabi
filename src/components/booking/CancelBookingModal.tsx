import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface CancelBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingName: string;
  bookingDate: string;
  refundAmount: number;
  currency: string;
  onConfirm: () => void;
}

export function CancelBookingModal({
  open,
  onOpenChange,
  bookingName,
  bookingDate,
  refundAmount,
  currency,
  onConfirm,
}: CancelBookingModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <AlertDialogTitle className="text-xl">
              Cancel Booking?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            {/* Booking Details */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Booking</p>
                <p className="font-medium text-foreground">{bookingName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-medium text-foreground">
                  {new Date(bookingDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Refund Amount */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Refund Amount
              </p>
              <p className="text-2xl font-bold text-success">
                {currency} {refundAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This amount will be refunded to your original payment method within 5-7 business days.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Keep Booking
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
