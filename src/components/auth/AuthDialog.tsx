import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
  redirectTo?: string;
}

export function AuthDialog({ open, onOpenChange, defaultTab = "login", redirectTo }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Update tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Close dialog and redirect when authenticated
  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      
      // Determine where to redirect
      const targetPath = redirectTo || location.state?.from?.pathname || location.pathname || "/dashboard";
      
      // Small delay to ensure dialog closes smoothly
      setTimeout(() => {
        // Only navigate if we're not already on the target path
        if (targetPath !== location.pathname) {
          navigate(targetPath, { replace: true });
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }, 100);
    }
  }, [isAuthenticated, open, navigate, redirectTo, location.state, location.pathname, onOpenChange, toast]);

  const handleLogin = async (values: { email: string; password: string }) => {
    const result = await login(values.email, values.password);
    
    if (!result.success) {
      toast({
        title: "Login failed",
        description: result.error || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (values: { email: string; password: string; name: string; role: "user" | "provider" }) => {
    const result = await signup(values.email, values.password, values.name, values.role);
    
    if (!result.success) {
      toast({
        title: "Sign up failed",
        description: result.error || "Could not create account",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome to Maktabi!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Maktabi</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to continue
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm onSubmit={handleLogin} />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignupForm onSubmit={handleSignup} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
