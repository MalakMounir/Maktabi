import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import LockedFeaturePlaceholder from "@/components/system/LockedFeaturePlaceholder";
import { Users } from "lucide-react";

export default function TeamMembers() {
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
                  / Team members
                </div>
                <h1 className="mt-1 text-2xl font-bold text-foreground">Team members</h1>
              </div>
              <Button asChild variant="outline">
                <Link to="/corporate">Back</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <LockedFeaturePlaceholder
            title="Team members"
            icon={<Users className="h-6 w-6" />}
            description="Invite your team and control access to corporate bookings and spend."
            highlights={[
              "Invite users with email domain checks",
              "Roles: Admin, Manager, Member",
              "Team-based budgets and spending limits",
              "Approval workflows for bookings",
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}

