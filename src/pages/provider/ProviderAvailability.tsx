import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { spaces } from "@/data/mockData";
import { Clock, Calendar as CalendarIcon, Building2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WEEK_DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;

const ProviderAvailability = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock: "my spaces" = first 3 spaces
  const mySpaces = spaces.slice(0, 3);
  const [selectedSpace, setSelectedSpace] = useState<string>(mySpaces[0]?.id || "");

  // Availability state
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

  const handleSave = () => {
    toast({
      title: "Availability Updated",
      description: "Your space availability has been saved successfully.",
    });
  };

  const selectedSpaceData = mySpaces.find((s) => s.id === selectedSpace);

  return (
    <Layout>
      <div className="min-h-screen bg-muted">
        {/* Header */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Availability</h1>
                  <p className="text-sm text-muted-foreground">Manage when your spaces are available for booking</p>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
                <Link to="/provider/dashboard">
                  <Building2 className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Space Selection & Weekly Schedule */}
            <div className="lg:col-span-8 space-y-6">
              {/* Space Selection */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Select Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {mySpaces.map((space) => (
                      <button
                        key={space.id}
                        onClick={() => setSelectedSpace(space.id)}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          selectedSpace === space.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-sm">{space.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{space.location}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Days Open */}
                  <div>
                    <Label className="mb-3 block">Days Open</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {WEEK_DAYS.map((d) => (
                        <label
                          key={d.key}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 cursor-pointer hover:bg-muted/50"
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

                  {/* Operating Hours */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">Open Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="openTime"
                          type="time"
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closeTime">Close Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="closeTime"
                          type="time"
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Schedule Summary</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Object.values(daysOpen).filter(Boolean).length} days per week,{" "}
                          {openTime} - {closeTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Calendar & Actions */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg"
                  />
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-3 w-3 rounded-full bg-primary/20 border border-primary/30"></div>
                    <span>Select dates to set custom availability</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleSave} className="w-full gap-2" variant="cta">
                    <Save className="h-4 w-4" />
                    Save Availability
                  </Button>
                  <Button variant="outline" className="w-full">
                    Set Holiday Hours
                  </Button>
                  <Button variant="outline" className="w-full">
                    Copy to All Spaces
                  </Button>
                </CardContent>
              </Card>

              {selectedSpaceData && (
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Current Space</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-semibold">{selectedSpaceData.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedSpaceData.location}</div>
                      <Badge variant="outline" className="mt-2">
                        {selectedSpaceData.availability === "available" ? "Available" : "Limited"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderAvailability;
