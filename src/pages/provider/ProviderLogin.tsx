import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Building2, Mail, Lock, Phone, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { LanguageToggle } from "@/components/system/LanguageToggle";

// Create validation schema factory that accepts translations
const createLoginSchema = (t: (key: string) => string) => z.object({
  emailOrPhone: z
    .string()
    .min(1, t("emailOrPhoneRequired"))
    .refine(
      (val) => {
        // Check if it's an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a phone (supports various formats)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return emailRegex.test(val) || (phoneRegex.test(val) && val.replace(/\D/g, "").length >= 8);
      },
      {
        message: t("emailOrPhoneInvalid"),
      }
    ),
  password: z.string().min(6, t("passwordMinLength")),
});

const ProviderLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale, dir } = useLocale();

  const isRTL = dir === "rtl";

  // Create schema with current translations
  const loginSchema = createLoginSchema(t);

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      // Determine if input is email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrPhone);
      
      // For phone numbers, we'll need to convert to email format for the auth system
      const loginIdentifier = isEmail 
        ? values.emailOrPhone 
        : `phone_${values.emailOrPhone.replace(/\D/g, "")}@maktabi.local`;

      const result = await login(loginIdentifier, values.password);

      if (!result.success) {
        toast({
          title: t("loginError"),
          description: result.error || t("loginErrorDescription"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if user is a provider
      const userRole = localStorage.getItem("userRole");
      if (userRole !== "provider") {
        toast({
          title: "Access Denied",
          description: "This login is for space providers only. Please use the regular login page.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect based on provider onboarding status
      const providerOnboarded = localStorage.getItem("providerOnboarded");
      const redirectTo = location.state?.from?.pathname || 
        (location.search?.includes("redirect=") ? decodeURIComponent(location.search.split("redirect=")[1]) : null) ||
        (providerOnboarded === "true" ? "/provider/dashboard" : "/provider/onboarding");
      
      navigate(redirectTo, { replace: true });
      
      toast({
        title: t("loginSuccess"),
        description: t("loginSuccessDescription"),
      });
    } catch (error) {
      toast({
        title: t("unexpectedError"),
        description: t("unexpectedErrorDescription"),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const getInputType = (value: string) => {
    if (!value) return "text";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "email" : "tel";
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2 break-words">Provider Login</h1>
          <p className="text-muted-foreground break-words">Sign in to manage your spaces</p>
        </div>

        {/* Trust Indicators */}
        <div className={`flex items-center justify-center gap-4 sm:gap-6 mb-8 p-4 bg-card/50 rounded-xl border border-border/50 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-success flex-shrink-0" />
            <span className="whitespace-nowrap break-keep">{t("secureAndProtected")}</span>
          </div>
          <div className="h-4 w-px bg-border flex-shrink-0" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="whitespace-nowrap break-keep">{t("sslEncryption")}</span>
          </div>
        </div>

        {/* Login Form */}
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
                      <FormLabel className="text-sm font-semibold break-words">{t("emailOrPhone")}</FormLabel>
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
                    </FormItem>
                  );
                }}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold break-words">{t("password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 ${isRTL ? "right-3" : "left-3"}`} />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("passwordPlaceholder")}
                          className={`h-12 text-base w-full ${isRTL ? "pr-11 pl-10 text-right" : "pl-11 pr-10 text-left"} ${form.formState.errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 ${isRTL ? "left-3" : "right-3"}`}
                          aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm break-words" />
                  </FormItem>
                )}
              />

              {/* Forgot Password Link */}
              <div className={`flex items-center ${isRTL ? "justify-start" : "justify-end"}`}>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors whitespace-nowrap"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Primary CTA - Login Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className={`w-full h-12 text-base font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={isRTL ? "mr-2" : "ml-2"}>{t("loggingIn")}</span>
                ) : (
                  <>
                    <span className="break-words">Sign In</span>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </>
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2 break-words">
                  Not a provider?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors break-words"
                  >
                    Regular Login
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground break-words">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors break-words"
                  >
                    {t("createAccount")}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;
