import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import LockedFeaturePlaceholder from "@/components/system/LockedFeaturePlaceholder";
import { CreditCard } from "lucide-react";

export default function MonthlyBilling() {
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
                  / Monthly billing
                </div>
                <h1 className="mt-1 text-2xl font-bold text-foreground">Monthly billing</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/corporate">Back</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <LockedFeaturePlaceholder
            title="Monthly billing"
            icon={<CreditCard className="h-6 w-6" />}
            description="Get consolidated invoicing for all bookings across your organization."
            highlights={[
              "One invoice per month (or per cost center)",
              "PO numbers and custom invoice fields",
              "Net payment terms and bank transfer options",
              "Exportable statements and invoice history",
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}

