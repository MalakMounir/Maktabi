import { useState } from "react";
import { AlertTriangle, Star, X, Bell, MessageSquare, CheckCircle2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type CancellationReasonType = 
  | "provider_cancels" 
  | "emergency_unavailable" 
  | "space_temporarily_closed";

export interface CancellationReason {
  type: CancellationReasonType;
  label: string;
  description: string;
}

export const cancellationReasons: CancellationReason[] = [
  {
    type: "provider_cancels",
    label: "Provider cancels booking",
    description: "General cancellation by the provider"
  },
  {
    type: "emergency_unavailable",
    label: "Provider unavailable due to emergency",
    description: "Unexpected emergency situation prevents hosting"
  },
  {
    type: "space_temporarily_closed",
    label: "Space temporarily closed",
    description: "Space is temporarily unavailable for maintenance or other reasons"
  }
];

export interface ProviderCancelBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingName: string;
  bookingDate: string;
  refundAmount: number;
  currency: string;
  onConfirm: (reasonType: CancellationReasonType, additionalNotes?: string) => void;
}

export function ProviderCancelBookingModal({
  open,
  onOpenChange,
  bookingName,
  bookingDate,
  refundAmount,
  currency,
  onConfirm,
}: ProviderCancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancellationReasonType | "">("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [error, setError] = useState("");

  const getApologyMessage = (reasonType: CancellationReasonType): string => {
    const reason = cancellationReasons.find(r => r.type === reasonType);
    return `We sincerely apologize for the inconvenience. Unfortunately, we need to cancel your booking for ${bookingName} on ${new Date(bookingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} due to: ${reason?.label.toLowerCase() || "unforeseen circumstances"}. A full refund of ${currency} ${refundAmount.toFixed(2)} will be automatically processed to your original payment method within 5-7 business days. We hope to serve you in the future.`;
  };

  const handleConfirm = () => {
    if (!selectedReason) {
      setError("Please select a cancellation reason");
      return;
    }
    onConfirm(selectedReason as CancellationReasonType, additionalNotes.trim() || undefined);
    setSelectedReason("");
    setAdditionalNotes("");
    setError("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedReason("");
    setAdditionalNotes("");
    setError("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <AlertDialogTitle className="text-xl">
              Cancel Booking as Host?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-4 pt-2">
            {/* Rating Impact Warning */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-warning mb-1">
                    Canceling this booking may affect your rating.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cancelling bookings can negatively impact your provider rating. 
                    Frequent cancellations may result in lower visibility in search results 
                    and reduced booking requests.
                  </p>
                </div>
              </div>
            </div>

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

            {/* Automatic Refund Indicator */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-success mb-1">Automatic Refund</p>
                  <p className="text-2xl font-bold text-success mb-2">
                    {currency} {refundAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This amount will be automatically refunded to the guest within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellation Reason Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Cancellation Reason <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={(value) => {
                  setSelectedReason(value as CancellationReasonType);
                  setError("");
                }}
                className="space-y-3"
              >
                {cancellationReasons.map((reason) => (
                  <div
                    key={reason.type}
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      selectedReason === reason.type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={reason.type}
                      id={reason.type}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={reason.type}
                        className="font-medium cursor-pointer"
                      >
                        {reason.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
            </div>

            {/* Additional Notes (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-sm font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="additionalNotes"
                placeholder="Add any additional context or details about the cancellation..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                These notes will be included in the notification sent to the guest.
              </p>
            </div>

            {/* Notification Preview */}
            {selectedReason && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Notification to Affected User (Preview)</p>
                </div>
                <div className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">System-generated message:</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {getApologyMessage(selectedReason as CancellationReasonType)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  The guest will receive this notification via email and in-app notification.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleCancel} className="w-full sm:w-auto">
            Go Back
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedReason}
            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Cancellation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
