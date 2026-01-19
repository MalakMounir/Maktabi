import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import LockedFeaturePlaceholder from "@/components/system/LockedFeaturePlaceholder";
import { Building2 } from "lucide-react";

export default function CompanyProfile() {
  return (
    <Layout>
      <div className="min-h-screen bg-muted">
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  <Link to="/corporate" className="hover:underline">
                    Corporate Accounts
                  </Link>{" "}
                  / Company profile
                </div>
                <h1 className="mt-1 text-2xl font-bold text-foreground">Company profile</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/corporate">Back</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <LockedFeaturePlaceholder
            title="Company profile"
            icon={<Building2 className="h-6 w-6" />}
            description="Centralize company details used across bookings and approvals."
            highlights={[
              "Company identity and billing address",
              "Locations, departments, and cost centers",
              "Booking policies and approval rules",
              "SSO and domain verification (optional)",
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}

