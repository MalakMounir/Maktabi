import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/locale";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  const { t } = useLocale();

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 text-center shadow-card", className)}>
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-muted" />
      <div className="text-lg font-semibold text-foreground">{title ?? t("emptyTitle")}</div>
      <div className="mt-1 text-sm text-muted-foreground">{description ?? t("emptyDescription")}</div>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="default" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

