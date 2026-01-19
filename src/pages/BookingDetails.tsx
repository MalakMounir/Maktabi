import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookings as initialBookings, Booking } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Download,
  Share2,
  CheckCircle,
} from "lucide-react";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [bookings] = useState<Booking[]>(initialBookings);

  const booking = bookings.find((b) => b.id === bookingId);

  // Show success message if redirected from cancellation
  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
        variant: "default",
      });
      // Remove the query parameter
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, toast]);

  if (!booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Booking not found</h1>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = () => {
    switch (booking.status) {
      case "upcoming":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary">Completed</Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
                <p className="text-muted-foreground">Booking ID: {booking.id}</p>
              </div>
              {getStatusBadge()}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Space Image */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <img
                  src={booking.spaceImage}
                  alt={booking.spaceName}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Booking Information */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{booking.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Space Details */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Space Details</h2>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{booking.spaceName}</h3>
                  <p className="text-muted-foreground">
                    Duration: {booking.duration} {booking.duration === 1 ? "hour" : "hours"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Price Summary</h3>
                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {booking.currency} {booking.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                  <Button variant="ghost" size="lg" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetails;
