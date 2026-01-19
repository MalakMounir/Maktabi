import { CalendarX, MapPin, Search, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FullyBookedStateProps {
  spaceName?: string;
  spaceLocation?: string;
  onViewNearby?: () => void;
  onCheckOtherTimes?: () => void;
  onBrowseAll?: () => void;
  nearbyLocations?: string[];
  onBrowseNearbyLocation?: (location: string) => void;
  className?: string;
}

export function FullyBookedState({
  spaceName,
  spaceLocation,
  onViewNearby,
  onCheckOtherTimes,
  onBrowseAll,
  nearbyLocations = ["Dubai Marina", "DIFC", "Downtown Dubai", "Business Bay", "JLT"],
  onBrowseNearbyLocation,
  className,
}: FullyBookedStateProps) {
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
          <CalendarX className="w-16 h-16 text-warning" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        This space is fully booked
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {spaceName
          ? `This can happen during high demand. ${spaceName} is currently fully booked. Your preferences are saved. Check other available times or explore similar spaces nearby.`
          : "This can happen during high demand. This workspace is currently fully booked. Your preferences are saved. Check other available times or explore similar spaces nearby."}
      </p>

      {/* Suggested Actions */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Suggested Actions
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onCheckOtherTimes && (
            <Button
              variant="outline"
              onClick={onCheckOtherTimes}
              className="justify-start gap-2 h-auto py-3"
            >
              <Clock className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Check Other Times</div>
                <div className="text-xs text-muted-foreground">Try different dates/times</div>
              </div>
            </Button>
          )}
          {onViewNearby && (
            <Button
              variant="outline"
              onClick={onViewNearby}
              className="justify-start gap-2 h-auto py-3"
            >
              <MapPin className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">View Nearby</div>
                <div className="text-xs text-muted-foreground">Similar spaces nearby</div>
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
        {onCheckOtherTimes && (
          <Button
            variant="default"
            onClick={onCheckOtherTimes}
            className="flex-1 gap-2"
          >
            <Clock className="w-4 h-4" />
            Check Other Times
          </Button>
        )}
        {onViewNearby && (
          <Button
            variant="outline"
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
