import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "destructive" | "warning" | "info";
  className?: string;
  illustration?: React.ReactNode;
}

export function ErrorState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
  className,
  illustration,
}: ErrorStateProps) {
  const variantStyles = {
    default: "border-border bg-card",
    destructive: "border-destructive/20 bg-destructive/5",
    warning: "border-warning/20 bg-warning/5",
    info: "border-primary/20 bg-primary/5",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
    warning: "text-warning",
    info: "text-primary",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border p-8 text-center",
        variantStyles[variant],
        className
      )}
    >
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted", iconStyles[variant])}>
          <Icon className="h-8 w-8" />
        </div>
      ) : null}

      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>

      {actionLabel && onAction && (
        <Button variant={variant === "destructive" ? "outline" : "cta"} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
