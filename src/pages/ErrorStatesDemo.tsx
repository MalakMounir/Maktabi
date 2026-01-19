import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ErrorState,
  FormError,
  BookingError,
  SystemError,
  EmptySearchResults,
  EmptyBookings,
} from "@/components/system";
import { LoginForm as LoginFormComponent } from "@/components/auth/LoginForm";
import { FileQuestion } from "lucide-react";

const ErrorStatesDemo = () => {
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [showBookingConflict, setShowBookingConflict] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Error States Showcase</h1>
          <p className="text-muted-foreground">
            A comprehensive collection of error states, empty states, and validation messages for Maktabi.
          </p>
        </div>

        <Tabs defaultValue="errors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="errors">Error States</TabsTrigger>
            <TabsTrigger value="empty">Empty States</TabsTrigger>
            <TabsTrigger value="forms">Form Validation</TabsTrigger>
            <TabsTrigger value="booking">Booking Errors</TabsTrigger>
          </TabsList>

          {/* Error States */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>404 - Page Not Found</CardTitle>
                <CardDescription>When a user navigates to a non-existent page</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState
                  icon={FileQuestion}
                  title="Page not found"
                  description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
                  actionLabel="Return to Home"
                  onAction={() => window.location.href = "/"}
                  variant="info"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Errors</CardTitle>
                <CardDescription>Network, server, and generic system errors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SystemError
                  type="network"
                  onRetry={() => alert("Retrying connection...")}
                />
                <SystemError
                  type="server"
                  onRetry={() => alert("Retrying...")}
                />
                <SystemError
                  type="generic"
                  onRetry={() => alert("Retrying...")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Empty States */}
          <TabsContent value="empty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Empty Search Results</CardTitle>
                <CardDescription>When no workspaces match the search criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <EmptySearchResults
                  hasFilters={false}
                  onBrowseAll={() => alert("Browsing all spaces...")}
                />
                <EmptySearchResults
                  hasFilters={true}
                  onClearFilters={() => alert("Clearing filters...")}
                  onBrowseAll={() => alert("Browsing all spaces...")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empty Bookings</CardTitle>
                <CardDescription>When users have no bookings yet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <EmptyBookings
                  type="upcoming"
                  onExplore={() => alert("Exploring workspaces...")}
                />
                <EmptyBookings
                  type="past"
                  onExplore={() => alert("Exploring workspaces...")}
                />
                <EmptyBookings
                  type="all"
                  onExplore={() => alert("Exploring workspaces...")}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Validation */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Form with Validation</CardTitle>
                <CardDescription>
                  Try submitting with invalid credentials (e.g., wrong@example.com / wrongpass) to see error handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginFormComponent
                  onSubmit={(values) => {
                    alert(`Login successful! Email: ${values.email}`);
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Error Messages</CardTitle>
                <CardDescription>Different types of form error alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormError
                  message="Invalid email or password. Please check your credentials and try again."
                  type="error"
                  title="Login failed"
                />
                <FormError
                  message="Your session will expire in 5 minutes. Please save your work."
                  type="warning"
                  title="Session expiring"
                />
                <FormError
                  message="Your booking has been saved as a draft."
                  type="info"
                  title="Draft saved"
                />
                <FormError
                  message="Your booking has been confirmed successfully!"
                  type="success"
                  title="Booking confirmed"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Errors */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Error States</CardTitle>
                <CardDescription>Various booking-related error scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <BookingError
                  type="unavailable"
                  onChooseAnother={() => alert("Choosing another time...")}
                />
                <BookingError
                  type="conflict"
                  onChooseAnother={() => alert("Choosing another time...")}
                />
                <BookingError
                  type="payment"
                  onRetry={() => alert("Retrying payment...")}
                />
                <BookingError
                  type="expired"
                  onGoHome={() => alert("Going home...")}
                />
                <BookingError
                  type="generic"
                  onRetry={() => alert("Retrying...")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Booking Errors</CardTitle>
                <CardDescription>Toggle different booking error states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPaymentError(!showPaymentError);
                      setShowBookingConflict(false);
                    }}
                  >
                    {showPaymentError ? "Hide" : "Show"} Payment Error
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBookingConflict(!showBookingConflict);
                      setShowPaymentError(false);
                    }}
                  >
                    {showBookingConflict ? "Hide" : "Show"} Booking Conflict
                  </Button>
                </div>

                {showPaymentError && (
                  <FormError
                    message="Payment failed. Please check your card details and try again."
                    type="error"
                    title="Payment failed"
                  />
                )}

                {showBookingConflict && (
                  <BookingError
                    type="conflict"
                    onChooseAnother={() => {
                      setShowBookingConflict(false);
                      alert("Choosing another time...");
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ErrorStatesDemo;
