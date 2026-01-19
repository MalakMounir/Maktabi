import { AlertCircle, Calendar, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OverbookingErrorProps {
  spaceName?: string;
  selectedDate?: string;
  selectedTime?: string;
  onChooseAnotherTime?: () => void;
  onViewAlternatives?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export function OverbookingError({
  spaceName,
  selectedDate,
  selectedTime,
  onChooseAnotherTime,
  onViewAlternatives,
  onContactSupport,
  className,
}: OverbookingErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-warning/20 bg-warning/5 p-8 md:p-12 text-center",
        className
      )}
    >
      {/* Illustration */}
      <div className="mb-6 relative">
        <div className="w-32 h-32 rounded-full bg-warning/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-warning" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Booking conflict detected
      </h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        This can happen during high demand when multiple people book the same time. Your booking details are saved.
      </p>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        No charges were made. We're here to help you find an alternative.
      </p>

      {/* Selected Details */}
      {(selectedDate || selectedTime) && (
        <div className="bg-background/50 rounded-lg p-4 mb-6 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Your selected time:</span>
          </div>
          <div className="space-y-1">
            {selectedDate && (
              <p className="font-medium text-foreground">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {selectedTime && (
              <p className="font-medium text-foreground">{selectedTime}</p>
            )}
          </div>
        </div>
      )}

      {/* Reassurance */}
      <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg mb-6 w-full max-w-md">
        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground text-left">
          <strong>Your booking details are saved.</strong> No charges were made. You can choose another time or explore alternative spaces.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {onChooseAnotherTime && (
          <Button
            variant="default"
            onClick={onChooseAnotherTime}
            className="flex-1 gap-2"
          >
            <Calendar className="w-4 h-4" />
            Adjust time
          </Button>
        )}
        {onViewAlternatives && (
          <Button
            variant="outline"
            onClick={onViewAlternatives}
            className="flex-1 gap-2"
          >
            <MapPin className="w-4 h-4" />
            View similar spaces
          </Button>
        )}
      </div>

      {onContactSupport && (
        <button
          onClick={onContactSupport}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Need help? Contact support
        </button>
      )}
    </div>
  );
}
