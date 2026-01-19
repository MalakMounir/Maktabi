import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

type LocaleContextValue = {
  locale: Locale;
  dir: Direction;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "maktabi.locale";

const STRINGS: Record<Locale, Record<string, string>> = {
  ar: {
    brand: "مكتبي",
    search: "بحث",
    searchShortcut: "بحث سريع",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    findSpaces: "ابحث عن مساحات",
    myBookings: "حجوزاتي",
    listYourSpace: "أدرج مساحتك",
    corporate: "حسابات الشركات",
    available: "متاح",
    limited: "محدود",
    fullyBooked: "مكتمل الحجز",
    unavailable: "غير متاح",
    perHour: "/ ساعة",
    people: "أشخاص",
    person: "شخص",
    emptyTitle: "لا توجد نتائج",
    emptyDescription: "جرّب تغيير الفلاتر أو البحث في موقع آخر.",
    successTitle: "تم بنجاح",
    errorTitle: "حدث خطأ",
    // Login page translations
    welcomeBack: "مرحباً بك",
    loginSubtitle: "سجل الدخول للمتابعة إلى مكتبي",
    emailOrPhone: "البريد الإلكتروني أو رقم الهاتف",
    emailOrPhonePlaceholder: "example@email.com أو 05xxxxxxxx",
    emailOrPhoneRequired: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف",
    emailOrPhoneInvalid: "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح",
    password: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    passwordRequired: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    passwordMinLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    forgotPassword: "نسيت كلمة المرور؟",
    loggingIn: "جاري تسجيل الدخول...",
    continueAsGuest: "المتابعة كضيف",
    or: "أو",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب جديد",
    secureAndProtected: "آمن ومحمي",
    sslEncryption: "تشفير SSL",
    loginError: "فشل تسجيل الدخول",
    loginErrorDescription: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    loginSuccess: "مرحباً بعودتك!",
    loginSuccessDescription: "تم تسجيل الدخول بنجاح",
    unexpectedError: "حدث خطأ",
    unexpectedErrorDescription: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
    termsAndConditions: "شروط الخدمة",
    privacyPolicy: "سياسة الخصوصية",
    byContinuing: "بمتابعتك، أنت توافق على",
    and: "و",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    // Sign Up page translations
    createAccountTitle: "إنشاء حساب جديد",
    signupSubtitle: "انضم إلى مكتبي وابدأ رحلتك",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك الكامل",
    fullNameRequired: "الاسم يجب أن يكون حرفين على الأقل",
    fullNameInvalid: "الاسم يجب أن يحتوي على أحرف فقط",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
    confirmPasswordRequired: "يرجى تأكيد كلمة المرور",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة",
    passwordsMatch: "كلمات المرور متطابقة",
    acceptTerms: "أوافق على",
    termsAndConditionsFull: "الشروط والأحكام",
    acceptTermsError: "يجب الموافقة على الشروط وسياسة الخصوصية",
    creatingAccount: "جاري إنشاء الحساب...",
    signupError: "فشل إنشاء الحساب",
    signupErrorDescription: "حدث خطأ أثناء إنشاء الحساب",
    signupSuccess: "مرحباً بك في مكتبي!",
    signupSuccessDescription: "تم إنشاء حسابك بنجاح",
    comingSoon: "قريباً",
    googleSignupComingSoon: "تسجيل الدخول عبر جوجل سيكون متاحاً قريباً",
    appleSignupComingSoon: "تسجيل الدخول عبر آبل سيكون متاحاً قريباً",
    continueWithGoogle: "المتابعة مع Google",
    continueWithApple: "المتابعة مع Apple",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    // Password strength indicators
    passwordStrengthWeak: "ضعيف",
    passwordStrengthMedium: "متوسط",
    passwordStrengthGood: "جيد",
    passwordStrengthStrong: "قوي",
    passwordMinLengthRequired: "يجب أن تكون 6 أحرف على الأقل",
    passwordMinLengthMet: "6 أحرف على الأقل",
    passwordRecommendedLength: "8 أحرف أو أكثر (موصى به)",
    // Forgot Password page translations
    forgotPasswordTitle: "نسيت كلمة المرور؟",
    forgotPasswordSubtitle: "لا تقلق، سنرسل لك رابط إعادة تعيين كلمة المرور",
    sendResetLink: "إرسال رابط إعادة التعيين",
    sending: "جاري الإرسال...",
    resetLinkSent: "تم إرسال رابط إعادة تعيين كلمة المرور",
    resetLinkSentDescription: "تحقق من بريدك الإلكتروني أو رسائلك",
    backToLogin: "العودة لتسجيل الدخول",
    didntReceiveMessage: "لم تستلم الرسالة؟",
    tryAgain: "إعادة المحاولة",
    ifNotReceived: "إذا لم تستلم الرسالة:",
    checkSpam: "تحقق من مجلد الرسائل غير المرغوب فيها",
    verifyEmail: "تأكد من صحة البريد الإلكتروني المدخل",
    verifyPhone: "تأكد من صحة رقم الهاتف المدخل",
    waitAndRetry: "انتظر بضع دقائق ثم حاول مرة أخرى",
    resetLinkWillBeSentTo: "سنرسل رابط إعادة تعيين كلمة المرور إلى",
    toYourEmail: "بريدك الإلكتروني",
    toYourPhone: "رقم هاتفك",
    weProtectYourInfo: "نضمن حماية معلوماتك الشخصية وفقاً ل",
    // Booking Auth Modal translations
    loginRequired: "تسجيل الدخول مطلوب",
    loginRequiredDescription: "لتأكيد حجزك، يرجى تسجيل الدخول أو إنشاء حساب جديد",
    loginToCompleteBooking: "يجب تسجيل الدخول لإتمام الحجز",
    whyLoginRequired: "لماذا نحتاج تسجيل الدخول؟",
    loginReason1: "حماية معلومات الحجز الخاصة بك",
    loginReason2: "إدارة حجوزاتك من مكان واحد",
    loginReason3: "تلقي تأكيدات الحجز والتحديثات",
    loginReason4: "سهولة إعادة الحجز في المستقبل",
    continueAsGuestLimited: "المتابعة كضيف (محدود)",
    guestContinueDescription: "المتابعة كضيف تسمح لك بإكمال الحجز، لكن لن تتمكن من إدارة حجوزاتك لاحقاً",
    welcomeBackBooking: "مرحباً بعودتك!",
    canNowConfirmBooking: "يمكنك الآن تأكيد حجزك",
    guestContinueTitle: "متابعة كضيف",
    guestContinueDescription: "يمكنك المتابعة، لكن بعض الميزات قد تكون محدودة",
  },
  en: {
    brand: "Maktabi",
    search: "Search",
    searchShortcut: "Quick search",
    login: "Login",
    signup: "Sign up",
    findSpaces: "Find spaces",
    myBookings: "My bookings",
    listYourSpace: "List your space",
    corporate: "Corporate",
    available: "Available",
    limited: "Limited",
    fullyBooked: "Fully booked",
    unavailable: "Unavailable",
    perHour: "/ hour",
    people: "people",
    person: "person",
    emptyTitle: "No results",
    emptyDescription: "Try adjusting filters or searching a different location.",
    successTitle: "Success",
    errorTitle: "Something went wrong",
    // Login page translations
    welcomeBack: "Welcome back",
    loginSubtitle: "Sign in to continue to Maktabi",
    emailOrPhone: "Email or Phone",
    emailOrPhonePlaceholder: "example@email.com or 05xxxxxxxx",
    emailOrPhoneRequired: "Please enter your email or phone number",
    emailOrPhoneInvalid: "Please enter a valid email or phone number",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    passwordRequired: "Password must be at least 6 characters",
    passwordMinLength: "Password must be at least 6 characters",
    forgotPassword: "Forgot password?",
    loggingIn: "Logging in...",
    continueAsGuest: "Continue as Guest",
    or: "or",
    noAccount: "Don't have an account?",
    createAccount: "Create new account",
    secureAndProtected: "Secure & Protected",
    sslEncryption: "SSL Encryption",
    loginError: "Login failed",
    loginErrorDescription: "Email or password is incorrect",
    loginSuccess: "Welcome back!",
    loginSuccessDescription: "Successfully logged in",
    unexpectedError: "An error occurred",
    unexpectedErrorDescription: "An unexpected error occurred. Please try again",
    termsAndConditions: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    byContinuing: "By continuing, you agree to",
    and: "and",
    showPassword: "Show password",
    hidePassword: "Hide password",
    // Sign Up page translations
    createAccountTitle: "Create new account",
    signupSubtitle: "Join Maktabi and start your journey",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    fullNameRequired: "Name must be at least 2 characters",
    fullNameInvalid: "Name must contain only letters",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match",
    passwordsMatch: "Passwords match",
    acceptTerms: "I agree to",
    termsAndConditionsFull: "Terms and Conditions",
    acceptTermsError: "You must agree to the Terms and Privacy Policy",
    creatingAccount: "Creating account...",
    signupError: "Account creation failed",
    signupErrorDescription: "An error occurred while creating your account",
    signupSuccess: "Welcome to Maktabi!",
    signupSuccessDescription: "Your account has been created successfully",
    comingSoon: "Coming soon",
    googleSignupComingSoon: "Sign in with Google will be available soon",
    appleSignupComingSoon: "Sign in with Apple will be available soon",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    alreadyHaveAccount: "Already have an account?",
    // Password strength indicators
    passwordStrengthWeak: "Weak",
    passwordStrengthMedium: "Medium",
    passwordStrengthGood: "Good",
    passwordStrengthStrong: "Strong",
    passwordMinLengthRequired: "Must be at least 6 characters",
    passwordMinLengthMet: "At least 6 characters",
    passwordRecommendedLength: "8 characters or more (recommended)",
    // Forgot Password page translations
    forgotPasswordTitle: "Forgot password?",
    forgotPasswordSubtitle: "Don't worry, we'll send you a password reset link",
    sendResetLink: "Send reset link",
    sending: "Sending...",
    resetLinkSent: "Password reset link has been sent",
    resetLinkSentDescription: "Check your email or messages",
    backToLogin: "Back to login",
    didntReceiveMessage: "Didn't receive the message?",
    tryAgain: "Try again",
    ifNotReceived: "If you didn't receive the message:",
    checkSpam: "Check your spam folder",
    verifyEmail: "Verify the email address you entered",
    verifyPhone: "Verify the phone number you entered",
    waitAndRetry: "Wait a few minutes and try again",
    resetLinkWillBeSentTo: "We'll send a password reset link to",
    toYourEmail: "your email",
    toYourPhone: "your phone",
    weProtectYourInfo: "We protect your personal information according to",
    // Booking Auth Modal translations
    loginRequired: "Login Required",
    loginRequiredDescription: "To confirm your booking, please sign in or create a new account",
    loginToCompleteBooking: "Please log in to complete your booking",
    whyLoginRequired: "Why do we need login?",
    loginReason1: "Protect your booking information",
    loginReason2: "Manage your bookings from one place",
    loginReason3: "Receive booking confirmations and updates",
    loginReason4: "Easy re-booking in the future",
    continueAsGuestLimited: "Continue as Guest (Limited)",
    guestContinueDescription: "Continuing as guest allows you to complete the booking, but you won't be able to manage your bookings later",
    welcomeBackBooking: "Welcome back!",
    canNowConfirmBooking: "You can now confirm your booking",
    guestContinueTitle: "Continue as guest",
    guestContinueDescription: "You can continue, but some features may be limited",
  },
};

function normalizeLocale(input: unknown): Locale {
  if (input === "ar" || input === "en") return input;
  return "ar";
}

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeLocale(stored);
  } catch {
    // ignore
  }

  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return nav?.toLowerCase().startsWith("ar") ? "ar" : "ar";
}

function applyDocumentLocale(locale: Locale) {
  const dir: Direction = locale === "ar" ? "rtl" : "ltr";
  const html = document.documentElement;
  html.setAttribute("lang", locale);
  html.setAttribute("dir", dir);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const dir: Direction = locale === "ar" ? "rtl" : "ltr";
    const dict = STRINGS[locale];
    return {
      locale,
      dir,
      setLocale,
      toggleLocale,
      t: (key: string) => dict[key] ?? key,
    };
  }, [locale, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

