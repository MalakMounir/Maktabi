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
import { Building2, Mail, Lock, Shield, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { LanguageToggle } from "@/components/system/LanguageToggle";

// Admin login schema - email only, no phone
const adminLoginSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// 2FA schema
const twoFactorSchema = z.object({
  code: z.string().length(6, "رمز التحقق يجب أن يكون 6 أرقام"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

const AdminLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const { login, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { dir } = useLocale();
  const isRTL = dir === "rtl";

  const loginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (values: AdminLoginFormValues) => {
    setIsSubmitting(true);
    setAdminEmail(values.email);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await login(values.email, values.password);

      if (!result.success) {
        toast({
          title: "فشل تسجيل الدخول",
          description: result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if user has admin role
      if (!hasRole("admin")) {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحية للوصول إلى لوحة التحكم",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // For demo: Show 2FA step (in production, this would be triggered by the API)
      // Simulate 2FA requirement
      setIsSubmitting(false);
      setShowTwoFactor(true);
      toast({
        title: "تم إرسال رمز التحقق",
        description: "يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني",
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleTwoFactor = async (values: TwoFactorFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate 2FA verification
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In production, verify 2FA code with API
      // For demo, accept any 6-digit code
      if (values.code.length === 6) {
        toast({
          title: "تم التحقق بنجاح",
          description: "مرحباً بك في لوحة التحكم",
        });

        // Redirect to admin dashboard
        const redirectTo = location.state?.from?.pathname || "/admin";
        navigate(redirectTo, { replace: true });
      } else {
        toast({
          title: "رمز التحقق غير صحيح",
          description: "يرجى إدخال رمز التحقق الصحيح",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    toast({
      title: "تم إعادة الإرسال",
      description: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني",
    });
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    twoFactorForm.reset();
  };

  // Two-Factor Authentication Screen
  if (showTwoFactor) {
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
              <span className="text-2xl font-bold text-foreground">مكتبي</span>
            </Link>
          </div>

          {/* 2FA Form */}
          <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">التحقق بخطوتين</h1>
              <p className="text-muted-foreground text-sm">
                تم إرسال رمز التحقق إلى
              </p>
              <p className="font-medium text-foreground mt-1">{adminEmail}</p>
            </div>

            <Form {...twoFactorForm}>
              <form onSubmit={twoFactorForm.handleSubmit(handleTwoFactor)} className="space-y-5">
                <FormField
                  control={twoFactorForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">رمز التحقق</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="000000"
                          className="h-14 text-2xl text-center font-mono tracking-widest"
                          {...field}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                      <p className="text-xs text-muted-foreground mt-1">
                        أدخل رمز التحقق المكون من 6 أرقام
                      </p>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isSubmitting || twoFactorForm.watch("code")?.length !== 6}
                >
                  {isSubmitting ? "جاري التحقق..." : "التحقق"}
                </Button>

                <div className="text-center pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    العودة لتسجيل الدخول
                  </button>
                </div>
              </form>
            </Form>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              لم تستلم الرمز؟ تحقق من مجلد الرسائل غير المرغوب فيها
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Login Screen
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
            <span className="text-2xl font-bold text-foreground">مكتبي</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          </div>
          <p className="text-muted-foreground text-sm">تسجيل الدخول للموظفين والمسؤولين</p>
        </div>

        {/* Security Warning */}
        <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">منطقة محمية</p>
              <p className="text-xs text-muted-foreground">
                هذا القسم مخصص للموظفين والمسؤولين فقط. الوصول غير المصرح به محظور.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@maktabi.com"
                          className="h-12 text-base pr-11 text-right"
                          dir="rtl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="أدخل كلمة المرور"
                          className="h-12 text-base pr-11 text-right"
                          dir="rtl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "جاري تسجيل الدخول..."
                ) : (
                  <>
                    تسجيل الدخول
                    <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Security Features */}
        <div className="mt-6 flex items-center justify-center gap-4 p-4 bg-card/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-success" />
            <span>تشفير SSL</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-4 h-4 text-primary" />
            <span>التحقق بخطوتين</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى تسجيل الدخول العادي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
