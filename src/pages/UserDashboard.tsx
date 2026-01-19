import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookings as initialBookings, Booking } from "@/data/mockData";
import { CancelBookingModal } from "@/components/booking/CancelBookingModal";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Heart,
  FileText,
  Settings,
  ChevronRight,
  Download,
  X,
  Star,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type TabType = "upcoming" | "past" | "favorites" | "invoices" | "profile";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const pastBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled" || b.status === "cancelled_by_host");

  // Calculate refund amount (full refund for demo purposes)
  const calculateRefund = (booking: Booking): number => {
    // In a real app, this would consider cancellation policy, timing, etc.
    // For now, return full amount
    return booking.totalPrice;
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedBooking) return;

    // Calculate refund
    const refundAmount = calculateRefund(selectedBooking);

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: "cancelled" as const } : b
      )
    );

    // Show success message
    toast({
      title: "Booking Cancelled",
      description: `Your booking has been cancelled. A refund of ${selectedBooking.currency} ${refundAmount.toFixed(2)} will be processed within 5-7 business days.`,
    });

    // Close modal and redirect to booking details
    setCancelModalOpen(false);
    navigate(`/bookings/${selectedBooking.id}?cancelled=true`);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "upcoming", label: "Upcoming", icon: <Calendar className="w-4 h-4" /> },
    { id: "past", label: "Past Bookings", icon: <Clock className="w-4 h-4" /> },
    { id: "favorites", label: "Favorites", icon: <Heart className="w-4 h-4" /> },
    { id: "invoices", label: "Invoices", icon: <FileText className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="bg-muted min-h-screen">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, Ahmed</h1>
                <p className="text-primary-foreground/80">ahmed@example.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="bg-card rounded-xl border border-border overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Upcoming Bookings */}
              {activeTab === "upcoming" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
                    <Link to="/search">
                      <Button variant="outline" size="sm">
                        Book New Space
                      </Button>
                    </Link>
                  </div>

                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-card rounded-xl border border-border overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            <img
                              src={booking.spaceImage}
                              alt={booking.spaceName}
                              className="w-full md:w-48 h-40 md:h-auto object-cover"
                            />
                            <div className="flex-1 p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <Badge className="bg-success/10 text-success border-success/20 mb-2">
                                    Confirmed
                                  </Badge>
                                  <h3 className="font-semibold text-lg">
                                    {booking.spaceName}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {booking.location}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {booking.id}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>
                                    {new Date(booking.date).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-primary" />
                                  <span>
                                    {booking.startTime} - {booking.endTime}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="font-semibold">
                                  {booking.currency} {booking.totalPrice}
                                </span>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleCancelClick(booking)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        No upcoming bookings
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Start exploring workspaces and book your next session
                      </p>
                      <Link to="/search">
                        <Button variant="cta">Find Workspaces</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Past Bookings */}
              {activeTab === "past" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Past Bookings</h2>

                  {pastBookings.length > 0 || cancelledBookings.length > 0 ? (
                    <div className="space-y-4">
                      {/* Completed Bookings */}
                      {pastBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-card rounded-xl border border-border p-5"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={booking.spaceImage}
                              alt={booking.spaceName}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{booking.spaceName}</h3>
                                <Badge variant="secondary">Completed</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(booking.date).toLocaleDateString()} •{" "}
                                {booking.startTime} - {booking.endTime}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className="font-medium">
                                  {booking.currency} {booking.totalPrice}
                                </span>
                                <Button variant="link" size="sm" className="gap-1 p-0">
                                  <Star className="w-4 h-4" />
                                  Leave Review
                                </Button>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Cancelled Bookings (including cancelled_by_host) */}
                      {cancelledBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-card rounded-xl border border-border p-5"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={booking.spaceImage}
                              alt={booking.spaceName}
                              className="w-20 h-20 rounded-lg object-cover opacity-60"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{booking.spaceName}</h3>
                                <Badge 
                                  className={
                                    booking.status === "cancelled_by_host"
                                      ? "bg-warning/10 text-warning border-warning/20"
                                      : "bg-destructive/10 text-destructive border-destructive/20"
                                  }
                                >
                                  {booking.status === "cancelled_by_host" 
                                    ? "Canceled by Host" 
                                    : "Cancelled"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(booking.date).toLocaleDateString()} •{" "}
                                {booking.startTime} - {booking.endTime}
                              </p>
                              {booking.status === "cancelled_by_host" && booking.cancellationReason && (
                                <div className="bg-muted rounded-lg p-3 mb-2">
                                  <p className="text-xs text-muted-foreground mb-1">Cancellation Reason:</p>
                                  <p className="text-sm text-foreground">{booking.cancellationReason}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium line-through text-muted-foreground">
                                    {booking.currency} {booking.totalPrice}
                                  </span>
                                  {booking.refundStatus && (
                                    <div className="flex items-center gap-2">
                                      {booking.refundStatus === "processed" ? (
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                      ) : (
                                        <Clock className="w-4 h-4 text-warning" />
                                      )}
                                      <Badge
                                        className={
                                          booking.refundStatus === "processed"
                                            ? "bg-success/10 text-success border-success/20"
                                            : "bg-warning/10 text-warning border-warning/20"
                                        }
                                      >
                                        Refund {booking.refundStatus === "processed" ? "Processed" : "Pending"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        No past bookings
                      </h3>
                      <p className="text-muted-foreground">
                        Your booking history will appear here
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites */}
              {activeTab === "favorites" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Favorite Spaces</h2>
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Save spaces you love by clicking the heart icon
                    </p>
                    <Link to="/search">
                      <Button variant="outline">Explore Spaces</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Invoices */}
              {activeTab === "invoices" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Invoices</h2>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Invoice
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Status
                          </th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bookings.map((booking) => {
                          const isCancelled = booking.status === "cancelled" || booking.status === "cancelled_by_host";
                          const invoiceStatus = isCancelled 
                            ? (booking.refundStatus === "processed" ? "Refunded" : "Refund Pending")
                            : "Paid";
                          const invoiceStatusColor = isCancelled
                            ? booking.refundStatus === "processed"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-warning/10 text-warning border-warning/20"
                            : "bg-success/10 text-success border-success/20";
                          
                          return (
                            <tr key={booking.id}>
                              <td className="px-6 py-4 text-sm font-mono">
                                INV-{booking.id}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {new Date(booking.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">
                                {booking.currency} {booking.totalPrice}
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={invoiceStatusColor}>
                                  {invoiceStatus}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <Download className="w-4 h-4" />
                                  PDF
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Ahmed"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Al-Hassan"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue="ahmed@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue="+971 50 123 4567"
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                        />
                      </div>
                      <Button variant="cta">Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {selectedBooking && (
        <CancelBookingModal
          open={cancelModalOpen}
          onOpenChange={setCancelModalOpen}
          bookingName={selectedBooking.spaceName}
          bookingDate={selectedBooking.date}
          refundAmount={calculateRefund(selectedBooking)}
          currency={selectedBooking.currency}
          onConfirm={handleCancelConfirm}
        />
      )}
    </Layout>
  );
};

export default UserDashboard;
