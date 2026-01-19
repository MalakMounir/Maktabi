import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useLocale } from "@/i18n/locale";

export type StatusVariant = "success" | "error" | "warning";

export function StatusState({
  variant,
  title,
  description,
  className,
}: {
  variant: StatusVariant;
  title?: string;
  description?: string;
  className?: string;
}) {
  const { t } = useLocale();

  const icon =
    variant === "success" ? (
      <CheckCircle2 className="h-4 w-4 text-success" />
    ) : variant === "warning" ? (
      <AlertTriangle className="h-4 w-4 text-warning" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );

  const defaultTitle =
    variant === "success" ? t("successTitle") : variant === "warning" ? t("warning") : t("errorTitle");

  const borderClass =
    variant === "success"
      ? "border-success/30 bg-success/5"
      : variant === "warning"
        ? "border-warning/30 bg-warning/5"
        : "border-destructive/30 bg-destructive/5";

  return (
    <Alert className={cn(borderClass, className)}>
      {icon}
      <div>
        <AlertTitle>{title ?? defaultTitle}</AlertTitle>
        {description ? <AlertDescription>{description}</AlertDescription> : null}
      </div>
    </Alert>
  );
}

