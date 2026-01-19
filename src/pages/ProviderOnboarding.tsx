import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { spaceTypes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, FileCheck, IdCard, ShieldCheck, Sparkles, Store, TrendingUp } from "lucide-react";

type StepId = "provider" | "spaceType" | "pricing" | "availability" | "verification";

type VerificationStatus = "not_started" | "in_progress" | "submitted" | "in_review" | "verified";

const STEPS: { id: StepId; title: string; description: string }[] = [
  {
    id: "provider",
    title: "Provider information",
    description: "Tell us who you are. We’ll use this to build trust with guests.",
  },
  {
    id: "spaceType",
    title: "Space type selection",
    description: "Choose what you’re listing so we can guide the rest of setup.",
  },
  {
    id: "pricing",
    title: "Pricing setup",
    description: "Set a clear price guests can understand at a glance.",
  },
  {
    id: "availability",
    title: "Availability setup",
    description: "Pick the days and hours you’re open for bookings.",
  },
  {
    id: "verification",
    title: "Verification status",
    description: "Complete a quick checklist to help guests book with confidence.",
  },
];

const WEEK_DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusBadge(status: VerificationStatus) {
  const cfg: Record<
    VerificationStatus,
    { label: string; className: string }
  > = {
    not_started: { label: "Not started", className: "bg-muted text-muted-foreground border-border" },
    in_progress: { label: "In progress", className: "bg-warning/10 text-warning border-warning/20" },
    submitted: { label: "Submitted", className: "bg-primary/10 text-primary border-primary/20" },
    in_review: { label: "In review", className: "bg-primary/10 text-primary border-primary/20" },
    verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
  };
  const s = cfg[status];
  return (
    <Badge variant="outline" className={cn("border", s.className)}>
      {s.label}
    </Badge>
  );
}

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);

  // Step 1: Provider info
  const [providerName, setProviderName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");

  // Step 2: Space type
  const [spaceType, setSpaceType] = useState<string>("desk");
  const selectedType = useMemo(() => spaceTypes.find((t) => t.id === spaceType), [spaceType]);

  // Step 3: Pricing
  const [currency, setCurrency] = useState<"AED" | "SAR" | "QAR" | "KWD" | "BHD" | "OMR">("AED");
  const [pricePerHour, setPricePerHour] = useState<number>(75);
  const [cleaningFee, setCleaningFee] = useState<number>(0);
  const [minHours, setMinHours] = useState<number>(1);

  // Step 4: Availability
  const [daysOpen, setDaysOpen] = useState<Record<(typeof WEEK_DAYS)[number]["key"], boolean>>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  });
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("18:00");

  // Step 5: Verification
  const [verification, setVerification] = useState<{
    identity: VerificationStatus;
    business: VerificationStatus;
    spaceProof: VerificationStatus;
    payout: VerificationStatus;
  }>({
    identity: "not_started",
    business: "not_started",
    spaceProof: "not_started",
    payout: "not_started",
  });

  const step = STEPS[stepIdx];
  const progressValue = ((stepIdx + 1) / STEPS.length) * 100;

  const openDaysCount = useMemo(() => Object.values(daysOpen).filter(Boolean).length, [daysOpen]);
  const hoursPerDay = useMemo(() => {
    const [oh, om] = openTime.split(":").map(Number);
    const [ch, cm] = closeTime.split(":").map(Number);
    const openM = oh * 60 + om;
    const closeM = ch * 60 + cm;
    const minutes = Math.max(0, closeM - openM);
    return minutes / 60;
  }, [openTime, closeTime]);

  const earnings = useMemo(() => {
    // Simple, trust-building assumptions (clearly shown in UI):
    // - utilization varies by space type (meeting rooms fill slightly higher)
    // - average bookable hours per week derived from availability
    const utilizationByType: Record<string, number> = {
      desk: 0.28,
      meeting_room: 0.35,
      private_office: 0.32,
      event_space: 0.18,
    };
    const utilization = utilizationByType[spaceType] ?? 0.28;
    const weeklyBookableHours = openDaysCount * hoursPerDay;
    const estimatedWeeklyBookedHours = weeklyBookableHours * utilization;
    const grossWeekly = estimatedWeeklyBookedHours * pricePerHour;
    const grossMonthly = grossWeekly * 4.33;
    const feesMonthly = cleaningFee * (estimatedWeeklyBookedHours / Math.max(1, minHours)) * 4.33 * 0.15; // very rough: cleaning in ~15% of bookings
    const netMonthly = Math.max(0, grossMonthly - feesMonthly);

    return {
      utilization,
      weeklyBookableHours,
      estimatedWeeklyBookedHours,
      grossMonthly,
      netMonthly,
    };
  }, [cleaningFee, hoursPerDay, minHours, openDaysCount, pricePerHour, spaceType]);

  const completedSteps = useMemo(() => {
    // We keep this intentionally gentle: “complete enough to proceed”.
    const providerOk = providerName.trim().length > 1 && email.trim().length > 3;
    const typeOk = !!selectedType;
    const pricingOk = pricePerHour > 0 && minHours >= 1;
    const availabilityOk = openDaysCount > 0 && hoursPerDay > 0;
    const verificationOk = Object.values(verification).every((s) => s === "verified" || s === "in_review");
    return { providerOk, typeOk, pricingOk, availabilityOk, verificationOk };
  }, [email, hoursPerDay, minHours, openDaysCount, pricePerHour, providerName, selectedType, verification]);

  function canContinue() {
    switch (step.id) {
      case "provider":
        return completedSteps.providerOk;
      case "spaceType":
        return completedSteps.typeOk;
      case "pricing":
        return completedSteps.pricingOk;
      case "availability":
        return completedSteps.availabilityOk;
      case "verification":
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    setStepIdx((i) => clamp(i + 1, 0, STEPS.length - 1));
  }
  function goBack() {
    setStepIdx((i) => clamp(i - 1, 0, STEPS.length - 1));
  }

  function submitVerification() {
    // Client-side: simulate submission & review.
    setVerification((v) => ({
      identity: v.identity === "verified" ? "verified" : "in_review",
      business: v.business === "verified" ? "verified" : "in_review",
      spaceProof: v.spaceProof === "verified" ? "verified" : "in_review",
      payout: v.payout === "verified" ? "verified" : "in_review",
    }));
  }

  return (
    <Layout hideFooter>
      <div className="bg-muted min-h-screen">
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/90 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Provider onboarding</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">List your space with confidence</h1>
                <p className="text-primary-foreground/80 mt-1 max-w-2xl">
                  A simple setup that builds trust for guests and helps you start earning quickly.
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/provider/dashboard">
                  <Button variant="hero-secondary">Back to dashboard</Button>
                </Link>
                <Button variant="hero-secondary" onClick={() => navigate("/")}>
                  Home
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  Step {stepIdx + 1} of {STEPS.length}: {step.title}
                </p>
                <p className="text-sm text-primary-foreground/70">{Math.round(progressValue)}%</p>
              </div>
              <Progress value={progressValue} className="h-2 bg-primary-foreground/20" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left: steps */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-xl">Your setup</CardTitle>
                <CardDescription>Clear steps, no surprises.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {STEPS.map((s, idx) => {
                  const isActive = idx === stepIdx;
                  const isDone =
                    (s.id === "provider" && completedSteps.providerOk) ||
                    (s.id === "spaceType" && completedSteps.typeOk) ||
                    (s.id === "pricing" && completedSteps.pricingOk) ||
                    (s.id === "availability" && completedSteps.availabilityOk) ||
                    (s.id === "verification" && completedSteps.verificationOk);

                  return (
                    <button
                      key={s.id}
                      onClick={() => setStepIdx(idx)}
                      className={cn(
                        "w-full text-left rounded-lg border p-4 transition-colors",
                        isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <Circle className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("font-medium", isActive ? "text-foreground" : "text-foreground")}>
                              {s.title}
                            </p>
                            {isDone ? (
                              <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                                Done
                              </Badge>
                            ) : isActive ? (
                              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                                Current
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" onClick={goBack} disabled={stepIdx === 0}>
                  Back
                </Button>
                {step.id !== "verification" ? (
                  <Button onClick={goNext} disabled={!canContinue()}>
                    Continue
                  </Button>
                ) : (
                  <Link to="/provider/dashboard">
                    <Button 
                      variant="cta"
                      onClick={() => {
                        // Mark provider as onboarded when finishing onboarding
                        localStorage.setItem("providerOnboarded", "true");
                      }}
                    >
                      Finish & go to dashboard
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            {/* Middle: step content */}
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {step.id === "provider" && (
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="providerName">Full name</Label>
                        <Input
                          id="providerName"
                          value={providerName}
                          onChange={(e) => setProviderName(e.target.value)}
                          placeholder="e.g., Ahmed Al Noor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business / venue name</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g., Marina Cowork"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g., Dubai"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="about">About your space (optional)</Label>
                      <Textarea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="A short, friendly description helps guests feel confident."
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: mention what makes your space reliable (quiet, fast Wi‑Fi, easy parking, responsive support).
                      </p>
                    </div>
                  </div>
                )}

                {step.id === "spaceType" && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label>Space type</Label>
                      <Select value={spaceType} onValueChange={(v) => setSpaceType(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a space type" />
                        </SelectTrigger>
                        <SelectContent>
                          {spaceTypes.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <Store className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">We’ll tailor recommendations</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on your selection, we’ll suggest pricing ranges and booking rules that match guest expectations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm text-muted-foreground">Selected</p>
                        <p className="font-semibold mt-1">{selectedType?.label ?? "—"}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          You can add more space types later from your dashboard.
                        </p>
                      </div>
                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm text-muted-foreground">Trust signal</p>
                        <p className="font-semibold mt-1">Clear listing category</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Guests book faster when the space type matches the photos and amenities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {step.id === "pricing" && (
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["AED", "SAR", "QAR", "KWD", "BHD", "OMR"].map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pricePerHour">Price per hour</Label>
                        <Input
                          id="pricePerHour"
                          type="number"
                          min={0}
                          value={pricePerHour}
                          onChange={(e) => setPricePerHour(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minHours">Minimum hours</Label>
                        <Input
                          id="minHours"
                          type="number"
                          min={1}
                          value={minHours}
                          onChange={(e) => setMinHours(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cleaningFee">Cleaning fee (optional)</Label>
                        <Input
                          id="cleaningFee"
                          type="number"
                          min={0}
                          value={cleaningFee}
                          onChange={(e) => setCleaningFee(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Keep it simple</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Transparent pricing builds trust. You can always refine later based on demand.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step.id === "availability" && (
                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block">Days open</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {WEEK_DAYS.map((d) => (
                          <label
                            key={d.key}
                            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
                          >
                            <Checkbox
                              checked={daysOpen[d.key]}
                              onCheckedChange={(checked) =>
                                setDaysOpen((prev) => ({ ...prev, [d.key]: Boolean(checked) }))
                              }
                            />
                            <span className="text-sm">{d.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openTime">Open time</Label>
                        <Input id="openTime" type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="closeTime">Close time</Label>
                        <Input
                          id="closeTime"
                          type="time"
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Guest-friendly availability</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            More open hours usually means more bookings. Start with what you can reliably support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step.id === "verification" && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Verification helps you win bookings</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Guests trust verified providers. Complete these items to improve ranking and conversion.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(
                        [
                          {
                            key: "identity",
                            title: "Identity",
                            subtitle: "Government ID or passport",
                            icon: <IdCard className="w-5 h-5 text-primary" />,
                          },
                          {
                            key: "business",
                            title: "Business details",
                            subtitle: "Trade license or proof of operation",
                            icon: <FileCheck className="w-5 h-5 text-primary" />,
                          },
                          {
                            key: "spaceProof",
                            title: "Space ownership / access",
                            subtitle: "Lease or authorization document",
                            icon: <Store className="w-5 h-5 text-primary" />,
                          },
                          {
                            key: "payout",
                            title: "Payout setup",
                            subtitle: "Bank details for earnings",
                            icon: <TrendingUp className="w-5 h-5 text-primary" />,
                          },
                        ] as const
                      ).map((item) => (
                        <div key={item.key} className="rounded-xl border border-border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">{item.icon}</div>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                              </div>
                            </div>
                            {statusBadge(verification[item.key])}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVerification((v) => ({ ...v, [item.key]: "in_progress" }))}
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVerification((v) => ({ ...v, [item.key]: "submitted" }))}
                            >
                              Mark submitted
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setVerification((v) => ({ ...v, [item.key]: "verified" }))}
                            >
                              Mark verified
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Submit for review</p>
                          <p className="text-sm text-muted-foreground">We typically review within 1–2 business days.</p>
                        </div>
                      </div>
                      <Button onClick={submitVerification}>Submit</Button>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" onClick={goBack} disabled={stepIdx === 0}>
                  Back
                </Button>
                {step.id !== "verification" ? (
                  <Button onClick={goNext} disabled={!canContinue()}>
                    Continue
                  </Button>
                ) : (
                  <Link to="/provider/dashboard">
                    <Button 
                      variant="cta"
                      onClick={() => {
                        // Mark provider as onboarded when finishing onboarding
                        localStorage.setItem("providerOnboarded", "true");
                      }}
                    >
                      Finish
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            {/* Right: earnings preview + trust */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Earnings potential</CardTitle>
                  <CardDescription>A realistic preview based on your inputs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">Estimated monthly (gross)</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(earnings.grossMonthly, currency)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on ~{Math.round(earnings.utilization * 100)}% utilization for {selectedType?.label ?? "your space"}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Estimated monthly (after assumptions)</p>
                    <p className="text-xl font-semibold mt-1">{formatCurrency(earnings.netMonthly, currency)}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <div>
                        <p className="font-medium text-foreground">Availability</p>
                        <p>
                          {openDaysCount} days/week • {hoursPerDay.toFixed(1)} hrs/day
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Pricing</p>
                        <p>
                          {formatCurrency(pricePerHour, currency)}/hr • min {minHours}h
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Trust = bookings</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Verified listings and clear rules typically convert better.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Verification checklist</CardTitle>
                  <CardDescription>Track where you are, at a glance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Identity", status: verification.identity },
                    { label: "Business details", status: verification.business },
                    { label: "Space proof", status: verification.spaceProof },
                    { label: "Payout setup", status: verification.payout },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium truncate">{row.label}</p>
                      </div>
                      {statusBadge(row.status)}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  You can finish onboarding now and complete verification later, but verified providers get more trust.
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

