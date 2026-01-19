import { AlertCircle, Clock, Calendar, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export type ConflictType = "full" | "partial" | "unavailable";

export interface TimeConflictWarningProps {
  conflictType: ConflictType;
  message?: string;
  selectedDate: string;
  selectedTime: string;
  selectedDuration: number;
  availableSlots?: Array<{ start: string; end: string }>;
  onAdjustTime: () => void;
  onSelectAnotherDate: () => void;
  onBrowseAlternatives: () => void;
  className?: string;
  variant?: "banner" | "modal";
}

export function TimeConflictWarning({
  conflictType,
  message,
  selectedDate,
  selectedTime,
  selectedDuration,
  availableSlots = [],
  onAdjustTime,
  onSelectAnotherDate,
  onBrowseAlternatives,
  className,
  variant = "banner",
}: TimeConflictWarningProps) {
  const getConflictMessage = () => {
    if (message) return message;
    
    switch (conflictType) {
      case "full":
        return "This space was just booked for your selected time.";
      case "partial":
        return "This space was just booked for part of your selected time.";
      case "unavailable":
        return "This time slot is no longer available.";
      default:
        return "This space was just booked for part of your selected time.";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const calculateEndTime = (startTime: string, durationHours: number) => {
    const [hh, mm] = startTime.split(":").map((v) => parseInt(v, 10));
    const totalMinutes = hh * 60 + (mm || 0) + durationHours * 60;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
  };

  const endTime = calculateEndTime(selectedTime, selectedDuration);

  if (variant === "modal") {
    return (
      <div className={cn("rounded-2xl border border-warning/20 bg-warning/5 p-6", className)}>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-foreground">Time conflict detected</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{getConflictMessage()}</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Your selection</span>
          </div>
          <p className="font-medium text-foreground">
            {formatDate(selectedDate)} • {formatTime(selectedTime)} - {formatTime(endTime)}
          </p>
        </div>

        {availableSlots.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-foreground">Available time slots today:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSlots.slice(0, 6).map((slot, idx) => (
                <button
                  key={idx}
                  onClick={onAdjustTime}
                  className="text-sm px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary transition-colors text-center"
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button variant="cta" size="lg" className="w-full" onClick={onAdjustTime}>
            <Clock className="w-4 h-4 mr-2" />
            Change time
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" onClick={onSelectAnotherDate}>
              <Calendar className="w-4 h-4 mr-2" />
              Another date
            </Button>
            <Button variant="outline" size="lg" onClick={onBrowseAlternatives}>
              <Search className="w-4 h-4 mr-2" />
              Similar spaces
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <Alert variant="default" className={cn("border-warning/30 bg-warning/5 rounded-xl", className)}>
      <AlertCircle className="h-5 w-5 text-warning" />
      <AlertTitle className="text-base font-semibold text-foreground mb-1">
        Time conflict detected
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground mb-4">
        {getConflictMessage()} Your selection: {formatDate(selectedDate)} • {formatTime(selectedTime)} - {formatTime(endTime)}
      </AlertDescription>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button variant="cta" size="lg" onClick={onAdjustTime} className="flex-1">
          <Clock className="w-4 h-4 mr-2" />
          Change time
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={onSelectAnotherDate}>
            <Calendar className="w-4 h-4 mr-2" />
            Another date
          </Button>
          <Button variant="outline" size="lg" onClick={onBrowseAlternatives}>
            <Search className="w-4 h-4 mr-2" />
            Browse alternatives
          </Button>
        </div>
      </div>
    </Alert>
  );
}
