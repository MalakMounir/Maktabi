import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Find Workspaces", href: "/search" },
        { label: "List Your Space", href: "/provider" },
        { label: "Enterprise", href: "#" },
        { label: "Pricing", href: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    resources: {
      title: "Resources",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Community", href: "#" },
        { label: "Guides", href: "#" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="md" showText={true} textColor="#ffffff" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Book workspaces anytime, anywhere across MENA.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Maktabi. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-muted-foreground">🇦🇪 UAE</span>
            <span className="text-sm text-muted-foreground">🇸🇦 KSA</span>
            <span className="text-sm text-muted-foreground">🇪🇬 Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
