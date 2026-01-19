import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/locale";

export type Availability = "available" | "limited" | "unavailable" | "fullyBooked";

const CLASS_BY_STATUS: Record<Availability, string> = {
  available: "bg-success/10 text-success border-success/20",
  limited: "bg-warning/10 text-warning border-warning/20",
  fullyBooked: "bg-destructive/10 text-destructive border-destructive/20",
  unavailable: "bg-destructive/10 text-destructive border-destructive/20",
};

export function AvailabilityBadge({ status }: { status: Availability }) {
  const { t } = useLocale();

  const labelKey =
    status === "available"
      ? "available"
      : status === "limited"
        ? "limited"
        : status === "fullyBooked"
          ? "fullyBooked"
          : "unavailable";

  return (
    <Badge variant="outline" className={`${CLASS_BY_STATUS[status]} border`}>
      {t(labelKey)}
    </Badge>
  );
}

