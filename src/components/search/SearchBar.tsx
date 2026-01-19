import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Building, Search } from "lucide-react";
import { spaceTypes } from "@/data/mockData";

interface SearchBarProps {
  variant?: "hero" | "compact";
  className?: string;
}

const SearchBar = ({ variant = "hero", className = "" }: SearchBarProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [spaceType, setSpaceType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (spaceType) params.set("type", spaceType);
    navigate(`/search?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <div className={`bg-card rounded-full shadow-lg border border-border p-2 flex items-center gap-2 ${className}`}>
        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Where?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2 px-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
        <Button variant="cta" size="icon" className="rounded-full" onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl shadow-xl p-3 md:p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0">
        {/* Location */}
        <div className="md:border-r border-border px-4 py-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Location
          </label>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="Dubai, UAE"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-foreground font-medium focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Date */}
        <div className="md:border-r border-border px-4 py-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 bg-transparent text-foreground font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Space Type */}
        <div className="md:border-r border-border px-4 py-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Space Type
          </label>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              className="flex-1 bg-transparent text-foreground font-medium focus:outline-none cursor-pointer"
            >
              <option value="">All Spaces</option>
              {spaceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-4 py-2 flex items-center">
          <Button
            variant="hero"
            size="lg"
            className="w-full gap-2"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
