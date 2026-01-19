import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { bookings, spaces } from "@/data/mockData";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  Search,
  ShieldAlert,
  Download,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const AdminDashboard = () => {
  const gmv = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeSpaces = spaces.filter((s) => s.availability !== "unavailable").length;
  const dailyBookings = bookings.filter((b) => b.status === "upcoming").length;

  // Lightweight demo data (until admin APIs exist)
  const users = [
    { id: "U-10421", name: "Amina Al Mansoori", email: "amina@example.com", status: "active" as const, joined: "2024-01-10" },
    { id: "U-10422", name: "Omar Hassan", email: "omar@example.com", status: "active" as const, joined: "2024-01-12" },
    { id: "U-10423", name: "Sara Khan", email: "sara@example.com", status: "flagged" as const, joined: "2024-01-14" },
  ];

  const providers = [
    { id: "P-2201", name: "The Hive Spaces", status: "verified" as const, spaces: 12, payoutHold: false },
    { id: "P-2202", name: "Premium Spaces Dubai", status: "pending" as const, spaces: 3, payoutHold: true },
    { id: "P-2203", name: "Downtown Works", status: "verified" as const, spaces: 8, payoutHold: false },
  ];

  const flaggedListings = [
    { spaceId: "5", reason: "Misleading photos", severity: "high" as const },
    { spaceId: "2", reason: "Pricing discrepancy", severity: "medium" as const },
  ];

  const bookingRows = [...bookings].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  const gmvSeries = [
    { day: "Mon", gmv: 8200, bookings: 18 },
    { day: "Tue", gmv: 10350, bookings: 22 },
    { day: "Wed", gmv: 7600, bookings: 15 },
    { day: "Thu", gmv: 12800, bookings: 28 },
    { day: "Fri", gmv: 14250, bookings: 31 },
    { day: "Sat", gmv: 9100, bookings: 19 },
    { day: "Sun", gmv: 6700, bookings: 12 },
  ];

  const revenueByType = [
    { type: "Hot desk", value: 28500 },
    { type: "Meeting", value: 41200 },
    { type: "Office", value: 31800 },
    { type: "Event", value: 22700 },
  ];

  const gmvChartConfig = {
    gmv: { label: "GMV (AED)", color: "hsl(var(--primary))" },
    bookings: { label: "Bookings", color: "hsl(var(--muted-foreground))" },
  } as const;

  const revenueChartConfig = {
    value: { label: "Revenue (AED)", color: "hsl(var(--primary))" },
  } as const;

  return (
    <Layout>
      <div className="min-h-screen bg-muted">
        <div className="border-b bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">User, provider, spaces moderation, bookings, analytics, and exports.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[280px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search users, providers, spaces…" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Top metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>GMV</CardDescription>
                <CardTitle className="text-3xl">{gmv.toLocaleString()} AED</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total (mock)
                </div>
                <Badge variant="outline" className="font-normal">Last 7d</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active spaces</CardDescription>
                <CardTitle className="text-3xl">{activeSpaces.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Available + limited
                </div>
                <Badge variant="outline" className="font-normal">Live</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Daily bookings</CardDescription>
                <CardTitle className="text-3xl">{dailyBookings.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming (mock)
                </div>
                <Badge variant="outline" className="font-normal">Today</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="overview">
              <TabsList className="flex w-full flex-wrap justify-start gap-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">User management</TabsTrigger>
                <TabsTrigger value="providers">Provider management</TabsTrigger>
                <TabsTrigger value="spaces">Spaces moderation</TabsTrigger>
                <TabsTrigger value="bookings">Bookings overview</TabsTrigger>
                <TabsTrigger value="analytics">Revenue & GMV</TabsTrigger>
                <TabsTrigger value="reports">Reports & exports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-xl">GMV & bookings trend</CardTitle>
                      <CardDescription>High-level demand and monetization (placeholder series).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer className="h-[260px] w-full" config={gmvChartConfig}>
                        <LineChart data={gmvSeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="day" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} width={40} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="gmv" stroke="var(--color-gmv)" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl">Flagged listings</CardTitle>
                          <CardDescription>Requires moderation.</CardDescription>
                        </div>
                        <Badge variant="outline">{flaggedListings.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {flaggedListings.map((f) => {
                        const s = spaces.find((sp) => sp.id === f.spaceId);
                        return (
                          <div key={f.spaceId} className="flex items-start justify-between gap-3 rounded-md border bg-background p-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-warning" />
                                <p className="truncate text-sm font-medium">{s?.name ?? `Space #${f.spaceId}`}</p>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">{f.reason}</p>
                            </div>
                            <Badge
                              className={
                                f.severity === "high"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-warning/10 text-warning"
                              }
                            >
                              {f.severity}
                            </Badge>
                          </div>
                        );
                      })}
                      <Button variant="outline" className="w-full gap-2">
                        Review queue
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Bookings overview</CardTitle>
                      <CardDescription>Latest bookings and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking</TableHead>
                            <TableHead>Space</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingRows.map((b) => (
                            <TableRow key={b.id}>
                              <TableCell className="font-medium">{b.id}</TableCell>
                              <TableCell className="max-w-[240px] truncate">{b.spaceName}</TableCell>
                              <TableCell>{b.date}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    b.status === "completed"
                                      ? "bg-success/10 text-success"
                                      : b.status === "cancelled"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-primary/10 text-primary"
                                  }
                                >
                                  {b.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right tabular-nums">{b.totalPrice.toLocaleString()} {b.currency}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Demand heatmap</CardTitle>
                      <CardDescription>Placeholder (time × area) to visualize demand concentration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 8 * 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-6 rounded-sm border bg-muted/40"
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Wire this to real booking events by hour and location (e.g., Marina, DIFC, Downtown).
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">User management</CardTitle>
                    <CardDescription>Search, review, flag, and suspend users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="leading-tight">
                                <p className="font-medium">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.id}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                            <TableCell>{u.joined}</TableCell>
                            <TableCell>
                              <Badge className={u.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                                {u.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="outline" size="sm">Suspend</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="providers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Provider management</CardTitle>
                    <CardDescription>Verify providers, manage holds, and review compliance.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Spaces</TableHead>
                          <TableHead>Payout hold</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {providers.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <div className="leading-tight">
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.id}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={p.status === "verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="tabular-nums">{p.spaces}</TableCell>
                            <TableCell>
                              <Badge className={p.payoutHold ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}>
                                {p.payoutHold ? "On hold" : "Normal"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">Review</Button>
                                <Button size="sm">{p.status === "pending" ? "Verify" : "Message"}</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spaces" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Spaces moderation</CardTitle>
                    <CardDescription>Approve, delist, and resolve flags.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Space</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Availability</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {spaces.slice(0, 6).map((s) => {
                          const isFlagged = flaggedListings.some((f) => f.spaceId === s.id);
                          return (
                            <TableRow key={s.id}>
                              <TableCell>
                                <div className="leading-tight">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{s.name}</p>
                                    {isFlagged && <Badge className="bg-warning/10 text-warning">flagged</Badge>}
                                  </div>
                                  <p className="text-xs text-muted-foreground">#{s.id} • {s.type.replaceAll("_", " ")}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{s.provider}</TableCell>
                              <TableCell className="max-w-[240px] truncate">{s.location}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    s.availability === "available"
                                      ? "bg-success/10 text-success"
                                      : s.availability === "limited"
                                        ? "bg-warning/10 text-warning"
                                        : "bg-destructive/10 text-destructive"
                                  }
                                >
                                  {s.availability}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm">Approve</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Bookings overview</CardTitle>
                    <CardDescription>Status breakdown and recent activity.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking</TableHead>
                          <TableHead>Space</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">GMV</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookingRows.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">{b.id}</TableCell>
                            <TableCell className="max-w-[260px] truncate">{b.spaceName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {b.date} • {b.startTime}-{b.endTime}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  b.status === "completed"
                                    ? "bg-success/10 text-success"
                                    : b.status === "cancelled"
                                      ? "bg-destructive/10 text-destructive"
                                      : "bg-primary/10 text-primary"
                                }
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{b.totalPrice.toLocaleString()} {b.currency}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-4 space-y-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Revenue by space type</CardTitle>
                      <CardDescription>High-level mix (placeholder).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer className="h-[260px] w-full" config={revenueChartConfig}>
                        <BarChart data={revenueByType} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="type" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} width={40} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Revenue & GMV analytics</CardTitle>
                      <CardDescription>KPIs you can expand: take-rate, refunds, net revenue, cohorts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <span>Refund rate</span>
                        <span className="font-medium text-foreground">—</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <span>Take rate</span>
                        <span className="font-medium text-foreground">—</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <span>Provider payouts</span>
                        <span className="font-medium text-foreground">—</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-xl">Reports & exports</CardTitle>
                      <CardDescription>Generate exports for finance, ops, and support.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { title: "Bookings export (CSV)", desc: "All bookings with status and totals." },
                        { title: "GMV report (CSV)", desc: "Daily GMV and booking counts." },
                        { title: "Spaces snapshot (CSV)", desc: "Availability, pricing, provider, and flags." },
                        { title: "Provider payouts (CSV)", desc: "Payouts, holds, and reconciliation." },
                      ].map((r) => (
                        <div key={r.title} className="flex flex-col justify-between gap-3 rounded-md border bg-background p-4 sm:flex-row sm:items-center">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{r.title}</p>
                            <p className="text-sm text-muted-foreground">{r.desc}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <FileText className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-xl">Pending actions</CardTitle>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <CardDescription>Operational queue.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { label: "Spaces pending approval", value: "5", icon: Building2 },
                        { label: "User reports to review", value: "2", icon: AlertTriangle },
                        { label: "Monthly export ready", value: "1", icon: FileText },
                      ].map((a) => (
                        <div key={a.label} className="flex items-center justify-between rounded-md border bg-background p-3">
                          <div className="flex items-center gap-2">
                            <a.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{a.label}</span>
                          </div>
                          <Badge variant="outline">{a.value}</Badge>
                        </div>
                      ))}
                      <Button className="w-full">Open queue</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
