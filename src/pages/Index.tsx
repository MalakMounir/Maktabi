import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchBar from "@/components/search/SearchBar";
import SpaceCard from "@/components/cards/SpaceCard";
import { Button } from "@/components/ui/button";
import { spaces, spaceTypes, popularLocations } from "@/data/mockData";
import heroImage from "@/assets/hero-workspace.jpg";
import {
  Shield,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Monitor,
  Users,
  Building,
  Calendar,
  Sparkles,
  Building2,
  TrendingUp,
  Brain,
  BadgePercent,
  LineChart,
  MessageSquareText,
} from "lucide-react";

const Index = () => {
  const getSpaceTypeIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Monitor: <Monitor className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      Building: <Building className="w-6 h-6" />,
      Calendar: <Calendar className="w-6 h-6" />,
    };
    return icons[iconName] || <Monitor className="w-6 h-6" />;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern coworking space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 backdrop-blur-sm text-secondary mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">The #1 Workspace Booking Platform in MENA</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-4 animate-slide-up">
              Book workspaces
              <br />
              <span className="text-secondary">anytime, anywhere</span>
            </h1>
            
            <p className="text-lg md:text-xl text-background/80 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Desks, meeting rooms, private offices, and event spaces.
              <br />
              Find your perfect workspace in minutes.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div>
                <div className="text-3xl font-bold text-background">500+</div>
                <div className="text-sm text-background/60">Workspaces</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-background">50K+</div>
                <div className="text-sm text-background/60">Bookings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-background">15</div>
                <div className="text-sm text-background/60">Cities</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Space Types Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Find your ideal workspace
          </h2>
          <p className="text-muted-foreground mb-8">
            Browse by space type to find exactly what you need
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spaceTypes.map((type) => (
              <Link
                key={type.id}
                to={`/search?type=${type.id}`}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {getSpaceTypeIcon(type.icon)}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                <p className="text-sm text-muted-foreground">{type.labelAr}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Spaces Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Popular Workspaces
              </h2>
              <p className="text-muted-foreground">
                Top-rated spaces loved by professionals
              </p>
            </div>
            <Link to="/search">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.slice(0, 6).map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Popular Locations
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore workspaces in top cities across MENA
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularLocations.map((loc) => (
              <Link
                key={loc.name}
                to={`/search?location=${loc.name}`}
                className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all text-center"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {loc.name}
                </h3>
                <p className="text-sm text-muted-foreground">{loc.count} spaces</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Maktabi Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Why Choose Maktabi?
            </h2>
            <p className="text-primary-foreground/80">
              The trusted platform for workspace bookings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Verified Spaces",
                description: "Every space is verified for quality and accuracy",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Instant Booking",
                description: "Book in seconds with instant confirmation",
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Secure Payments",
                description: "Multiple payment options with buyer protection",
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Round-the-clock customer support in Arabic & English",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-primary-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section for Providers */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-primary">For Space Owners</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                List your space on Maktabi
              </h2>
              <p className="text-muted-foreground mb-6">
                Join hundreds of workspace providers and start earning from your unused spaces.
                Easy setup, powerful tools, and access to thousands of professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/provider">
                  <Button variant="cta" size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon - Corporate & AI */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Corporate */}
            <div className="relative p-8 rounded-2xl border-2 border-dashed border-border overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold">
                  Coming Soon
                </span>
              </div>
              <Building className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Corporate Accounts
              </h3>
              <p className="text-muted-foreground">
                Centralized billing, team management, and usage analytics for enterprises.
              </p>
            </div>

            {/* AI Features */}
            <div className="relative p-8 rounded-2xl border-2 border-dashed border-border overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold">
                  Coming Soon
                </span>
              </div>
              <Brain className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                AI Insights for Space Owners
              </h3>
              <p className="text-muted-foreground mb-6">
                Turn performance signals into actions that help you earn more, stay booked, and improve guest satisfaction.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Sparkles className="h-5 w-5" />,
                    title: "Smart recommendations",
                    description: "Quick, prioritized suggestions to boost visibility and bookings.",
                  },
                  {
                    icon: <BadgePercent className="h-5 w-5" />,
                    title: "Dynamic pricing suggestions",
                    description: "Price guidance to improve conversion while protecting revenue.",
                  },
                  {
                    icon: <LineChart className="h-5 w-5" />,
                    title: "Demand forecasting",
                    description: "Plan availability and promotions around expected demand shifts.",
                  },
                  {
                    icon: <MessageSquareText className="h-5 w-5" />,
                    title: "Review sentiment analysis",
                    description: "Spot what guests love (and what to fix) to increase ratings.",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl bg-card border border-border p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {card.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground">{card.title}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{card.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
