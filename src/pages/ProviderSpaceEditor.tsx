import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { amenityLabels, spaces, spaceTypes } from "@/data/mockData";

import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  DollarSign,
  ImagePlus,
  Info,
  MapPin,
  Save,
  Sparkles,
  Upload,
} from "lucide-react";
import { format } from "date-fns";

const WEEK_DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

type WeekDayKey = (typeof WEEK_DAYS)[number]["key"];

type LocalPhoto = {
  id: string;
  url: string;
  file?: File;
  source: "upload" | "existing";
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

function toIsoDateString(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const spaceEditorSchema = z
  .object({
    // Details
    name: z.string().min(3, "Name must be at least 3 characters."),
    type: z.string().min(1, "Choose a space type."),
    location: z.string().min(3, "Location is required."),
    capacity: z.coerce.number().int().min(1, "Capacity must be at least 1.").max(500, "Capacity looks too high."),
    description: z.string().min(50, "Description should be at least 50 characters for guest confidence."),

    // Amenities
    amenities: z.array(z.string()).min(1, "Select at least 1 amenity."),

    // Pricing
    currency: z.enum(["AED", "SAR", "QAR", "KWD", "BHD", "OMR"]),
    pricePerHour: z.coerce.number().min(1, "Hourly price must be at least 1."),
    cleaningFee: z.coerce.number().min(0).default(0),
    minHours: z.coerce.number().int().min(1, "Minimum hours must be at least 1.").max(24),
    instantBook: z.boolean().default(true),
    weeklyDiscountPct: z.coerce.number().min(0).max(60).default(0),
    monthlyDiscountPct: z.coerce.number().min(0).max(70).default(0),

    // Availability
    daysOpen: z.record(z.boolean()),
    openTime: z.string().refine(isValidTime, "Open time is required."),
    closeTime: z.string().refine(isValidTime, "Close time is required."),
    blockedDates: z.array(z.string()).default([]),
  })
  .refine(
    (v) => {
      const [oh, om] = v.openTime.split(":").map(Number);
      const [ch, cm] = v.closeTime.split(":").map(Number);
      return ch * 60 + cm > oh * 60 + om;
    },
    { path: ["closeTime"], message: "Close time must be after open time." },
  )
  .refine((v) => Object.values(v.daysOpen).some(Boolean), { path: ["daysOpen"], message: "Select at least one open day." });

type SpaceEditorValues = z.infer<typeof spaceEditorSchema>;

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function makeDraftKey(spaceId?: string) {
  return `provider-space-editor:draft:${spaceId ?? "new"}`;
}

function createEmptyDefaults(): SpaceEditorValues {
  return {
    name: "",
    type: "desk",
    location: "",
    capacity: 1,
    description: "",
    amenities: ["wifi", "ac"],
    currency: "AED",
    pricePerHour: 75,
    cleaningFee: 0,
    minHours: 1,
    instantBook: true,
    weeklyDiscountPct: 0,
    monthlyDiscountPct: 0,
    daysOpen: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    openTime: "09:00",
    closeTime: "18:00",
    blockedDates: [],
  };
}

export default function ProviderSpaceEditor() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const isEdit = Boolean(params.id);
  const existingSpace = useMemo(() => (isEdit ? spaces.find((s) => s.id === params.id) : undefined), [isEdit, params.id]);

  const [photos, setPhotos] = useState<LocalPhoto[]>(() => {
    if (existingSpace?.image) {
      return [{ id: "existing-hero", url: existingSpace.image, source: "existing" as const }];
    }
    return [];
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<SpaceEditorValues>({
    resolver: zodResolver(spaceEditorSchema),
    mode: "onChange",
    defaultValues: createEmptyDefaults(),
  });

  const watched = form.watch();

  const openDaysCount = useMemo(() => Object.values(watched.daysOpen ?? {}).filter(Boolean).length, [watched.daysOpen]);
  const estimatedWeeklyHours = useMemo(() => {
    if (!isValidTime(watched.openTime) || !isValidTime(watched.closeTime)) return 0;
    const [oh, om] = watched.openTime.split(":").map(Number);
    const [ch, cm] = watched.closeTime.split(":").map(Number);
    const minutes = Math.max(0, ch * 60 + cm - (oh * 60 + om));
    return (minutes / 60) * openDaysCount;
  }, [openDaysCount, watched.closeTime, watched.openTime]);

  // Load draft / existing space into form once.
  useEffect(() => {
    const draftKey = makeDraftKey(params.id);
    const raw = localStorage.getItem(draftKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<SpaceEditorValues> & { photos?: { url: string }[] };
        form.reset({ ...createEmptyDefaults(), ...(parsed as SpaceEditorValues) });
        if (parsed.photos?.length) {
          setPhotos((prev) => {
            const existing = prev.filter((p) => p.source === "existing");
            const draftPhotos: LocalPhoto[] = parsed.photos!.map((p, idx) => ({
              id: `draft-${idx}`,
              url: p.url,
              source: "existing",
            }));
            return [...existing, ...draftPhotos].slice(0, 12);
          });
        }
        return;
      } catch {
        // ignore corrupted draft
      }
    }

    if (existingSpace) {
      form.reset({
        ...createEmptyDefaults(),
        name: existingSpace.name,
        type: existingSpace.type,
        location: existingSpace.location,
        capacity: existingSpace.capacity,
        description: existingSpace.description,
        amenities: existingSpace.amenities,
        currency: (existingSpace.currency as SpaceEditorValues["currency"]) ?? "AED",
        pricePerHour: existingSpace.price,
      });
    }
  }, [existingSpace, form, params.id]);

  // Clean up blob URLs on unmount.
  useEffect(() => {
    return () => {
      for (const p of photos) {
        if (p.source === "upload" && p.url.startsWith("blob:")) URL.revokeObjectURL(p.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);

    const allowed = incoming.filter((f) => f.type.startsWith("image/"));
    const rejected = incoming.length - allowed.length;
    if (rejected > 0) {
      toast.message("Some files were skipped", { description: "Only image files are supported." });
    }

    setPhotos((prev) => {
      const next = [...prev];
      for (const file of allowed) {
        if (next.length >= 12) break;
        next.push({ id: `upload-${crypto.randomUUID()}`, url: URL.createObjectURL(file), file, source: "upload" });
      }
      return next;
    });
  }

  function removePhoto(photoId: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === photoId);
      if (target?.source === "upload" && target.url.startsWith("blob:")) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== photoId);
    });
  }

  function movePhoto(photoId: string, dir: -1 | 1) {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === photoId);
      if (idx < 0) return prev;
      const next = [...prev];
      const nextIdx = clamp(idx + dir, 0, next.length - 1);
      const [item] = next.splice(idx, 1);
      next.splice(nextIdx, 0, item);
      return next;
    });
  }

  function saveDraft() {
    const values = form.getValues();
    const payload = {
      ...values,
      photos: photos.map((p) => ({ url: p.url })),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(makeDraftKey(params.id), JSON.stringify(payload));
    toast.success("Draft saved", { description: "You can come back anytime to continue editing." });
  }

  async function publish() {
    const ok = await form.trigger();
    const hasEnoughPhotos = photos.length >= 3;
    if (!ok || !hasEnoughPhotos) {
      if (!hasEnoughPhotos) {
        toast.error("Add a few more photos", { description: "Listings with 3+ photos typically get more bookings." });
      } else {
        toast.error("Fix the highlighted fields", { description: "Once everything looks good, you can publish." });
      }
      return;
    }

    toast.success("Listing published (mock)", {
      description: "Backend publish can be wired later—UI flow is ready.",
    });
    localStorage.removeItem(makeDraftKey(params.id));
    navigate("/provider/dashboard");
  }

  const selectedType = useMemo(() => spaceTypes.find((t) => t.id === watched.type), [watched.type]);
  const amenityKeys = useMemo(() => Object.keys(amenityLabels), []);

  const previewPriceNote = useMemo(() => {
    const base = watched.pricePerHour ?? 0;
    const min = watched.minHours ?? 1;
    const total = base * min + (watched.cleaningFee ?? 0);
    return `${formatCurrency(total, watched.currency)} minimum (for ${min}h)`;
  }, [watched.cleaningFee, watched.currency, watched.minHours, watched.pricePerHour]);

  return (
    <Layout hideFooter>
      <div className="min-h-screen bg-muted">
        <div className="border-b border-border bg-background shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm">
                  <ImagePlus className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Edit Space" : "Add New Space"}</h1>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-medium">
                      Provider
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Create a guest-ready listing with clear pricing, great photos, and reliable availability. All fields include inline validation to guide you.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button variant="outline" className="gap-2 shadow-sm hover:shadow" onClick={saveDraft}>
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 shadow-sm hover:shadow">
                      <Sparkles className="h-4 w-4" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Listing Preview</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 md:grid-cols-12">
                      <div className="md:col-span-7">
                        <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                          {(photos.length ? photos : [{ id: "placeholder", url: "/placeholder.svg", source: "existing" as const }]).slice(0, 6).map((p) => (
                            <img
                              key={p.id}
                              src={p.url}
                              alt="Space preview"
                              className={cn(
                                "h-24 w-full object-cover border border-border transition-transform hover:scale-105",
                                p.id === (photos[0]?.id ?? "") && "col-span-3 h-64",
                              )}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
                          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Photo tip:</span> Use bright, wide shots first. Add close-ups for desks/screens, then amenities.
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <div className="rounded-2xl border border-border bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold">{formatCurrency(watched.pricePerHour ?? 0, watched.currency)}</span>
                            <span className="text-sm text-muted-foreground">/hour</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{previewPriceNote}</div>
                          <Separator className="my-4" />
                          <div>
                            <div className="text-xl font-semibold">{watched.name || "Untitled space"}</div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{watched.location || "Location"}</span>
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type: </span>
                                <span className="font-medium text-foreground">{selectedType?.label ?? "—"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Capacity: </span>
                                <span className="font-medium text-foreground">{watched.capacity ?? 1}</span>
                              </div>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="text-sm font-semibold mb-2">Amenities</div>
                          <div className="flex flex-wrap gap-2">
                            {(watched.amenities ?? []).slice(0, 8).map((k) => (
                              <Badge key={k} variant="secondary" className="rounded-full">
                                {amenityLabels[k]?.label ?? k}
                              </Badge>
                            ))}
                            {(watched.amenities?.length ?? 0) > 8 ? (
                              <Badge variant="outline" className="rounded-full">
                                +{(watched.amenities?.length ?? 0) - 8} more
                              </Badge>
                            ) : null}
                          </div>
                          <Separator className="my-4" />
                          <div className="text-sm font-semibold mb-2">Availability</div>
                          <div className="text-sm text-muted-foreground">
                            {openDaysCount} days/week • {watched.openTime}–{watched.closeTime}
                            {watched.blockedDates && watched.blockedDates.length > 0 && (
                              <span> • {watched.blockedDates.length} blocked {watched.blockedDates.length === 1 ? "date" : "dates"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="cta" className="gap-2 shadow-md hover:shadow-lg" onClick={publish}>
                  <Upload className="h-4 w-4" />
                  Publish Listing
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
              <Info className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Inline validation enabled:</span> Fields will guide you as you type. Publishing is mocked for now—backend integration ready.
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Form {...form}>
            <form className="grid gap-6 lg:grid-cols-12">
              {/* Left column: editor */}
              <div className="grid gap-6 lg:col-span-8">
                {/* Space details */}
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Space Details</CardTitle>
                    <CardDescription className="mt-1">What guests will see first—keep it clear and specific.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Listing title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Quiet Hot Desk with Marina View" />
                            </FormControl>
                            <FormDescription>Try: type + standout feature + area (max 60 chars).</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Space type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {spaceTypes.map((t) => (
                                  <SelectItem key={t.id} value={t.id}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Pick the primary type—guests filter by this.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Dubai Marina, Dubai" />
                            </FormControl>
                            <FormDescription>Use neighborhood + city. Add landmark in description.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={1} max={500} />
                            </FormControl>
                            <FormDescription>Max guests the space can host comfortably.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={6} placeholder="Describe the setup, noise level, Wi‑Fi, and what bookings include…" />
                          </FormControl>
                          <FormDescription>
                            Helpful structure: who it’s for, what’s included, and any constraints (noise, access, parking).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Photo upload */}
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Photos</CardTitle>
                    <CardDescription className="mt-1">Great photos are the biggest conversion lever—invest time here.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-6">
                    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-6 transition-all hover:border-primary/50 hover:bg-primary/10">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-sm">
                            <ImagePlus className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">Upload up to 12 photos</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>
                                <span className="font-medium text-foreground">Recommended order:</span>
                              </div>
                              <div className="ml-4 space-y-0.5">
                                <div>1. <span className="font-medium">Wide hero shot</span> — Show the full space</div>
                                <div>2. <span className="font-medium">2–3 angles</span> — Different perspectives</div>
                                <div>3. <span className="font-medium">Amenities</span> — Wi‑Fi, screen, coffee, etc.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-shrink-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => onPickFiles(e.target.files)}
                          />
                          <Button type="button" variant="default" className="gap-2 shadow-sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4" />
                            Choose Photos
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-start gap-2 rounded-lg bg-background/80 border border-primary/20 p-3">
                        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Photo quality tips:</span> Use natural light, avoid dark/zoomed images, keep surfaces tidy, no watermarks. High-quality photos get 3x more bookings.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/50 border border-border/50 px-4 py-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-semibold text-foreground">{photos.length}/12 photos</span>
                        <span className="text-muted-foreground">•</span>
                        <span className={cn("font-medium", photos.length >= 3 ? "text-success" : "text-warning")}>
                          {photos.length >= 3 ? "✓ Ready to publish" : "⚠ Add at least 3 to publish"}
                        </span>
                      </div>
                      {photos.length > 0 ? (
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-medium">
                          First photo = Cover
                        </Badge>
                      ) : null}
                    </div>

                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((p, idx) => (
                          <div key={p.id} className="group relative overflow-hidden rounded-xl border-2 border-border bg-background transition-all hover:border-primary/50 hover:shadow-md">
                            <img src={p.url} alt={`Photo ${idx + 1}`} className="h-36 w-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute left-2 top-2">
                              <Badge className={cn("rounded-full font-medium shadow-sm", idx === 0 ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground border border-border/50")}>
                                {idx === 0 ? "Cover" : `#${idx + 1}`}
                              </Badge>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-2.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                              <div className="flex gap-1">
                                <Button type="button" size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={() => movePhoto(p.id, -1)} disabled={idx === 0}>
                                  ←
                                </Button>
                                <Button type="button" size="sm" variant="secondary" className="h-7 px-2 text-xs" onClick={() => movePhoto(p.id, 1)} disabled={idx === photos.length - 1}>
                                  →
                                </Button>
                              </div>
                              <Button type="button" size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => removePhoto(p.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-12 text-center">
                        <ImagePlus className="h-12 w-12 text-muted-foreground mb-3" />
                        <div className="text-sm font-medium text-foreground mb-1">No photos yet</div>
                        <div className="text-xs text-muted-foreground">Add a hero photo first (wide shot), then detail shots</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Amenities */}
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Amenities</CardTitle>
                    <CardDescription className="mt-1">Pick what guests can rely on. Only select what's always available.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-6">
                    <FormField
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Amenities</FormLabel>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {amenityKeys.map((key) => {
                              const checked = field.value?.includes(key) ?? false;
                              return (
                                <label
                                  key={key}
                                  className={cn(
                                    "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                                    checked ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted/40",
                                  )}
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(v) => {
                                      const next = new Set(field.value ?? []);
                                      if (v) next.add(key);
                                      else next.delete(key);
                                      field.onChange(Array.from(next));
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <div className="font-medium">{amenityLabels[key]?.label ?? key}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      Guests filter heavily by Wi‑Fi, screen/whiteboard, parking, and AC.
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Pricing rules */}
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Pricing Rules</CardTitle>
                    <CardDescription className="mt-1">Clear, predictable pricing builds trust and reduces messages.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["AED", "SAR", "QAR", "KWD", "BHD", "OMR"].map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Match your payout currency to reduce confusion.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pricePerHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per hour</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={1} />
                            </FormControl>
                            <FormDescription>
                              <span className="font-medium text-foreground">Pricing tip:</span> Guests decide fast—keep it simple. Competitive pricing: Hot desks (AED 50-100/hr), Meeting rooms (AED 200-400/hr), Private offices (AED 600-1000/hr).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="minHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum booking (hours)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={1} max={24} />
                            </FormControl>
                            <FormDescription>
                              <span className="font-medium text-foreground">Minimum booking tip:</span> For meeting rooms, 2h minimum reduces operational overhead. Hot desks can be 1h minimum.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cleaningFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cleaning fee (optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={0} />
                            </FormControl>
                            <FormDescription>
                              <span className="font-medium text-foreground">Cleaning fee tip:</span> Use only if there's real cost (event spaces, heavy setups). Most spaces don't need this—keep pricing simple.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="weeklyDiscountPct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weekly discount (%)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={0} max={60} />
                            </FormControl>
                            <FormDescription>
                              <span className="font-medium text-foreground">Discount tip:</span> Typical: 5–15% for 20h+ bookings. Encourages longer stays and increases utilization.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monthlyDiscountPct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly discount (%)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min={0} max={70} />
                            </FormControl>
                            <FormDescription>
                              <span className="font-medium text-foreground">Discount tip:</span> Typical: 10–25% for recurring bookings. Monthly discounts attract corporate clients.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="instantBook"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border bg-background p-4">
                          <div className="space-y-1">
                            <FormLabel className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Instant book
                            </FormLabel>
                            <FormDescription>Turn on to reduce back-and-forth and increase conversions.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Availability calendar */}
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Availability</CardTitle>
                    <CardDescription className="mt-1">Set your weekly hours and block specific dates when unavailable.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-5 pt-6">
                    <FormField
                      control={form.control}
                      name="daysOpen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days open</FormLabel>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {WEEK_DAYS.map((d) => (
                              <label
                                key={d.key}
                                className={cn(
                                  "flex items-center gap-2 rounded-xl border px-3 py-2",
                                  field.value?.[d.key] ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted/40",
                                )}
                              >
                                <Checkbox
                                  checked={Boolean(field.value?.[d.key])}
                                  onCheckedChange={(v) => field.onChange({ ...(field.value ?? {}), [d.key]: Boolean(v) })}
                                />
                                <span className="text-sm">{d.label}</span>
                              </label>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="openTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open time</FormLabel>
                            <FormControl>
                              <Input {...field} type="time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="closeTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Close time</FormLabel>
                            <FormControl>
                              <Input {...field} type="time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="blockedDates"
                      render={({ field }) => {
                        const selected = (field.value ?? []).map((s) => new Date(`${s}T00:00:00`));
                        return (
                          <FormItem>
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <FormLabel className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-primary" />
                                  Blocked dates
                                </FormLabel>
                                <FormDescription>Click dates to block/unblock (vacations, maintenance, private use).</FormDescription>
                              </div>
                              <Badge variant="outline">{(field.value ?? []).length} blocked</Badge>
                            </div>
                            <div className="rounded-2xl border border-border bg-background p-2">
                              <Calendar
                                mode="multiple"
                                selected={selected}
                                onSelect={(days) => {
                                  const next = (days ?? []).map((d) => toIsoDateString(d));
                                  field.onChange(next);
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right column: sticky guidance */}
              <div className="grid gap-6 lg:col-span-4">
                <Card className="rounded-2xl border-border/50 shadow-sm lg:sticky lg:top-6">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg font-semibold">Listing Health</CardTitle>
                    <CardDescription className="mt-1">Real-time feedback as you build your listing.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm pt-6">
                    <div className="flex items-start justify-between gap-3 rounded-xl border-2 border-border bg-background p-4 transition-all" style={{ borderColor: form.formState.isValid ? "rgb(34 197 94 / 0.3)" : "rgb(234 179 8 / 0.3)" }}>
                      <div className="flex items-start gap-3">
                        {form.formState.isValid ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-base">Form Validation</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {form.formState.isValid ? "All required fields look good. Ready to publish!" : "A few fields still need attention. Check highlighted fields."}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-2 font-medium",
                          form.formState.isValid ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning",
                        )}
                      >
                        {form.formState.isValid ? "✓ Ready" : "⚠ In Progress"}
                      </Badge>
                    </div>

                    <div className="flex items-start justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="mt-0.5 h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-semibold text-base">Pricing Preview</div>
                          <div className="text-xs text-muted-foreground mt-1 font-medium text-foreground">{previewPriceNote}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-full font-medium">
                        {watched.minHours ?? 1}h min
                      </Badge>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                        <div className="text-xs text-muted-foreground">
                          <div className="font-semibold text-foreground text-sm mb-2">Pricing Best Practices</div>
                          <div className="space-y-1.5">
                            <div>• Keep hourly price clear; avoid surprise fees</div>
                            <div>• Add discounts for longer bookings (5-15% weekly, 10-25% monthly)</div>
                            <div>• Only add cleaning fees for event spaces or heavy setups</div>
                            <div>• Competitive pricing increases bookings by 40%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                      <div className="flex items-start gap-3">
                        <ImagePlus className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                        <div className="text-xs text-muted-foreground">
                          <div className="font-semibold text-foreground text-sm mb-2">Photo Quality Checklist</div>
                          <div className="space-y-1.5">
                            <div>• Cover photo: widest shot showing full space</div>
                            <div>• Desk/room setup (include screen/whiteboard if available)</div>
                            <div>• Natural light, tidy surfaces, no watermarks</div>
                            <div>• Listings with 3+ photos get 3x more bookings</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
                      <div>
                        <div className="font-semibold text-base">Weekly Availability</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {openDaysCount} days/week • ~{estimatedWeeklyHours.toFixed(1)} hrs/week
                        </div>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        {(watched.blockedDates?.length ?? 0) > 0 ? "Has blocks" : "No blocks"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 pt-6 border-t border-border/50">
                    <Button type="button" variant="outline" className="w-full justify-start gap-2 shadow-sm" onClick={saveDraft}>
                      <Save className="h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button type="button" variant="cta" className="w-full justify-start gap-2 shadow-md" onClick={publish}>
                      <Upload className="h-4 w-4" />
                      Publish Listing
                    </Button>
                    <Button asChild type="button" variant="ghost" className="w-full justify-start">
                      <Link to="/provider/dashboard">← Back to Dashboard</Link>
                    </Button>
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      Drafts are saved locally in your browser
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

