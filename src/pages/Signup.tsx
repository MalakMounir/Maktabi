import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Lock, Phone, Eye, EyeOff, Shield, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { LanguageToggle } from "@/components/system/LanguageToggle";

// Password strength calculation factory that accepts translations
const createPasswordStrengthCalculator = (t: (key: string) => string) => {
  return (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 1, label: t("passwordStrengthWeak"), color: "text-destructive" };
    if (strength <= 2) return { strength: 2, label: t("passwordStrengthMedium"), color: "text-warning" };
    if (strength <= 3) return { strength: 3, label: t("passwordStrengthGood"), color: "text-primary" };
    return { strength: 4, label: t("passwordStrengthStrong"), color: "text-success" };
  };
};

// Create validation schema factory that accepts translations
const createSignupSchema = (t: (key: string) => string) => z.object({
  fullName: z
    .string()
    .min(2, t("fullNameRequired"))
    .regex(/^[\u0600-\u06FF\sA-Za-z]+$/, t("fullNameInvalid")),
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
  password: z
    .string()
    .min(6, t("passwordMinLength"))
    .refine(
      (val) => val.length >= 6,
      {
        message: t("passwordMinLength"),
      }
    ),
  confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: t("acceptTermsError"),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("passwordsDoNotMatch"),
  path: ["confirmPassword"],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale, dir } = useLocale();

  const isRTL = dir === "rtl";

  // Create schema and password strength calculator with current translations
  const signupSchema = createSignupSchema(t);
  const getPasswordStrength = createPasswordStrengthCalculator(t);

  type SignupFormValues = z.infer<typeof signupSchema>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange", // Enable real-time validation
  });

  // Watch password for strength indicator
  const passwordValue = form.watch("password");
  const passwordStrength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue, locale]);

  const handleSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);

    try {
      // Determine if input is email or phone
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrPhone);
      
      // For phone numbers, convert to email format for the auth system
      const signupIdentifier = isEmail 
        ? values.emailOrPhone 
        : `phone_${values.emailOrPhone.replace(/\D/g, "")}@maktabi.local`;

      const result = await signup(signupIdentifier, values.password, values.fullName, "user");

      if (!result.success) {
        toast({
          title: t("signupError"),
          description: result.error || t("signupErrorDescription"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to role selection
      toast({
        title: t("signupSuccess"),
        description: t("signupSuccessDescription"),
      });
      
      // Navigate to role selection after signup
      navigate("/role-selection", { replace: true });
    } catch (error) {
      toast({
        title: t("unexpectedError"),
        description: t("unexpectedErrorDescription"),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "apple") => {
    toast({
      title: t("comingSoon"),
      description: provider === "google" ? t("googleSignupComingSoon") : t("appleSignupComingSoon"),
    });
  };

  const getInputType = (value: string) => {
    if (!value) return "text";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "email" : "tel";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 py-8 relative">
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
          <h1 className="text-3xl font-bold text-foreground mb-2 break-words">{t("createAccountTitle")}</h1>
          <p className="text-muted-foreground break-words">{t("signupSubtitle")}</p>
        </div>

        {/* Trust Indicators */}
        <div className={`flex items-center justify-center gap-4 sm:gap-6 mb-6 p-4 bg-card/50 rounded-xl border border-border/50 ${isRTL ? "flex-row-reverse" : ""}`}>
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

        {/* Signup Form */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5" dir={dir}>
              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold break-words">{t("fullName")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 ${isRTL ? "right-3" : "left-3"}`} />
                        <Input
                          type="text"
                          placeholder={t("fullNamePlaceholder")}
                          className={`h-12 text-base w-full ${isRTL ? "pr-11 text-right" : "pl-11 text-left"} ${form.formState.errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm break-words" />
                  </FormItem>
                )}
              />

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
                    {/* Password Strength Indicator */}
                    {passwordValue && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.strength === 1
                                  ? "w-1/4 bg-destructive"
                                  : passwordStrength.strength === 2
                                  ? "w-2/4 bg-warning"
                                  : passwordStrength.strength === 3
                                  ? "w-3/4 bg-primary"
                                  : "w-full bg-success"
                              }`}
                            />
                          </div>
                          {passwordStrength.label && (
                            <span className={`text-xs font-medium ${passwordStrength.color} whitespace-nowrap`}>
                              {passwordStrength.label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p className={passwordValue.length >= 6 ? "text-success flex items-center gap-1" : ""}>
                            {passwordValue.length >= 6 && <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
                            {passwordValue.length >= 6 ? t("passwordMinLengthMet") : t("passwordMinLengthRequired")}
                          </p>
                          {passwordValue.length >= 8 && (
                            <p className="text-success flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                              {t("passwordRecommendedLength")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <FormMessage className="text-sm break-words" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold break-words">{t("confirmPassword")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10 ${isRTL ? "right-3" : "left-3"}`} />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("confirmPasswordPlaceholder")}
                          className={`h-12 text-base w-full ${isRTL ? "pr-11 pl-10 text-right" : "pl-11 pr-10 text-left"} ${form.formState.errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10 ${isRTL ? "left-3" : "right-3"}`}
                          aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {/* Match indicator */}
                    {field.value && form.watch("password") && (
                      <div className="text-xs">
                        {field.value === form.watch("password") ? (
                          <p className="text-success flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                            {t("passwordsMatch")}
                          </p>
                        ) : (
                          <p className="text-destructive break-words">{t("passwordsDoNotMatch")}</p>
                        )}
                      </div>
                    )}
                    <FormMessage className="text-sm break-words" />
                  </FormItem>
                )}
              />

              {/* Terms and Conditions Checkbox */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-y-0 rounded-md border border-border p-4 bg-muted/30 ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={isRTL ? "ml-2" : "mr-2"}
                      />
                    </FormControl>
                    <div className={`space-y-1 leading-none flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                      <FormLabel className="text-sm font-normal cursor-pointer break-words">
                        {t("acceptTerms")}{" "}
                        <Link to="/terms" className="text-primary hover:underline font-semibold break-words">
                          {t("termsAndConditionsFull")}
                        </Link>{" "}
                        {t("and")}{" "}
                        <Link to="/privacy" className="text-primary hover:underline font-semibold break-words">
                          {t("privacyPolicy")}
                        </Link>
                      </FormLabel>
                      {form.formState.errors.acceptTerms && (
                        <p className={`text-sm text-destructive mt-1 break-words ${isRTL ? "text-right" : "text-left"}`}>
                          {form.formState.errors.acceptTerms.message}
                        </p>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              {/* Primary CTA - Sign Up Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className={`w-full h-12 text-base font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={isRTL ? "mr-2" : "ml-2"}>{t("creatingAccount")}</span>
                ) : (
                  <>
                    <span className="break-words">{t("signup")}</span>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t("or")}</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className={`w-full h-12 text-base font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => handleSocialLogin("google")}
                >
                  <svg className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t("continueWithGoogle")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className={`w-full h-12 text-base font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => handleSocialLogin("apple")}
                >
                  <svg className={`w-5 h-5 flex-shrink-0 ${isRTL ? "ml-2" : "mr-2"}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  {t("continueWithApple")}
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground break-words">
                  {t("alreadyHaveAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors break-words"
                  >
                    {t("login")}
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer Trust Message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground break-words px-2">
            {t("byContinuing")}{" "}
            <Link to="/terms" className="text-primary hover:underline break-words">
              {t("termsAndConditions")}
            </Link>{" "}
            {t("and")}{" "}
            <Link to="/privacy" className="text-primary hover:underline break-words">
              {t("privacyPolicy")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
