import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  Building2,
} from "lucide-react";

type BookingStatus = "upcoming" | "completed" | "cancelled" | "cancelled_by_host";

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

const ProviderBookings = () => {
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

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = (reasonType: CancellationReasonType, reason: string) => {
    if (!selectedBooking) return;

    const fullReason = reason || cancellationReasons[reasonType];
    const refundAmount = selectedBooking.totalPrice;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? { ...b, status: "cancelled_by_host" as const, refundStatus: "pending" as const }
          : b
      )
    );

    toast({
      title: "Booking Cancelled",
      description: `Booking has been cancelled. Status changed to "Canceled by host". Refund of ${selectedBooking.currency} ${refundAmount.toFixed(2)} will be processed.`,
    });

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
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
                  <p className="text-sm text-muted-foreground">Manage all your space bookings</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
                <Link to="/provider/dashboard">
                  <Building2 className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">All Bookings</CardTitle>
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
                      <TableHead className="font-semibold">Time</TableHead>
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
                            <div className="text-xs text-muted-foreground mt-0.5">{b.location}</div>
                          </TableCell>
                          <TableCell className="text-sm">{formatShortDate(b.date)}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {b.startTime}–{b.endTime}
                            </div>
                          </TableCell>
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
                        <TableCell colSpan={7} className="text-center py-8">
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
        </div>

        {selectedBooking && (
          <ProviderCancelBookingModal
            open={cancelModalOpen}
            onOpenChange={setCancelModalOpen}
            booking={selectedBooking}
            onConfirm={handleCancelConfirm}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProviderBookings;
