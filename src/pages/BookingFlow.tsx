import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { spaces } from "@/data/mockData";
import { PaymentError, PaymentErrorType } from "@/components/payment/PaymentError";
import { PriceChangeAlert } from "@/components/payment/PriceChangeAlert";
import { OverbookingError } from "@/components/system/OverbookingError";
import { BookingAuthModal } from "@/components/auth/BookingAuthModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Check,
  ChevronLeft,
  Lock,
  Shield,
  Loader2,
  Star,
  AlertCircle,
} from "lucide-react";

// Preserved booking details interface
interface PreservedBookingDetails {
  spaceId: string;
  date: string;
  time: string;
  duration: number;
  spaceName: string;
  spaceImage: string;
  spaceLocation: string;
}

const BookingFlow = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Payment processing states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<PaymentErrorType | null>(null);
  const [paymentTimeoutId, setPaymentTimeoutId] = useState<number | null>(null);
  
  // Price change states
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChangeDetected, setPriceChangeDetected] = useState(false);
  const [priceAccepted, setPriceAccepted] = useState(false);
  
  // Overbooking states
  const [isOverbookingDetected, setIsOverbookingDetected] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // Preserved booking details
  const [preservedDetails, setPreservedDetails] = useState<PreservedBookingDetails | null>(null);
  
  // Refs for cleanup and scroll
  const priceCheckIntervalRef = useRef<number | null>(null);
  const priceBreakdownRef = useRef<HTMLDivElement | null>(null);

  const space = spaces.find((s) => s.id === id);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const time = searchParams.get("time") || "09:00";
  const duration = parseInt(searchParams.get("duration") || "2");

  // Initialize original price and preserved details
  useEffect(() => {
    if (space) {
      setOriginalPrice(space.price);
      setCurrentPrice(space.price);
      setPreservedDetails({
        spaceId: space.id,
        date,
        time,
        duration,
        spaceName: space.name,
        spaceImage: space.image,
        spaceLocation: space.location,
      });
    }
  }, [space?.id, date, time, duration]);

  // Price change detection - check periodically before confirmation (steps 2 and 3)
  useEffect(() => {
    if (!space || (step !== 2 && step !== 3) || priceAccepted) return;

    // Simulate price checking every 5 seconds
    priceCheckIntervalRef.current = setInterval(() => {
      // Simulate price change (20% chance for demo purposes)
      // In real app, this would be an API call
      if (Math.random() < 0.2 && originalPrice) {
        const newPrice = Math.round(originalPrice * (1 + (Math.random() * 0.3 - 0.1))); // ±10% variation
        if (newPrice !== currentPrice) {
          setCurrentPrice(newPrice);
          setPriceChangeDetected(true);
        }
      }
    }, 5000);

    return () => {
      if (priceCheckIntervalRef.current) {
        clearInterval(priceCheckIntervalRef.current);
      }
    };
  }, [space, step, originalPrice, currentPrice, priceAccepted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (paymentTimeoutId) {
        clearTimeout(paymentTimeoutId);
      }
      if (priceCheckIntervalRef.current) {
        clearInterval(priceCheckIntervalRef.current);
      }
    };
  }, [paymentTimeoutId]);

  // When user becomes authenticated, they can proceed with booking
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      // User just logged in, close modal
      setShowAuthModal(false);
      // Booking data is already preserved in state and URL params
      // User can now click "Confirm Booking" again
    }
  }, [isAuthenticated, showAuthModal]);

  if (!space) {
    navigate("/search");
    return null;
  }

  // Use current price or original price
  const effectivePrice = priceAccepted && currentPrice ? currentPrice : (currentPrice || space.price);
  const subtotal = effectivePrice * duration;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  // Check slot availability before booking
  const checkSlotAvailability = async (): Promise<boolean> => {
    setIsCheckingAvailability(true);
    
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        setIsCheckingAvailability(false);
        // Simulate overbooking detection (25% chance for demo)
        // In real app, this would be an actual API call to check availability
        const isAvailable = Math.random() > 0.25;
        resolve(isAvailable);
      }, 800);
    });
  };

  // Mock payment processing with error simulation
  const processPayment = async (): Promise<{ success: boolean; error?: PaymentErrorType }> => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    return new Promise((resolve) => {
      // Simulate payment processing delay
      const processingDelay = Math.random() * 2000 + 1000; // 1-3 seconds

      // Set timeout for payment (5 seconds)
      const timeout = setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentError("timeout");
        resolve({ success: false, error: "timeout" });
      }, 5000);

      setPaymentTimeoutId(timeout);

      // Simulate payment result after delay
      setTimeout(() => {
        clearTimeout(timeout);
        setPaymentTimeoutId(null);

        // Simulate payment failure (30% chance for demo)
        if (Math.random() < 0.3) {
          setIsProcessingPayment(false);
          setPaymentError("failed");
          resolve({ success: false, error: "failed" });
        } else {
          // Payment success
          setIsProcessingPayment(false);
          const bookingId = `BK-${Date.now()}`;
          navigate(
            `/confirmation/${bookingId}?spaceId=${space.id}&date=${date}&time=${time}&duration=${duration}&price=${effectivePrice}`
          );
          resolve({ success: true });
        }
      }, processingDelay);
    });
  };

  const handleConfirmBooking = async () => {
    // Require authentication before final confirmation
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Check for price change before processing
    if (priceChangeDetected && !priceAccepted) {
      return; // Don't proceed if price changed and not accepted
    }

    // Check slot availability first
    const isAvailable = await checkSlotAvailability();
    
    if (!isAvailable) {
      // Slot is unavailable - trigger overbooking modal
      setIsOverbookingDetected(true);
      return;
    }

    // Slot is available - proceed with payment
    setIsOverbookingDetected(false);
    await processPayment();
  };

  const handleRetryPayment = () => {
    // Clear error state and return to payment step
    setPaymentError(null);
    setIsProcessingPayment(false);
    setStep(2); // Return to payment step
    // Booking data remains intact (preserved in state and URL params)
  };

  const handleChangePaymentMethod = () => {
    // Clear error state and return to payment step to change payment method
    setPaymentError(null);
    setIsProcessingPayment(false);
    setStep(2); // Return to payment step
    // Booking data remains intact (preserved in state and URL params)
  };

  const handleCancelBooking = () => {
    // Clear all states and navigate back
    setPaymentError(null);
    setIsProcessingPayment(false);
    if (paymentTimeoutId) {
      clearTimeout(paymentTimeoutId);
      setPaymentTimeoutId(null);
    }
    navigate(-1);
  };

  const handleAcceptPriceChange = () => {
    setPriceAccepted(true);
    setPriceChangeDetected(false);
    // Update original price to new price
    if (currentPrice) {
      setOriginalPrice(currentPrice);
    }
  };

  const handleReviewPrice = () => {
    // Scroll to price breakdown sidebar
    if (priceBreakdownRef.current) {
      priceBreakdownRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Add a highlight effect
      priceBreakdownRef.current.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        priceBreakdownRef.current?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
    }
  };

  const handleContinueBooking = () => {
    // Accept the price change and proceed
    handleAcceptPriceChange();
  };

  const handleCancelPriceChange = () => {
    // Revert to original price
    if (originalPrice) {
      setCurrentPrice(originalPrice);
      setPriceChangeDetected(false);
    }
    handleCancelBooking();
  };

  const handleAdjustTime = () => {
    // Navigate back to space details page with preserved date/time/duration
    // so user can adjust the time selection
    if (!space || !preservedDetails) return;
    
    setIsOverbookingDetected(false);
    const params = new URLSearchParams();
    params.set("date", preservedDetails.date);
    params.set("time", preservedDetails.time);
    params.set("duration", preservedDetails.duration.toString());
    
    navigate(`/space/${space.id}?${params.toString()}`);
  };

  const handleViewSimilarSpaces = () => {
    // Navigate to search results with same filters
    if (!space || !preservedDetails) return;
    
    const params = new URLSearchParams();
    if (preservedDetails.spaceLocation) {
      params.set("location", preservedDetails.spaceLocation);
    }
    if (preservedDetails.date) {
      params.set("date", preservedDetails.date);
    }
    if (space.type) {
      params.set("type", space.type);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Layout hideFooter>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-28 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    step >= s ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s === 1 ? "Review" : s === 2 ? "Payment" : "Confirm"}
                </span>
                {s < 3 && <div className="w-12 h-px bg-border mx-4" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Step 1: Review */}
              {step === 1 && (
                <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Review your booking</h2>

                  {/* Space Info */}
                  <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                    <img
                      src={space.image}
                      alt={space.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{space.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {space.location}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span>Date</span>
                      </div>
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Time</span>
                      </div>
                      <span className="font-medium">
                        {time} - {parseInt(time) + duration}:00
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Duration</span>
                      </div>
                      <span className="font-medium">
                        {duration} {duration === 1 ? "hour" : "hours"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Sticky CTA */}
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 pb-safe">
                    <div className="container mx-auto px-4 py-3">
                      <Button
                        variant="cta"
                        size="lg"
                        className="w-full"
                        onClick={() => setStep(2)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                  {/* Desktop Button */}
                  <Button
                    variant="cta"
                    size="lg"
                    className="w-full mt-6 hidden lg:flex"
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                  </Button>
                  {/* Spacer for mobile sticky button */}
                  <div className="lg:hidden h-20" />
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Payment method</h2>

                  {/* Price Change Alert */}
                  {priceChangeDetected && !priceAccepted && originalPrice && currentPrice && (
                    <div className="mb-6">
                      <PriceChangeAlert
                        oldPrice={originalPrice * duration}
                        newPrice={currentPrice * duration}
                        currency={space.currency}
                        onReviewPrice={handleReviewPrice}
                        onContinueBooking={handleContinueBooking}
                        onCancel={handleCancelPriceChange}
                      />
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    {[
                      { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                      { id: "apple", label: "Apple Pay", icon: CreditCard },
                      { id: "google", label: "Google Pay", icon: CreditCard },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="sr-only"
                        />
                        <method.icon className="w-5 h-5 text-foreground" />
                        <span className="font-medium">{method.label}</span>
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mb-6 p-4 bg-muted rounded-xl">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Expiry
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg border border-input bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6 p-4 rounded-lg bg-success/5 border border-success/20">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-2 text-success">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold text-foreground">Secure Payment</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 pl-7">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-success" />
                        Protected with 256-bit SSL encryption
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-success" />
                        Your payment information is never stored
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-success" />
                        You won't be charged until you confirm your booking
                      </p>
                    </div>
                  </div>

                  {/* Mobile Sticky CTA */}
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 pb-safe">
                    <div className="container mx-auto px-4 py-3">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="cta"
                          size="lg"
                          className="flex-1"
                          onClick={() => setStep(3)}
                          disabled={priceChangeDetected && !priceAccepted}
                        >
                          Review & Confirm
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Desktop Buttons */}
                  <div className="hidden lg:flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="cta"
                      size="lg"
                      className="flex-1"
                      onClick={() => setStep(3)}
                      disabled={priceChangeDetected && !priceAccepted}
                    >
                      Review & Confirm
                    </Button>
                  </div>
                  {/* Spacer for mobile sticky button */}
                  <div className="lg:hidden h-20" />
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
                  <h2 className="text-xl font-semibold mb-6">Confirm & Book</h2>

                  {/* Authentication Required Alert */}
                  {!isAuthenticated && (
                    <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">Sign in required</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Please sign in to complete your booking. Your booking details will be saved.
                          </p>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setShowAuthDialog(true)}
                          >
                            Sign in to continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Change Alert */}
                  {priceChangeDetected && !priceAccepted && originalPrice && currentPrice && (
                    <div className="mb-6">
                      <PriceChangeAlert
                        oldPrice={originalPrice * duration}
                        newPrice={currentPrice * duration}
                        currency={space.currency}
                        onReviewPrice={handleReviewPrice}
                        onContinueBooking={handleContinueBooking}
                        onCancel={handleCancelPriceChange}
                      />
                    </div>
                  )}

                  {/* Payment Error */}
                  {paymentError && (
                    <div className="mb-6">
                      <PaymentError
                        type={paymentError}
                        onRetry={handleRetryPayment}
                        onChangePaymentMethod={handleChangePaymentMethod}
                        onCancel={handleCancelBooking}
                      />
                    </div>
                  )}

                  {/* Overbooking Error */}
                  {isOverbookingDetected && !paymentError && (
                    <div className="mb-6">
                      <OverbookingError
                        spaceName={preservedDetails?.spaceName || space.name}
                        selectedDate={preservedDetails?.date || date}
                        selectedTime={preservedDetails?.time || time}
                        onChooseAnotherTime={handleAdjustTime}
                        onViewAlternatives={handleViewSimilarSpaces}
                      />
                    </div>
                  )}

                  {/* Final Review */}
                  {!paymentError && !isOverbookingDetected && (
                    <>
                      <div className="bg-muted rounded-xl p-4 mb-6">
                        <h3 className="font-medium mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Space</span>
                            <span>{preservedDetails?.spaceName || space.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span>{new Date(date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time</span>
                            <span>{time} - {parseInt(time) + duration}:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment</span>
                            <span>Card ending in 3456</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="mb-6 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 rounded border-border text-primary"
                          />
                          <span className="text-sm text-muted-foreground">
                            I agree to the{" "}
                            <a href="#" className="text-primary hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-primary hover:underline">
                              Cancellation Policy
                            </a>
                          </span>
                        </label>
                        <div className="pl-7 p-3 rounded-lg bg-success/5 border border-success/20">
                          <div className="flex items-start gap-2 mb-1">
                            <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-foreground">Free cancellation available</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Cancel anytime before your booking starts for a full refund. Your booking details are saved securely.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Sticky CTA */}
                      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 pb-safe">
                        <div className="container mx-auto px-4 py-3">
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="lg"
                              className="flex-1"
                              onClick={() => {
                                setPaymentError(null);
                                setStep(2);
                              }}
                              disabled={isProcessingPayment}
                            >
                              Back
                            </Button>
                            <Button
                              variant="cta"
                              size="lg"
                              className="flex-1"
                              onClick={handleConfirmBooking}
                              disabled={
                                isProcessingPayment || 
                                isCheckingAvailability ||
                                (priceChangeDetected && !priceAccepted) ||
                                isOverbookingDetected
                              }
                            >
                              {isCheckingAvailability ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Checking...
                                </>
                              ) : isProcessingPayment ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Confirm Booking"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {/* Desktop Buttons */}
                      <div className="hidden lg:flex gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            setPaymentError(null);
                            setStep(2);
                          }}
                          disabled={isProcessingPayment}
                        >
                          Back
                        </Button>
                        <Button
                          variant="cta"
                          size="lg"
                          className="flex-1"
                          onClick={handleConfirmBooking}
                          disabled={
                            isProcessingPayment || 
                            isCheckingAvailability ||
                            (priceChangeDetected && !priceAccepted) ||
                            isOverbookingDetected
                          }
                        >
                          {isCheckingAvailability ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Checking availability...
                            </>
                          ) : isProcessingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </Button>
                      </div>
                      {/* Spacer for mobile sticky button */}
                      <div className="lg:hidden h-20" />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Price Summary Sidebar */}
            <div className="lg:col-span-2">
              <div 
                ref={priceBreakdownRef}
                className="bg-card rounded-2xl border border-border p-6 sticky top-24 transition-all duration-300"
              >
                <h3 className="font-semibold mb-4">Price Details</h3>

                <div className="flex gap-3 mb-4 pb-4 border-b border-border">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{space.name}</p>
                    <p className="text-xs text-muted-foreground">{space.location}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {space.currency} {effectivePrice} × {duration} hours
                    </span>
                    <div className="flex flex-col items-end">
                      {priceChangeDetected && !priceAccepted && originalPrice && (
                        <span className="line-through text-muted-foreground text-xs mb-0.5">
                          {space.currency} {originalPrice * duration}
                        </span>
                      )}
                      <span className={priceChangeDetected && !priceAccepted ? "text-primary font-medium" : ""}>
                        {space.currency} {subtotal}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <div className="flex flex-col items-end">
                      {priceChangeDetected && !priceAccepted && originalPrice && (
                        <span className="line-through text-muted-foreground text-xs mb-0.5">
                          {space.currency} {Math.round(originalPrice * duration * 0.05)}
                        </span>
                      )}
                      <span className={priceChangeDetected && !priceAccepted ? "text-primary font-medium" : ""}>
                        {space.currency} {serviceFee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <div className="flex flex-col items-end">
                    {priceChangeDetected && !priceAccepted && originalPrice && (
                      <span className="line-through text-muted-foreground text-sm font-normal mb-1">
                        {space.currency} {originalPrice * duration + Math.round(originalPrice * duration * 0.05)}
                      </span>
                    )}
                    <span className={priceChangeDetected && !priceAccepted ? "text-primary" : ""}>
                    {space.currency} {total}
                  </span>
                  </div>
                </div>

                {/* Price change indicator in sidebar */}
                {priceChangeDetected && !priceAccepted && originalPrice && currentPrice && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <PriceChangeAlert
                      oldPrice={originalPrice * duration}
                      newPrice={currentPrice * duration}
                      currency={space.currency}
                      onReviewPrice={handleReviewPrice}
                      onContinueBooking={handleContinueBooking}
                      onCancel={handleCancelPriceChange}
                    />
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-5 h-5 text-success" />
                    <span className="font-semibold text-foreground">Protected by Maktabi Guarantee</span>
                  </div>
                  <div className="pl-7 space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-success" />
                      Secure 256-bit SSL encryption
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-success" />
                      Full refund if space doesn't match description
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-success" />
                      Payment protection on all bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BookingAuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="login"
        onGuestContinue={() => {
          // Allow guest to proceed with booking (limited functionality)
          // In a real app, you might want to show a warning or limit features
          // For now, we'll allow them to continue but they'll need to sign in eventually
        }}
      />
    </Layout>
  );
};

export default BookingFlow;
