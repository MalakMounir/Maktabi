import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import SpaceCard from "@/components/cards/SpaceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { spaces, spaceTypes, amenityLabels } from "@/data/mockData";
import { EmptySearchResults } from "@/components/system/EmptySearchResults";
import {
  Filter,
  Map,
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? [searchParams.get("type")!] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const locationQuery = searchParams.get("location") || "";
  const dateQuery = searchParams.get("date") || "";

  // Filter spaces
  const filteredSpaces = spaces.filter((space) => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(space.type)) return false;
    if (space.price < priceRange[0] || space.price > priceRange[1]) return false;
    if (locationQuery && !space.location.toLowerCase().includes(locationQuery.toLowerCase())) return false;
    return true;
  });

  // Sort spaces
  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((t) => t !== typeId)
        : [...prev, typeId]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setPriceRange([0, 2000]);
    setSelectedAmenities([]);
  };

  const hasActiveFilters = selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000;

  return (
    <Layout>
      {/* Search Header - Sticky on Mobile */}
      <div className="sticky top-0 z-30 bg-card border-b border-border py-4 md:py-4 md:relative md:z-auto">
        <div className="container mx-auto px-4">
          <SearchBar variant="compact" className="max-w-3xl mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Space Type */}
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-3">Space Type</h3>
                <div className="space-y-2">
                  {spaceTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => toggleType(type.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-3">Price Range (AED/hr)</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-full px-3 py-2 rounded-lg border border-input text-sm"
                    placeholder="Min"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full px-3 py-2 rounded-lg border border-input text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <h3 className="font-medium text-foreground mb-3">Capacity</h3>
                <select className="w-full px-3 py-2 rounded-lg border border-input text-sm bg-background">
                  <option>Any capacity</option>
                  <option>1-2 people</option>
                  <option>3-6 people</option>
                  <option>7-12 people</option>
                  <option>12+ people</option>
                </select>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Amenities</h3>
                <div className="space-y-2">
                  {["wifi", "coffee", "parking", "video_conf"].map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() =>
                          setSelectedAmenities((prev) =>
                            prev.includes(amenity)
                              ? prev.filter((a) => a !== amenity)
                              : [...prev, amenity]
                          )
                        }
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {amenityLabels[amenity]?.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {sortedSpaces.length} workspaces
                  {locationQuery && ` in "${locationQuery}"`}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Find your perfect workspace
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-1 bg-primary text-primary-foreground">
                      {selectedTypes.length}
                    </Badge>
                  )}
                </Button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 rounded-lg border border-input text-sm bg-card cursor-pointer"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-input rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Map Toggle */}
                <Button variant="outline" size="sm" className="gap-2">
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTypes.map((typeId) => (
                  <Badge
                    key={typeId}
                    variant="secondary"
                    className="gap-1 pl-3 cursor-pointer hover:bg-destructive/10"
                    onClick={() => toggleType(typeId)}
                  >
                    {spaceTypes.find((t) => t.id === typeId)?.label}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {sortedSpaces.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {sortedSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            ) : (
              <EmptySearchResults
                hasFilters={hasActiveFilters}
                locationQuery={locationQuery}
                dateQuery={dateQuery}
                onClearFilters={clearFilters}
                onBrowseAll={() => {
                  clearFilters();
                  navigate("/search");
                }}
                onChangeFilters={() => {
                  if (window.innerWidth < 1024) {
                    setShowFilters(true);
                  }
                  // Scroll to filters on desktop
                  document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                onAdjustDateTime={() => {
                  // Focus on search bar date input
                  const searchBar = document.querySelector('input[type="date"]');
                  if (searchBar) {
                    (searchBar as HTMLInputElement).focus();
                    (searchBar as HTMLInputElement).showPicker?.();
                  }
                }}
                onBrowseNearby={(location) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("location", location);
                  navigate(`/search?${params.toString()}`);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-card p-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Same filter content as sidebar */}
            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-3">Space Type</h3>
              <div className="space-y-2">
                {spaceTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => toggleType(type.id)}
                      className="w-4 h-4 rounded border-border text-primary"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button
                variant="cta"
                className="flex-1"
                onClick={() => setShowFilters(false)}
              >
                Show {sortedSpaces.length} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SearchResults;
