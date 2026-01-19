import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocaleProvider } from "@/i18n/locale";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProviderRoute } from "@/components/auth/ProviderRoute";
import { AppInitializer } from "@/components/auth/AppInitializer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import RoleSelection from "./pages/RoleSelection";
import AdminLogin from "./pages/AdminLogin";
import SearchResults from "./pages/SearchResults";
import SpaceDetails from "./pages/SpaceDetails";
import BookingFlow from "./pages/BookingFlow";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetails from "./pages/BookingDetails";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProviderOnboarding from "./pages/ProviderOnboarding";
import ProviderSpaceEditor from "./pages/ProviderSpaceEditor";
import ProviderLogin from "./pages/provider/ProviderLogin";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderAvailability from "./pages/provider/ProviderAvailability";
import CorporateAccounts from "./pages/corporate/CorporateAccounts";
import CompanyProfile from "./pages/corporate/CompanyProfile";
import TeamMembers from "./pages/corporate/TeamMembers";
import MonthlyBilling from "./pages/corporate/MonthlyBilling";
import UsageReports from "./pages/corporate/UsageReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInitializer>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/role-selection"
                element={
                  <ProtectedRoute>
                    <RoleSelection />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/space/:id" element={<SpaceDetails />} />
              <Route path="/booking/:id" element={<BookingFlow />} />
              <Route path="/bookings/:bookingId" element={<BookingDetails />} />
              <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              {/* Provider Routes */}
              <Route path="/provider/login" element={<ProviderLogin />} />
              <Route
                path="/provider"
                element={<Navigate to="/provider/dashboard" replace />}
              />
              <Route
                path="/provider/dashboard"
                element={
                  <ProviderRoute>
                    <ProviderDashboard />
                  </ProviderRoute>
                }
              />
              <Route
                path="/provider/onboarding"
                element={
                  <ProviderRoute>
                    <ProviderOnboarding />
                  </ProviderRoute>
                }
              />
              <Route
                path="/provider/bookings"
                element={
                  <ProviderRoute>
                    <ProviderBookings />
                  </ProviderRoute>
                }
              />
              <Route
                path="/provider/availability"
                element={
                  <ProviderRoute>
                    <ProviderAvailability />
                  </ProviderRoute>
                }
              />
              <Route
                path="/provider/spaces/new"
                element={
                  <ProviderRoute>
                    <ProviderSpaceEditor />
                  </ProviderRoute>
                }
              />
              <Route
                path="/provider/spaces/:id/edit"
                element={
                  <ProviderRoute>
                    <ProviderSpaceEditor />
                  </ProviderRoute>
                }
              />
              <Route
                path="/corporate"
                element={
                  <ProtectedRoute>
                    <CorporateAccounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/corporate/company-profile"
                element={
                  <ProtectedRoute>
                    <CompanyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/corporate/team-members"
                element={
                  <ProtectedRoute>
                    <TeamMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/corporate/monthly-billing"
                element={
                  <ProtectedRoute>
                    <MonthlyBilling />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/corporate/usage-reports"
                element={
                  <ProtectedRoute>
                    <UsageReports />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </AppInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
