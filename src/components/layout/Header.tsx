import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Building2, Search, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { LanguageToggle } from "@/components/system/LanguageToggle";
import { useLocale } from "@/i18n/locale";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"login" | "signup">("login");
  const location = useLocation();
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { href: "/search", key: "findSpaces" as const },
    { href: "/dashboard", key: "myBookings" as const },
    { href: "/provider", key: "listYourSpace" as const },
    { href: "/corporate", key: "corporate" as const },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLoginClick = () => {
    // Navigate to login page instead of opening dialog
    navigate("/login", { state: { from: location } });
  };

  const handleSignupClick = () => {
    // Navigate to signup page instead of opening dialog
    navigate("/signup", { state: { from: location } });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin";
    if (user.role === "provider") return "/provider";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="md" showText={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/search">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                {t("searchShortcut")}
              </Button>
            </Link>
            <LanguageToggle size="sm" />
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{user?.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardPath()}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleLoginClick}>
                  {t("login")}
                </Button>
                <Button variant="default" size="sm" onClick={handleSignupClick}>
                  {t("signup")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
              <Link
                to="/search"
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                {t("search")}
              </Link>
              <div className="flex gap-2 px-4 pt-4 border-t border-border mt-2">
                <LanguageToggle size="sm" />
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="px-2 py-1 text-sm">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link to={getDashboardPath()} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleLoginClick}>
                      <User className="w-4 h-4" />
                      {t("login")}
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" onClick={handleSignupClick}>
                      {t("signup")}
                    </Button>
                  </>
                )}
              </div>
              <div className="px-4 pt-3 text-xs text-muted-foreground">
                {locale === "ar" ? "اللغة: العربية" : "Language: English"}
              </div>
            </nav>
          </div>
        )}
      </div>
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
        redirectTo={location.pathname}
      />
    </header>
  );
};

export default Header;
