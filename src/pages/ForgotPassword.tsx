import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Phone, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { LanguageToggle } from "@/components/system/LanguageToggle";

// Create validation schema factory that accepts translations
const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
  emailOrPhone: z
    .string()
    .min(1, t("emailOrPhoneRequired"))
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return emailRegex.test(val) || (phoneRegex.test(val) && val.replace(/\D/g, "").length >= 8);
      },
      {
        message: t("emailOrPhoneInvalid"),
      }
    ),
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmailOrPhone, setSubmittedEmailOrPhone] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, locale, dir } = useLocale();

  const isRTL = dir === "rtl";

  // Create schema with current translations
  const forgotPasswordSchema = createForgotPasswordSchema(t);

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailOrPhone: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    setSubmittedEmailOrPhone(values.emailOrPhone);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setIsSuccess(true);
      toast({
        title: t("resetLinkSent"),
        description: t("resetLinkSentDescription"),
      });
    } catch (error) {
      toast({
        title: t("unexpectedError"),
        description: t("unexpectedErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputType = (value: string) => {
    if (!value) return "text";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "email" : "tel";
  };

  // Success Screen
  if (isSuccess) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submittedEmailOrPhone);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative">
        {/* Language Toggle - Top Right (RTL-aware) */}
        <div className={`absolute top-4 z-10 ${isRTL ? "left-4" : "right-4"}`}>
          <LanguageToggle size="sm" />
        </div>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">{t("brand")}</span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-foreground mb-3 break-words">
              {t("resetLinkSent")}
            </h1>
            
            <p className="text-muted-foreground mb-6 leading-relaxed break-words">
              {t("resetLinkSentDescription")}
            </p>

            {/* Submitted Email/Phone Display */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6 border border-border">
              <div className="flex items-center justify-center gap-2 text-sm">
                {isEmail ? (
                  <Mail className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Phone className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="font-medium text-foreground break-all">
                  {submittedEmailOrPhone}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-muted-foreground mb-6 space-y-2" dir={dir}>
              <p className="break-words">{t("ifNotReceived")}</p>
              <ul className={`list-disc space-y-1 ${isRTL ? "list-inside text-right" : "list-inside text-left"}`} dir={dir}>
                <li className="break-words">{t("checkSpam")}</li>
                <li className="break-words">{isEmail ? t("verifyEmail") : t("verifyPhone")}</li>
                <li className="break-words">{t("waitAndRetry")}</li>
              </ul>
            </div>

            {/* Return to Login Button */}
            <Button
              variant="cta"
              size="lg"
              className={`w-full h-12 text-base font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className={`w-5 h-5 flex-shrink-0 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              <span className="break-words">{t("backToLogin")}</span>
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground break-words">
              {t("didntReceiveMessage")}{" "}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                }}
                className="text-primary hover:underline font-semibold break-words"
              >
                {t("tryAgain")}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Request Form Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative">
      {/* Language Toggle - Top Right (RTL-aware) */}
      <div className={`absolute top-4 z-10 ${isRTL ? "left-4" : "right-4"}`}>
        <LanguageToggle size="sm" />
      </div>
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">{t("brand")}</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2 break-words">{t("forgotPasswordTitle")}</h1>
          <p className="text-muted-foreground break-words">
            {t("forgotPasswordSubtitle")}
          </p>
        </div>

        {/* Request Form */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5" dir={dir}>
              {/* Email or Phone Field */}
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => {
                  const isEmail = field.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                  const Icon = isEmail ? Mail : Phone;
                  
                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold break-words">
                        {t("emailOrPhone")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Icon className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 ${isRTL ? "right-3" : "left-3"}`} />
                          <Input
                            type={getInputType(field.value)}
                            placeholder={t("emailOrPhonePlaceholder")}
                            className={`h-12 text-base w-full ${isRTL ? "pr-11 text-right" : "pl-11 text-left"} ${form.formState.errors.emailOrPhone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            dir={isRTL ? "rtl" : "ltr"}
                            {...field}
                            onBlur={field.onBlur}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm break-words" />
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {t("resetLinkWillBeSentTo")} {field.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value) ? t("toYourEmail") : t("toYourPhone")}
                      </p>
                    </FormItem>
                  );
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className={`w-full h-12 text-base font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={isRTL ? "mr-2" : "ml-2"}>{t("sending")}</span>
                ) : (
                  <>
                    <span className="break-words">{t("sendResetLink")}</span>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </>
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-4 border-t border-border">
                <Link
                  to="/login"
                  className={`text-sm text-primary font-semibold hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <ArrowLeft className={`w-4 h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`} />
                  <span className="break-words">{t("backToLogin")}</span>
                </Link>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer Trust Message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground break-words px-2">
            {t("weProtectYourInfo")}{" "}
            <Link to="/privacy" className="text-primary hover:underline break-words">
              {t("privacyPolicy")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
