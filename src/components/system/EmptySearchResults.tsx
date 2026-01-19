import { Search, SlidersHorizontal, MapPin, X, Calendar, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptySearchResultsProps {
  hasFilters?: boolean;
  locationQuery?: string;
  dateQuery?: string;
  onClearFilters?: () => void;
  onBrowseAll?: () => void;
  onChangeFilters?: () => void;
  onAdjustDateTime?: () => void;
  onBrowseNearby?: (location: string) => void;
  nearbyLocations?: string[];
  className?: string;
}

export function EmptySearchResults({
  hasFilters = false,
  locationQuery,
  dateQuery,
  onClearFilters,
  onBrowseAll,
  onChangeFilters,
  onAdjustDateTime,
  onBrowseNearby,
  nearbyLocations = ["Dubai Marina", "DIFC", "Downtown Dubai", "Business Bay", "JLT"],
  className,
}: EmptySearchResultsProps) {
  if (hasFilters) {
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
            <SlidersHorizontal className="w-16 h-16 text-muted-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <X className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No spaces found
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          This can happen when filters are too specific. Your search preferences are saved. Try adjusting your filters to see more options.
        </p>

        {/* Suggested Actions */}
        <div className="w-full max-w-md space-y-3 mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Suggested Actions
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onChangeFilters && (
              <Button
                variant="outline"
                onClick={onChangeFilters}
                className="justify-start gap-2 h-auto py-3"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Change Filters</div>
                  <div className="text-xs text-muted-foreground">Adjust your preferences</div>
                </div>
              </Button>
            )}
            
            {onAdjustDateTime && (
              <Button
                variant="outline"
                onClick={onAdjustDateTime}
                className="justify-start gap-2 h-auto py-3"
              >
                <Calendar className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">Adjust Date/Time</div>
                  <div className="text-xs text-muted-foreground">Try different times</div>
                </div>
              </Button>
            )}
          </div>
        </div>

        {/* Nearby Areas */}
        {onBrowseNearby && nearbyLocations.length > 0 && (
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
                  onClick={() => onBrowseNearby(location)}
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
          {onClearFilters && (
            <Button
              variant="default"
              onClick={onClearFilters}
              className="flex-1 gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Remove All Filters
            </Button>
          )}
          {onBrowseAll && (
            <Button
              variant="outline"
              onClick={onBrowseAll}
              className="flex-1 gap-2"
            >
              <MapPin className="w-4 h-4" />
              View All Spaces
            </Button>
          )}
        </div>
      </div>
    );
  }

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
          <Search className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No results found
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {locationQuery 
          ? `We couldn't find any spaces in "${locationQuery}". Try adjusting your search or browse nearby areas.`
          : "This can happen when searching for specific locations or terms. Your search preferences are saved. Try adjusting your search or browse all available spaces."}
      </p>

      {/* Suggested Actions */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Suggested Actions
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onChangeFilters && (
            <Button
              variant="outline"
              onClick={onChangeFilters}
              className="justify-start gap-2 h-auto py-3"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Change Filters</div>
                <div className="text-xs text-muted-foreground">Adjust preferences</div>
              </div>
            </Button>
          )}
          
          {onAdjustDateTime && (
            <Button
              variant="outline"
              onClick={onAdjustDateTime}
              className="justify-start gap-2 h-auto py-3"
            >
              <Calendar className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Adjust Date/Time</div>
                <div className="text-xs text-muted-foreground">Try different times</div>
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Nearby Areas */}
      {onBrowseNearby && nearbyLocations.length > 0 && (
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
                onClick={() => onBrowseNearby(location)}
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
        {onBrowseAll && (
          <Button
            variant="default"
            onClick={onBrowseAll}
            className="flex-1 gap-2"
          >
            <MapPin className="w-4 h-4" />
            Browse All Spaces
          </Button>
        )}
        {onChangeFilters && (
          <Button
            variant="outline"
            onClick={onChangeFilters}
            className="flex-1 gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Adjust Search
          </Button>
        )}
      </div>
    </div>
  );
}
