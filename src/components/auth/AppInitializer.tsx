import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that handles app initialization routing based on localStorage
 * Reads userRole from localStorage and routes user accordingly on app load
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run routing logic once on initial load if user is authenticated
    if (hasInitialized.current || !isAuthenticated || !user) {
      return;
    }

    // Read userRole from localStorage
    const storedUserRole = localStorage.getItem("userRole");
    
    // Only route if we're on the root path and have a stored role
    // Skip routing if user is already on a specific page (not root)
    if (location.pathname === "/" && storedUserRole) {
      hasInitialized.current = true;
      
      if (storedUserRole === "provider") {
        const providerOnboarded = localStorage.getItem("providerOnboarded");
        // Route to onboarding if not onboarded, otherwise to provider dashboard
        if (providerOnboarded === "false") {
          navigate("/provider/onboarding", { replace: true });
        } else {
          navigate("/provider/dashboard", { replace: true });
        }
      } else if (storedUserRole === "admin") {
        navigate("/admin", { replace: true });
      } else {
        // Default to user dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return <>{children}</>;
}
