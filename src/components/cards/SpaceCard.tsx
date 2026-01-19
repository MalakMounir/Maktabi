import { Link } from "react-router-dom";
import { Star, MapPin, Users, Heart } from "lucide-react";
import { Space, spaceTypes } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { AvailabilityBadge } from "@/components/system/AvailabilityBadge";
import { useLocale } from "@/i18n/locale";

interface SpaceCardProps {
  space: Space;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
  const { t, locale } = useLocale();
  const spaceTypeLabel = spaceTypes.find((t) => t.id === space.type)?.label || space.type;

  return (
    <Link to={`/space/${space.id}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl">
      <div className="space-card h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={space.image}
            alt={space.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Favorite Button */}
          <button 
            className="absolute top-3 ltr:right-3 rtl:left-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:bg-card disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 text-foreground" />
          </button>

          {/* Availability Badge */}
          <div className="absolute top-3 ltr:left-3 rtl:right-3">
            <AvailabilityBadge status={space.availability as any} />
          </div>

          {/* Space Type */}
          <div className="absolute bottom-3 ltr:left-3 rtl:right-3">
            <Badge className="bg-primary/90 text-primary-foreground">
              {spaceTypeLabel}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {space.location}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {space.name}
          </h3>

          {/* Rating & Capacity */}
          <div className="flex items-center gap-3 text-sm mb-3">
            <div className="flex items-center gap-1.5 bg-secondary/10 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="font-semibold text-foreground">{space.rating}</span>
              <span className="text-muted-foreground text-xs">
                ({space.reviewCount} {space.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              {space.capacity} {space.capacity === 1 ? t("person") : t("people")}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">
              {space.currency} {space.price}
            </span>
            <span className="text-sm text-muted-foreground">{t("perHour")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SpaceCard;
