import { Link, useParams, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { spaces } from "@/data/mockData";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Download,
  Copy,
  Share2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  const spaceId = searchParams.get("spaceId");
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const duration = parseInt(searchParams.get("duration") || "2");

  const space = spaces.find((s) => s.id === spaceId);

  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!space) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Booking not found</h1>
        </div>
      </Layout>
    );
  }

  const subtotal = space.price * duration;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-4">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your workspace has been successfully booked
            </p>
          </div>

          {/* Booking Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6 animate-slide-up">
            {/* Image Header */}
            <div className="relative h-48">
              <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-semibold text-background">
                  {space.name}
                </h2>
                <p className="text-sm text-background/80 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {space.location}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6">
              {/* Booking ID */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono font-semibold">{bookingId}</p>
                </div>
                <button
                  onClick={handleCopyId}
                  className="p-2 rounded-lg hover:bg-background transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date</span>
                  </div>
                  <p className="font-semibold">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-semibold">
                    {time} - {parseInt(time) + duration}:00
                  </p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {space.currency} {space.price} × {duration} hours
                  </span>
                  <span>{space.currency} {subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>{space.currency} {serviceFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span>Total Paid</span>
                  <span>{space.currency} {total}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="default" size="lg" className="w-full gap-2">
                    View Booking
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your registered email address
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Arrive at the location 10 minutes before your booking time
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Show your booking confirmation at the reception
                </p>
              </li>
            </ul>
          </div>

          {/* Need Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <a href="#" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
