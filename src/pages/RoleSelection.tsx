import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, User, Briefcase, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { UserRole } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/system/LanguageToggle";

type RoleOption = {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
};

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, dir } = useLocale();

  const isRTL = dir === "rtl";

  const roleOptions: RoleOption[] = [
    {
      id: "user",
      title: "مستخدم",
      description: "حجز مساحات",
      icon: <User className="w-8 h-8" />,
      features: [
        "احجز مساحات العمل بسهولة",
        "تصفح مئات المساحات المتاحة",
        "إدارة حجوزاتك من مكان واحد",
      ],
    },
    {
      id: "provider",
      title: "صاحب مساحة",
      description: "عرض مساحة",
      icon: <Briefcase className="w-8 h-8" />,
      features: [
        "اعرض مساحتك للآخرين",
        "احصل على دخل إضافي",
        "إدارة حجوزاتك بسهولة",
      ],
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: "يرجى اختيار الدور",
        description: "الرجاء اختيار كيف تريد استخدام مكتبي",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to update the user's role
      // For now, we'll just navigate - the role selection is saved conceptually
      
      // Persist userRole to localStorage
      if (selectedRole === "provider") {
        localStorage.setItem("userRole", "provider");
        localStorage.setItem("providerOnboarded", "false");
      } else {
        localStorage.setItem("userRole", selectedRole);
      }
      
      toast({
        title: "تم الحفظ بنجاح",
        description: `تم تعيين دورك كـ ${selectedRole === "user" ? "مستخدم" : "صاحب مساحة"}`,
      });
      
      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Navigate based on role
      const redirectPath = selectedRole === "provider" ? "/provider/dashboard" : "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Skip and go to default (user dashboard)
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative">
      {/* Language Toggle - Top Right (RTL-aware) */}
      <div className={`absolute top-4 z-10 ${isRTL ? "left-4" : "right-4"}`}>
        <LanguageToggle size="sm" />
      </div>
      <div className="w-full max-w-4xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">{t("brand")}</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-3">مرحباً بك في مكتبي!</h1>
          <p className="text-muted-foreground text-lg">اختر كيف تريد استخدام مكتبي</p>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            تحب تستخدم مكتبي كـ؟
          </h2>
          <p className="text-sm text-muted-foreground">
            يمكنك تغيير هذا الإعداد لاحقاً من إعدادات الملف الشخصي
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {roleOptions.map((option) => {
            const isSelected = selectedRole === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedRole(option.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-right ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } transition-colors`}
                >
                  {option.icon}
                </div>

                {/* Title & Description */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-foreground mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect Indicator */}
                {!isSelected && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-colors pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Button
            variant="cta"
            size="lg"
            className="flex-1 h-12 text-base font-semibold"
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
          >
            {isSubmitting ? (
              "جاري الحفظ..."
            ) : (
              <>
                المتابعة
                <ArrowRight className={`w-5 h-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-12 text-base font-medium"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            تخطي الآن
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            يمكنك تغيير دورك في أي وقت من{" "}
            <Link to="/dashboard" className="text-primary hover:underline font-semibold">
              إعدادات الملف الشخصي
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
