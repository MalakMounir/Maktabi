import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { AuthDialog } from "./AuthDialog";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredRole, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      setShowAuthDialog(false);
    }
  }, [isAuthenticated]);

  // If not authenticated, show auth dialog
  if (!isAuthenticated) {
    const currentPath = redirectTo || (location.pathname + location.search);
    return (
      <Layout>
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          redirectTo={currentPath}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Please sign in to continue</p>
            <p className="text-sm text-muted-foreground">Sign in to access this page</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If role is required and user doesn't have it, redirect
  if (requiredRole && !hasRole(requiredRole)) {
    const defaultRedirect = requiredRole === "admin" ? "/admin" : requiredRole === "provider" ? "/provider" : "/dashboard";
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
}
