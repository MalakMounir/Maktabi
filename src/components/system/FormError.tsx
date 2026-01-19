import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export interface FormErrorProps {
  message: string;
  type?: "error" | "warning" | "info" | "success";
  className?: string;
  title?: string;
}

export function FormError({ message, type = "error", className, title }: FormErrorProps) {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2,
  };

  const Icon = icons[type];

  const variant = type === "error" ? "destructive" : "default";

  return (
    <Alert variant={variant} className={cn("mt-2", className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className={cn("mt-1.5 text-sm font-medium text-destructive", className)} role="alert">
      {message}
    </p>
  );
}
