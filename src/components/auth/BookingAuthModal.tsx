import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/i18n/locale";
import { Lock, Shield, AlertCircle, User, ArrowRight } from "lucide-react";

interface BookingAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestContinue?: () => void;
  defaultTab?: "login" | "signup";
}

export function BookingAuthModal({ 
  open, 
  onOpenChange, 
  onGuestContinue,
  defaultTab = "login" 
}: BookingAuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, dir } = useLocale();
  const isRTL = dir === "rtl";

  // Update tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Close dialog when authenticated
  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      
      // Small delay to ensure dialog closes smoothly
      setTimeout(() => {
        toast({
          title: t("welcomeBackBooking"),
          description: t("canNowConfirmBooking"),
        });
      }, 100);
    }
  }, [isAuthenticated, open, onOpenChange, toast]);

  const handleLogin = async (values: { email: string; password: string }) => {
    const result = await login(values.email, values.password);
    
    if (!result.success) {
      toast({
        title: t("loginError"),
        description: result.error || t("loginErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (values: { email: string; password: string; name: string; role: "user" | "provider" }) => {
    const result = await signup(values.email, values.password, values.name, values.role);
    
    if (!result.success) {
      toast({
        title: t("signupError"),
        description: result.error || t("signupErrorDescription"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("signupSuccess"),
        description: t("signupSuccessDescription"),
      });
    }
  };

  const handleGuestContinue = () => {
    if (onGuestContinue) {
      onGuestContinue();
      onOpenChange(false);
      toast({
        title: t("guestContinueTitle"),
        description: t("guestContinueDescription"),
        variant: "default",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir={dir}>
        <DialogHeader className={isRTL ? "text-right" : "text-left"}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl break-words">{t("loginRequired")}</DialogTitle>
              <DialogDescription className="mt-1 break-words">
                {t("loginToCompleteBooking")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Why Login Required */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border">
          <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className={`space-y-2 text-sm flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <p className="font-semibold text-foreground break-words">{t("whyLoginRequired")}</p>
              <ul className={`space-y-1.5 text-muted-foreground list-disc ${isRTL ? "list-inside" : "list-inside"}`} dir={dir}>
                <li className="break-words">{t("loginReason1")}</li>
                <li className="break-words">{t("loginReason2")}</li>
                <li className="break-words">{t("loginReason3")}</li>
                <li className="break-words">{t("loginReason4")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`flex items-center justify-center gap-4 mb-4 p-3 bg-card/50 rounded-lg border border-border/50 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-success flex-shrink-0" />
            <span className="whitespace-nowrap break-keep">{t("secureAndProtected")}</span>
          </div>
          <div className="h-4 w-px bg-border flex-shrink-0" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="whitespace-nowrap break-keep">{t("sslEncryption")}</span>
          </div>
        </div>

        {/* Auth Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full" dir={dir}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="break-words">{t("login")}</TabsTrigger>
            <TabsTrigger value="signup" className="break-words">{t("signup")}</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm onSubmit={handleLogin} />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignupForm onSubmit={handleSignup} />
          </TabsContent>
        </Tabs>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
          </div>
        </div>

        {/* Guest Continue Option */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={`w-full h-11 text-sm font-medium ${isRTL ? "flex-row-reverse" : ""}`}
            onClick={handleGuestContinue}
          >
            <User className={`w-4 h-4 flex-shrink-0 ${isRTL ? "ml-2" : "mr-2"}`} />
            <span className="break-words">{t("continueAsGuestLimited")}</span>
          </Button>
          
          <p className="text-xs text-muted-foreground text-center break-words">
            {t("guestContinueDescription")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
