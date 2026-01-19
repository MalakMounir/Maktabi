import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProviderRouteProps {
  children: React.ReactNode;
}

/**
 * Protects provider routes - redirects to /provider/login if userRole !== "provider"
 */
export function ProviderRoute({ children }: ProviderRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const userRole = localStorage.getItem("userRole");

  // If not authenticated, redirect to provider login
  if (!isAuthenticated || !user) {
    return <Navigate to="/provider/login" replace />;
  }

  // If userRole is not "provider", redirect to provider login
  if (userRole !== "provider") {
    return <Navigate to="/provider/login" replace />;
  }

  // If user is authenticated and has provider role, render children
  return <>{children}</>;
}
