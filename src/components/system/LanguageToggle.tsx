import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale";

export function LanguageToggle({ size = "sm" }: { size?: "sm" | "default" }) {
  const { locale, toggleLocale } = useLocale();

  return (
    <Button variant="ghost" size={size} className="gap-2" onClick={toggleLocale} aria-label="Toggle language">
      <Globe className="w-4 h-4" />
      {locale === "ar" ? "EN" : "AR"}
    </Button>
  );
}

