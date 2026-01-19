import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CreditCard, BarChart3, ArrowRight, Shield } from "lucide-react";

const tiles = [
  {
    title: "Company profile",
    description: "Manage your company details, locations, and booking policies.",
    href: "/corporate/company-profile",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Team members",
    description: "Invite teammates, manage roles, and assign cost centers.",
    href: "/corporate/team-members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Monthly billing",
    description: "Consolidated invoices, PO numbers, and payment terms.",
    href: "/corporate/monthly-billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Usage reports",
    description: "Track spend, utilization, and booking trends across teams.",
    href: "/corporate/usage-reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

export default function CorporateAccounts() {
  return (
    <Layout>
      <div className="min-h-screen bg-muted">
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Corporate Accounts</h1>
                  <p className="text-sm text-muted-foreground">
                    Enterprise controls for teams, billing, and reporting.
                  </p>
                </div>
              </div>

              <Badge variant="outline" className="w-fit border bg-muted/60 text-muted-foreground">
                Locked feature
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tiles.map((t) => (
              <Card key={t.href} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{t.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{t.description}</div>
                      </div>
                    </div>

                    <Button asChild variant="outline" className="gap-2">
                      <Link to={t.href}>
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

