import { Calendar, Clock, MapPin, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NoAvailabilityStateProps {
  selectedDate?: string;
  selectedTime?: string;
  spaceLocation?: string;
  onChangeDate?: () => void;
  onChangeTime?: () => void;
  onViewNearby?: () => void;
  onBrowseAll?: () => void;
  nearbyLocations?: string[];
  onBrowseNearbyLocation?: (location: string) => void;
  className?: string;
}

export function NoAvailabilityState({
  selectedDate,
  selectedTime,
  spaceLocation,
  onChangeDate,
  onChangeTime,
  onViewNearby,
  onBrowseAll,
  nearbyLocations = ["Dubai Marina", "DIFC", "Downtown Dubai", "Business Bay", "JLT"],
  onBrowseNearbyLocation,
  className,
}: NoAvailabilityStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 md:p-12 text-center",
        className
      )}
    >
      {/* Illustration */}
      <div className="mb-6 relative">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
          <Calendar className="w-16 h-16 text-muted-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
          <Clock className="w-4 h-4 text-warning" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No spaces available at this time
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        This can happen during high demand. Your search preferences are saved. Try adjusting your date or time to find available options.
      </p>

      {/* Selected Details */}
      {(selectedDate || selectedTime) && (
        <div className="bg-muted rounded-lg p-4 mb-6 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>Selected:</span>
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
              <p className="font-medium text-foreground flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                {selectedTime}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Suggested Actions
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onChangeDate && (
            <Button
              variant="outline"
              onClick={onChangeDate}
              className="justify-start gap-2 h-auto py-3"
            >
              <Calendar className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Adjust Date</div>
                <div className="text-xs text-muted-foreground">Try different dates</div>
              </div>
            </Button>
          )}
          {onChangeTime && (
            <Button
              variant="outline"
              onClick={onChangeTime}
              className="justify-start gap-2 h-auto py-3"
            >
              <Clock className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Adjust Time</div>
                <div className="text-xs text-muted-foreground">Try different times</div>
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Nearby Areas */}
      {onBrowseNearbyLocation && nearbyLocations.length > 0 && (
        <div className="w-full max-w-md space-y-3 mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Browse Nearby Areas
          </p>
          <div className="flex flex-wrap gap-2">
            {nearbyLocations.map((location) => (
              <Button
                key={location}
                variant="ghost"
                size="sm"
                onClick={() => onBrowseNearbyLocation(location)}
                className="gap-2"
              >
                <Navigation className="w-3 h-3" />
                {location}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {onViewNearby && (
          <Button
            variant="default"
            onClick={onViewNearby}
            className="flex-1 gap-2"
          >
            <MapPin className="w-4 h-4" />
            View Nearby Spaces
          </Button>
        )}
        {onBrowseAll && (
          <Button
            variant="outline"
            onClick={onBrowseAll}
            className="flex-1 gap-2"
          >
            <Search className="w-4 h-4" />
            Browse All Spaces
          </Button>
        )}
      </div>
    </div>
  );
}
