import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import LockedFeaturePlaceholder from "@/components/system/LockedFeaturePlaceholder";
import { BarChart3 } from "lucide-react";

export default function UsageReports() {
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
                  / Usage reports
                </div>
                <h1 className="mt-1 text-2xl font-bold text-foreground">Usage reports</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/corporate">Back</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <LockedFeaturePlaceholder
            title="Usage reports"
            icon={<BarChart3 className="h-6 w-6" />}
            description="Measure utilization and spend across your teams and locations."
            highlights={[
              "Spend by team, location, and workspace type",
              "Utilization and peak-hour trends",
              "Budget pacing and anomaly detection",
              "CSV exports and scheduled email reports",
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}

