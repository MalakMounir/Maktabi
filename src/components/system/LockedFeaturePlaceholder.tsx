import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type LockedFeaturePlaceholderProps = {
  title: string;
  description?: string;
  highlights?: string[];
  icon?: ReactNode;
  contactEmail?: string;
};

export default function LockedFeaturePlaceholder({
  title,
  description = "This feature is available on Corporate accounts.",
  highlights = [],
  icon,
  contactEmail = "sales@maktabi.com",
}: LockedFeaturePlaceholderProps) {
  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border bg-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              {icon ?? <Lock className="h-6 w-6" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                <Badge variant="outline" className="border bg-muted/60 text-muted-foreground">
                  Locked feature
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <Button asChild variant="cta" className="w-full sm:w-auto gap-2">
            <Link to={`mailto:${contactEmail}?subject=Corporate%20Accounts%20Inquiry`}>
              <Mail className="h-4 w-4" />
              Contact sales
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-4">
          {highlights.length > 0 ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="text-sm font-semibold text-foreground">What you’ll unlock</div>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
                    <span className="min-w-0">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-xl border border-dashed border-border bg-background p-4">
            <div className="text-sm font-semibold text-foreground">Placeholder</div>
            <div className="mt-1 text-sm text-muted-foreground">
              UI and data will appear here once Corporate accounts are enabled.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

