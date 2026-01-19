import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookings as initialBookings, spaces, Booking } from "@/data/mockData";
import { 
  ProviderCancelBookingModal, 
  CancellationReasonType,
  cancellationReasons 
} from "@/components/booking/ProviderCancelBookingModal";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";
import {
  AlertTriangle,
  Brain,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  User,
  Bell,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type BookingStatus = "upcoming" | "completed" | "cancelled" | "cancelled_by_host";
type BookingAction = "approve" | "decline" | "message" | "view";

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const label = 
    status === "upcoming" ? "Upcoming" 
    : status === "completed" ? "Completed" 
    : status === "cancelled_by_host" ? "Canceled by host"
    : "Cancelled";
  const className =
    status === "upcoming"
      ? "bg-primary/10 text-primary border-primary/20"
      : status === "completed"
        ? "bg-success/10 text-success border-success/20"
        : status === "cancelled_by_host"
          ? "bg-warning/10 text-warning border-warning/20"
          : "bg-destructive/10 text-destructive border-destructive/20";

  return (
    <Badge variant="outline" className={`${className} border`}>
      {label}
    </Badge>
  );
}

function formatCurrencyAmount(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString()}`;
}

function formatShortDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ProviderDashboard = () => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  // Mock: "my spaces" = first 3 spaces.
  const mySpaces = useMemo(() => spaces.slice(0, 3), []);
  const mySpaceIds = useMemo(() => new Set(mySpaces.map((s) => s.id)), [mySpaces]);

  const myBookings = useMemo(() => bookings.filter((b) => mySpaceIds.has(b.spaceId)), [bookings, mySpaceIds]);
  const upcomingBookings = useMemo(
    () =>
      myBookings
        .filter((b) => b.status === "upcoming")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [myBookings],
  );

  const completedBookings = useMemo(
    () => myBookings.filter((b) => b.status === "completed"),
    [myBookings],
  );

  const earnings = useMemo(() => completedBookings.reduce((sum, b) => sum + b.totalPrice, 0), [completedBookings]);

  const occupancyRate = useMemo(() => {
    // Placeholder logic: upcoming hours scheduled / (spaces * 40h week).
    const upcomingHours = upcomingBookings.reduce((sum, b) => sum + (b.duration ?? 0), 0);
    const capacityHours = Math.max(1, mySpaces.length) * 40;
    return Math.min(99, Math.round((upcomingHours / capacityHours) * 100));
  }, [upcomingBookings, mySpaces.length]);

  const lowAvailabilitySpaces = useMemo(
    () => mySpaces.filter((s) => s.availability !== "available"),
    [mySpaces],
  );

  const alertNewBookingsCount = useMemo(() => upcomingBookings.length, [upcomingBookings.length]);
  const alertLowAvailabilityCount = useMemo(() => lowAvailabilitySpaces.length, [lowAvailabilitySpaces.length]);

  const calendarBookingDates = useMemo(() => {
    const set = new Set<string>();
    for (const b of myBookings) set.add(new Date(b.date).toDateString());
    return set;
  }, [myBookings]);

  const modifiers = useMemo(
    () => ({
      hasBooking: (date: Date) => calendarBookingDates.has(date.toDateString()),
    }),
    [calendarBookingDates],
  );

  const modifierClassNames = useMemo(
    () => ({
      hasBooking: "bg-primary/10 text-primary font-semibold",
    }),
    [],
  );

  const reviews = useMemo(
    () => [
      {
        id: "RV-101",
        spaceId: mySpaces[0]?.id ?? "1",
        spaceName: mySpaces[0]?.name ?? "Workspace",
        rating: 5,
        author: "Sarah K.",
        date: "2024-01-08",
        comment: "Great location and super smooth check-in. WiFi was fast and the desk area was quiet.",
        sentiment: "positive" as const,
      },
      {
        id: "RV-102",
        spaceId: mySpaces[1]?.id ?? "2",
        spaceName: mySpaces[1]?.name ?? "Workspace",
        rating: 4,
        author: "Omar A.",
        date: "2024-01-02",
        comment: "Nice room and screen setup. Would love slightly better soundproofing for calls.",
        sentiment: "neutral" as const,
      },
    ],
    [mySpaces],
  );

  const pendingBookingActions = useMemo(
    () =>
      upcomingBookings.slice(0, 6).map((b) => ({
        booking: b,
        suggestedAction: ("approve" as BookingAction),
      })),
    [upcomingBookings],
  );

  // Calculate refund amount (full refund for demo purposes)
  const calculateRefund = (booking: Booking): number => {
    return booking.totalPrice;
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reasonType: CancellationReasonType, additionalNotes?: string) => {
    if (!selectedBooking) return;

    // Calculate refund
    const refundAmount = calculateRefund(selectedBooking);

    // Get reason label
    const reason = cancellationReasons.find(r => r.type === reasonType);
    const reasonLabel = reason?.label || "Provider cancellation";
    const fullReason = additionalNotes 
      ? `${reasonLabel}. ${additionalNotes}`
      : reasonLabel;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: "cancelled_by_host" as const,
              refundStatus: "pending" as const,
              cancellationReason: fullReason,
            }
          : b
      )
    );

    // Show success message
    toast({
      title: "Booking Cancelled",
      description: `Booking has been cancelled. Status changed to "Canceled by host". Refund of ${selectedBooking.currency} ${refundAmount.toFixed(2)} will be processed.`,
    });

    // Trigger user notification (UI placeholder)
    notificationService.triggerNotification({
      type: "booking_cancelled_by_host",
      title: "Booking Cancelled by Host",
      message: `Your booking for ${selectedBooking.spaceName} on ${new Date(selectedBooking.date).toLocaleDateString()} has been cancelled by the host. A refund of ${selectedBooking.currency} ${refundAmount.toFixed(2)} will be processed.`,
      bookingId: selectedBooking.id,
      metadata: {
        reason: fullReason,
        reasonType: reasonType,
        refundAmount: refundAmount,
        currency: selectedBooking.currency,
        spaceName: selectedBooking.spaceName,
        bookingDate: selectedBooking.date,
      },
    });

    // Simulate refund processing after 3 seconds (for demo purposes)
    // In production, this would be handled by a payment processor webhook
    setTimeout(() => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id && b.refundStatus === "pending"
            ? { ...b, refundStatus: "processed" as const }
            : b
        )
      );
      toast({
        title: "Refund Processed",
        description: `Refund of ${selectedBooking.currency} ${refundAmount.toFixed(2)} has been processed.`,
      });
    }, 3000);

    // Close modal
    setCancelModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Provider Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage spaces, bookings, and guest reviews.</p>
                </div>
              </div>
              <Button asChild variant="cta" className="w-full gap-2 sm:w-auto">
                <Link to="/provider/spaces/new">
                  <Plus className="h-4 w-4" />
                  Add new space
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* KPIs + Alerts + Insights */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-9">
              {/* Earnings KPI */}
              <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold tracking-tight">{formatCurrencyAmount("AED", earnings)}</div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>From completed bookings</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <DollarSign className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Occupancy Rate KPI */}
              <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Occupancy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold tracking-tight">{occupancyRate}%</div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Next 7 days estimate</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bookings KPI */}
              <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold tracking-tight">{upcomingBookings.length}</div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Requires attention</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:col-span-3">
              {/* Alerts Card */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-warning" />
                      Alerts
                    </span>
                    {(alertNewBookingsCount + alertLowAvailabilityCount) > 0 && (
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        {alertNewBookingsCount + alertLowAvailabilityCount}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {alertNewBookingsCount > 0 && (
                    <div className="group flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">New Bookings</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Need review/response</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 font-semibold">
                        {alertNewBookingsCount}
                      </Badge>
                    </div>
                  )}
                  {alertLowAvailabilityCount > 0 && (
                    <div className="group flex items-center justify-between rounded-xl border border-warning/20 bg-warning/5 px-4 py-3 transition-colors hover:bg-warning/10">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Low Availability</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Consider opening more slots</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-warning/30 text-warning bg-warning/10 font-semibold">
                        {alertLowAvailabilityCount}
                      </Badge>
                    </div>
                  )}
                  {(alertNewBookingsCount + alertLowAvailabilityCount) === 0 && (
                    <div className="flex items-center justify-center rounded-xl border border-border bg-muted/50 px-4 py-6">
                      <div className="text-center">
                        <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                        <div className="text-sm font-medium">All clear!</div>
                        <div className="text-xs text-muted-foreground mt-1">No alerts at this time</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Insights Card (AI-ready placeholder) */}
              <Card className="rounded-2xl border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="space-y-3">
                    <div className="rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20 px-3 py-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Performance Tip</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Your spaces are performing well. Consider optimizing pricing during peak hours to maximize revenue.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20 px-3 py-3">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-foreground mb-1">Trend Analysis</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Review sentiment is positive. Keep up the great service quality!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-primary/20">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>AI-ready: Connect to analytics + LLM for real-time insights</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main sections */}
          <div className="mt-6">
            <Tabs defaultValue="spaces">
              <TabsList className="w-full justify-start gap-1 rounded-2xl bg-card p-1 shadow-sm">
                <TabsTrigger value="spaces" className="rounded-xl gap-2">
                  <Building2 className="h-4 w-4" />
                  My spaces
                </TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-xl gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="bookings" className="rounded-xl gap-2">
                  <Clock className="h-4 w-4" />
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl gap-2">
                  <Star className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* My spaces list */}
              <TabsContent value="spaces" className="mt-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Card className="rounded-2xl lg:col-span-2 overflow-hidden border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">My Spaces</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {mySpaces.length} {mySpaces.length === 1 ? "space" : "spaces"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-4">
                        {mySpaces.map((space) => (
                          <div
                            key={space.id}
                            className="group flex flex-col gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center"
                          >
                            <div className="relative overflow-hidden rounded-lg sm:h-20 sm:w-28">
                              <img
                                src={space.image}
                                alt={space.name}
                                className="h-32 w-full object-cover transition-transform group-hover:scale-105 sm:h-20 sm:w-28"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-base truncate">{space.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">{space.location}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    space.availability === "available"
                                      ? "border-success/30 text-success bg-success/10"
                                      : space.availability === "limited"
                                        ? "border-warning/30 text-warning bg-warning/10"
                                        : "border-destructive/30 text-destructive bg-destructive/10"
                                  }
                                >
                                  {space.availability}
                                </Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1 text-foreground">
                                  <Star className="h-4 w-4 text-secondary fill-secondary" />
                                  <span className="font-medium">{space.rating}</span>
                                  <span className="text-muted-foreground">({space.reviewCount})</span>
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="font-semibold text-foreground">
                                  {space.currency} {space.price.toLocaleString()}/hr
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 sm:flex-col sm:gap-2">
                              <Button asChild size="sm" variant="outline" className="flex-1 sm:flex-none">
                                <Link to={`/space/${space.id}`}>View</Link>
                              </Button>
                              <Button asChild size="sm" variant="ghost" className="flex-1 sm:flex-none">
                                <Link to={`/provider/spaces/${space.id}/edit`}>Edit</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-2">
                        <Button asChild variant="default" className="justify-start gap-2 w-full">
                          <Link to="/provider/spaces/new">
                            <Plus className="h-4 w-4" />
                            Add a new space
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-start gap-2 w-full">
                          <CalendarIcon className="h-4 w-4" />
                          Block dates
                        </Button>
                        <Button variant="outline" className="justify-start gap-2 w-full">
                          <TrendingUp className="h-4 w-4" />
                          Pricing insights
                        </Button>
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium mb-1">Quick Stats</div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Total spaces:</span>
                                <span className="font-medium">{mySpaces.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active bookings:</span>
                                <span className="font-medium">{upcomingBookings.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Calendar view */}
              <TabsContent value="calendar" className="mt-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <Card className="rounded-2xl lg:col-span-7 border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold">Calendar View</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                        modifiers={modifiers}
                        modifiersClassNames={modifierClassNames}
                        className="rounded-lg"
                      />
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-3 w-3 rounded-full bg-primary/20 border border-primary/30"></div>
                        <span>Dates with bookings are highlighted</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl lg:col-span-5 border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold">
                        Schedule for {selectedDay ? selectedDay.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Selected Day"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        {selectedDay ? (
                          (() => {
                            const dayBookings = upcomingBookings.filter(
                              (b) => new Date(b.date).toDateString() === selectedDay.toDateString()
                            );
                            return dayBookings.length > 0 ? (
                              dayBookings.map((b) => (
                                <div key={b.id} className="group rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate">{b.spaceName}</div>
                                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{b.startTime}–{b.endTime}</span>
                                        <span>•</span>
                                        <span>{b.duration}h</span>
                                      </div>
                                    </div>
                                    <BookingStatusBadge status={b.status} />
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" className="text-xs">
                                      View Details
                                    </Button>
                                    <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      Message
                                    </Button>
                                    {b.status === "upcoming" && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleCancelClick(b)}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
                                <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <div className="text-sm font-medium text-foreground">No bookings</div>
                                <div className="text-xs text-muted-foreground mt-1">No bookings scheduled for this day</div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
                            <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <div className="text-sm font-medium text-foreground">Select a date</div>
                            <div className="text-xs text-muted-foreground mt-1">Choose a date from the calendar to view bookings</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Bookings management */}
              <TabsContent value="bookings" className="mt-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <Card className="rounded-2xl lg:col-span-8 border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Bookings Management</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {myBookings.length} {myBookings.length === 1 ? "booking" : "bookings"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="font-semibold">Booking ID</TableHead>
                              <TableHead className="font-semibold">Space</TableHead>
                              <TableHead className="font-semibold">Date</TableHead>
                              <TableHead className="font-semibold">Status</TableHead>
                              <TableHead className="text-right font-semibold">Total</TableHead>
                              <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {myBookings.length > 0 ? (
                              myBookings.map((b) => (
                                <TableRow key={b.id} className="hover:bg-muted/50">
                                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                                  <TableCell>
                                    <div className="font-medium text-sm">{b.spaceName}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{b.startTime}–{b.endTime}</div>
                                  </TableCell>
                                  <TableCell className="text-sm">{formatShortDate(b.date)}</TableCell>
                                  <TableCell>
                                    <BookingStatusBadge status={b.status} />
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="font-semibold text-sm">
                                        {formatCurrencyAmount(b.currency, b.totalPrice)}
                                      </span>
                                      {b.status === "cancelled_by_host" && b.refundStatus && (
                                        <Badge
                                          variant="outline"
                                          className={
                                            b.refundStatus === "processed"
                                              ? "bg-success/10 text-success border-success/20 text-xs"
                                              : "bg-warning/10 text-warning border-warning/20 text-xs"
                                          }
                                        >
                                          Refund {b.refundStatus === "processed" ? "Processed" : "Pending"}
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1.5">
                                      <Button size="sm" variant="outline" className="h-8 text-xs">
                                        View
                                      </Button>
                                      <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-xs">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Message
                                      </Button>
                                      {b.status === "upcoming" && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="gap-1.5 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                          onClick={() => handleCancelClick(b)}
                                        >
                                          Cancel
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                  <div className="flex flex-col items-center justify-center">
                                    <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                    <div className="text-sm font-medium">No bookings yet</div>
                                    <div className="text-xs text-muted-foreground mt-1">Bookings will appear here once created</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl lg:col-span-4 border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">New Bookings</CardTitle>
                        {pendingBookingActions.length > 0 && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {pendingBookingActions.length}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        {pendingBookingActions.length > 0 ? (
                          pendingBookingActions.map(({ booking }) => (
                            <div key={booking.id} className="group rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/30 hover:bg-primary/10">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-semibold text-sm">{booking.spaceName}</div>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{formatShortDate(booking.date)}</span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{booking.startTime}–{booking.endTime}</span>
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground font-mono">{booking.id}</div>
                                </div>
                                <Badge className="bg-primary text-primary-foreground border-primary/20 animate-pulse">
                                  New
                                </Badge>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="default" className="flex-1 text-xs">
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                                    Decline
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleCancelClick(booking)}
                                >
                                  Cancel Booking
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                            <div className="text-sm font-medium">All caught up!</div>
                            <div className="text-xs text-muted-foreground mt-1">No new bookings requiring action</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reviews management */}
              <TabsContent value="reviews" className="mt-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <Card className="rounded-2xl lg:col-span-8 border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Reviews Management</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-4">
                        {reviews.length > 0 ? (
                          reviews.map((r) => (
                            <div key={r.id} className="group rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-sm">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <div className="font-semibold text-base">{r.spaceName}</div>
                                    <Badge
                                      variant="outline"
                                      className={
                                        r.sentiment === "positive"
                                          ? "border-success/30 text-success bg-success/10"
                                          : "border-warning/30 text-warning bg-warning/10"
                                      }
                                    >
                                      {r.sentiment}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{r.author}</span>
                                    <span>•</span>
                                    <span>{formatShortDate(r.date)}</span>
                                  </div>
                                  <div className="text-sm text-foreground leading-relaxed">{r.comment}</div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-secondary/10 rounded-lg px-3 py-1.5">
                                  <Star className="h-4 w-4 text-secondary fill-secondary" />
                                  <div className="font-bold text-base">{r.rating}.0</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                                <Button size="sm" variant="outline" className="gap-2 text-xs">
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  Reply to Review
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs">
                                  Flag Review
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center">
                            <Star className="h-10 w-10 text-muted-foreground mb-2" />
                            <div className="text-sm font-medium">No reviews yet</div>
                            <div className="text-xs text-muted-foreground mt-1">Reviews from guests will appear here</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl lg:col-span-4 border-border/50 shadow-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-secondary fill-secondary" />
                            <span className="text-sm text-muted-foreground">Average rating</span>
                          </div>
                          <span className="font-bold text-lg">4.7</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                          <span className="text-sm text-muted-foreground">Total reviews</span>
                          <span className="font-semibold">{reviews.length}</span>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 px-4 py-3 mt-2">
                          <div className="flex items-start gap-2">
                            <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-foreground mb-1">AI Insights</div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                Ready to analyze review themes, sentiment trends, and suggest personalized replies.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Provider Cancel Booking Modal */}
      {selectedBooking && (
        <ProviderCancelBookingModal
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

export default ProviderDashboard;
