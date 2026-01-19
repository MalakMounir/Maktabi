import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { ErrorState } from "@/components/system/ErrorState";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center bg-muted py-16">
        <div className="container mx-auto px-4">
          <ErrorState
            icon={FileQuestion}
            title="Page not found"
            description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
            actionLabel="Return to Home"
            onAction={() => navigate("/")}
            variant="info"
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
