import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { spaces, amenityLabels, spaceTypes } from "@/data/mockData";
import SpaceCard from "@/components/cards/SpaceCard";
import { FullyBookedState } from "@/components/system/FullyBookedState";
import { NoAvailabilityState } from "@/components/system/NoAvailabilityState";
import {
  Star,
  MapPin,
  Users,
  Clock,
  Heart,
  Share2,
  Play,
  Wifi,
  Coffee,
  Snowflake,
  Printer,
  Lock,
  Monitor,
  PenTool,
  Video,
  Car,
  UserCheck,
  DoorOpen,
  Presentation,
  Volume2,
  UtensilsCrossed,
  Layout as LayoutIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Calendar,
  Briefcase,
  Laptop,
  Users2,
  Sparkles,
} from "lucide-react";

const iconComponents: Record<string, React.ReactNode> = {
  Wifi: <Wifi className="w-5 h-5" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Snowflake: <Snowflake className="w-5 h-5" />,
  Printer: <Printer className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  DoorOpen: <DoorOpen className="w-5 h-5" />,
  Presentation: <Presentation className="w-5 h-5" />,
  Volume2: <Volume2 className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Layout: <LayoutIcon className="w-5 h-5" />,
};

function formatCurrency(currency: string, value: number) {
  return `${currency} ${value}`;
}

function makeMapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

type BookingWidgetProps = {
  currency: string;
  pricePerHour: number;
  providerName: string;
  isUnavailable: boolean;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  spaceName?: string;
  onSelectedDateChange: (value: string) => void;
  onSelectedTimeChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onBookNow: () => void;
};

function BookingWidget({
  currency,
  pricePerHour,
  providerName,
  isUnavailable,
  selectedDate,
  selectedTime,
  duration,
  spaceName,
  onSelectedDateChange,
  onSelectedTimeChange,
  onDurationChange,
  onBookNow,
}: BookingWidgetProps) {
  const totalPrice = pricePerHour * duration;
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  // Check if space is fully booked (unavailable)
  if (isUnavailable) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
        <FullyBookedState
          spaceName={spaceName}
          spaceLocation={space?.location}
          onViewNearby={() => {
            // Navigate to search with location filter
            const params = new URLSearchParams();
            if (space?.location) {
              params.set("location", space.location);
            }
            navigate(`/search?${params.toString()}`);
          }}
          onCheckOtherTimes={() => {
            // Reset date/time selection
            onSelectedDateChange("");
            onSelectedTimeChange("09:00");
          }}
          onBrowseAll={() => {
            navigate("/search");
          }}
          onBrowseNearbyLocation={(location) => {
            const params = new URLSearchParams();
            params.set("location", location);
            navigate(`/search?${params.toString()}`);
          }}
        />
      </div>
    );
  }

  // Check if date/time selected but unavailable for that specific time
  // This is a mock check - in real app, this would check availability API
  // For demo: unavailable if time is 12:00 or 13:00 (lunch hours)
  const isTimeUnavailable = useMemo(() => {
    if (!selectedDate || !selectedTime) return false;
    // Mock: certain times are unavailable
    return selectedTime === "12:00" || selectedTime === "13:00";
  }, [selectedDate, selectedTime]);

  if (isTimeUnavailable) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
        <NoAvailabilityState
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          spaceLocation={space?.location}
          onChangeDate={() => onSelectedDateChange("")}
          onChangeTime={() => onSelectedTimeChange("09:00")}
          onViewNearby={() => {
            const params = new URLSearchParams();
            if (space?.location) {
              params.set("location", space.location);
            }
            navigate(`/search?${params.toString()}`);
          }}
          onBrowseAll={() => {
            navigate("/search");
          }}
          onBrowseNearbyLocation={(location) => {
            const params = new URLSearchParams();
            params.set("location", location);
            navigate(`/search?${params.toString()}`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-foreground">
          {formatCurrency(currency, pricePerHour)}
        </span>
        <span className="text-muted-foreground">/ hour</span>
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background"
          />
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Start Time</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <select
            value={selectedTime}
            onChange={(e) => onSelectedTimeChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background appearance-none"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const hour = i + 8;
              return (
                <option key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                  {hour.toString().padStart(2, "0")}:00
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Duration (hours)</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onDurationChange(Math.max(1, duration - 1))}
            className="w-10 h-10 rounded-lg border border-input flex items-center justify-center hover:bg-muted"
            aria-label="Decrease duration"
          >
            -
          </button>
          <span className="flex-1 text-center text-lg font-semibold">
            {duration} {duration === 1 ? "hour" : "hours"}
          </span>
          <button
            onClick={() => onDurationChange(Math.min(12, duration + 1))}
            className="w-10 h-10 rounded-lg border border-input flex items-center justify-center hover:bg-muted"
            aria-label="Increase duration"
          >
            +
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(currency, pricePerHour)} × {duration} hours
          </span>
          <span>{formatCurrency(currency, totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee</span>
          <span>{formatCurrency(currency, serviceFee)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
          <span>Total</span>
          <span>{formatCurrency(currency, grandTotal)}</span>
        </div>
      </div>

      {/* Book Now Button */}
      <Button
        variant="hero"
        size="xl"
        className="w-full"
        onClick={onBookNow}
        disabled={isUnavailable || !selectedDate}
      >
        {isUnavailable ? "Not Available" : "Book Now"}
      </Button>

      <div className="text-center space-y-2 mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>Secure payment • 256-bit SSL encryption</span>
        </div>
        <p className="text-xs text-muted-foreground">You won't be charged until you confirm</p>
        <p className="text-xs text-muted-foreground">Your booking details are saved securely</p>
      </div>

      {/* Provider Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-1">Hosted by</p>
        <p className="font-medium">{providerName}</p>
      </div>
    </div>
  );
}

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [duration, setDuration] = useState(2);
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false);

  const space = spaces.find((s) => s.id === id);

  if (!space) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Space Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The workspace you're looking for doesn't exist.
          </p>
          <Link to="/search">
            <Button>Browse Workspaces</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const spaceTypeLabel = spaceTypes.find((t) => t.id === space.type)?.label;
  const similarSpaces = spaces
    .filter((s) => s.id !== space.id && s.type === space.type)
    .slice(0, 3);

  const totalPrice = space.price * duration;
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  const handleBookNow = () => {
    navigate(`/booking/${space.id}?date=${selectedDate}&time=${selectedTime}&duration=${duration}`);
  };

  // Mock multiple images using the same image
  const images = [space.image, space.image, space.image];
  const videoUrl = useMemo(() => {
    // Lightweight placeholder. Replace with real asset when available.
    return "";
  }, []);

  const reviews = [
    {
      name: "Ahmed Al-Hassan",
      rating: 5,
      date: "December 2023",
      comment: "Excellent workspace with great amenities. The WiFi was fast and the coffee was great!",
    },
    {
      name: "Sara Mohammed",
      rating: 4,
      date: "November 2023",
      comment: "Good location and professional environment. Would book again.",
    },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/search" className="text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{space.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-28 lg:pb-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-6 border border-border bg-muted">
              <div className="aspect-[16/9] relative">
                <img
                  src={images[currentImageIndex]}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                {!videoUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-3 py-2">
                    <Play className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Video tour</span>
                    <span className="text-xs text-muted-foreground">(coming soon)</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm px-3 py-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{space.location}</span>
                  </div>
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === currentImageIndex
                              ? "bg-card"
                              : "bg-card/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Space Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {spaceTypeLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    space.availability === "available"
                      ? "bg-success/10 text-success border-success/20"
                      : space.availability === "limited"
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }
                >
                  {space.availability === "available"
                    ? "Available Now"
                    : space.availability === "limited"
                    ? "Limited Slots"
                    : "Fully Booked"}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {space.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-lg">
                  <Star className="w-5 h-5 text-secondary fill-secondary" />
                  <span className="font-bold text-lg text-foreground">{space.rating}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {space.reviewCount} {space.reviewCount === 1 ? "verified review" : "verified reviews"}
                    </span>
                    <span className="text-xs text-muted-foreground">Trusted by users</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {space.location}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Up to {space.capacity} {space.capacity === 1 ? "person" : "people"}
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3">About this space</h2>
              <p className="text-muted-foreground leading-relaxed">
                {space.description}
              </p>
            </section>

            {/* Who this space is for */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Who this space is for</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Laptop className="w-5 h-5 text-primary" />
                    <p className="font-medium">Remote work & deep focus</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quiet zones, reliable WiFi, and comfortable seating for productive sessions.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <p className="font-medium">Client meetings</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional setting with amenities that help you present your best.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Users2 className="w-5 h-5 text-primary" />
                    <p className="font-medium">Small teams</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Space to collaborate, whiteboards/screens when available, and room to breathe.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="font-medium">Workdays that feel premium</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Clean, well-managed environment—ideal when you want an upgrade from home.
                  </p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {space.amenities.map((amenity) => {
                  const amenityData = amenityLabels[amenity];
                  if (!amenityData) return null;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                    >
                      <div className="text-primary">
                        {iconComponents[amenityData.icon] || <Check className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-medium">{amenityData.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Rules & Policies */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3">House rules & cancellation</h2>
              <div className="rounded-xl border border-border bg-card">
                <Accordion type="single" collapsible>
                  <AccordionItem value="rules" className="px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        <span>House rules</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {space.houseRules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cancellation" className="px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        <span className="font-medium">Cancellation policy</span>
                        <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/20 text-xs">
                          Flexible
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-success/5 border border-success/20 flex items-start gap-3">
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground mb-1">Free cancellation</p>
                            <p className="text-sm text-muted-foreground">{space.cancellationPolicy}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Cancel anytime before your booking starts for a full refund
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    Reviews
                  </h2>
                  <div className="flex items-center gap-1.5 bg-secondary/10 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-bold text-foreground">{space.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({space.reviewCount} {space.reviewCount === 1 ? "verified review" : "verified reviews"})
                    </span>
                  </div>
                </div>
                <Button variant="link" className="gap-1">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-secondary fill-secondary" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Preview */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Location</h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                  <div className="text-center px-4">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-foreground font-medium">{space.location}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Quick preview — open in Maps for directions.
                    </p>
                    <a
                      href={makeMapsUrl(space.location)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      Open in Google Maps
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Neighborhood: {space.location.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Capacity: up to {space.capacity}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Spaces */}
            {similarSpaces.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Similar Spaces</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {similarSpaces.map((s) => (
                    <SpaceCard key={s.id} space={s} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking Card - Sticky Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <BookingWidget
                currency={space.currency}
                pricePerHour={space.price}
                providerName={space.provider}
                isUnavailable={space.availability === "unavailable"}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                duration={duration}
                spaceName={space.name}
                onSelectedDateChange={setSelectedDate}
                onSelectedTimeChange={setSelectedTime}
                onDurationChange={setDuration}
                onBookNow={handleBookNow}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 pb-safe">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(space.currency, space.price)}{" "}
                <span className="text-muted-foreground font-normal">/ hour</span>
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedDate ? `${selectedDate} • ${selectedTime} • ${duration}h` : "Select a date to book"}
              </p>
            </div>
            <Button
              variant="hero"
              size="lg"
              className="shrink-0 min-w-[100px]"
              onClick={() => setMobileBookingOpen(true)}
              disabled={space.availability === "unavailable"}
            >
              Book
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Booking Drawer */}
      <Drawer open={mobileBookingOpen} onOpenChange={setMobileBookingOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>Book {space.name}</DrawerTitle>
            <DrawerDescription>
              Total today: <span className="font-medium text-foreground">{formatCurrency(space.currency, grandTotal)}</span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-auto">
            <BookingWidget
              currency={space.currency}
              pricePerHour={space.price}
              providerName={space.provider}
              isUnavailable={space.availability === "unavailable"}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              duration={duration}
              spaceName={space.name}
              onSelectedDateChange={setSelectedDate}
              onSelectedTimeChange={setSelectedTime}
              onDurationChange={setDuration}
              onBookNow={() => {
                setMobileBookingOpen(false);
                handleBookNow();
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default SpaceDetails;
