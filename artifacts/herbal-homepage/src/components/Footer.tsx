import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo-new.png";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Manufacturing Facility", href: "/manufacturing" },
  { label: "Certifications", href: "/certifications" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Research & Blog", href: "/blog" },
];

const categoryLinks = [
  { label: "Standardized Extracts", href: "/categories" },
  { label: "Ayurvedic Powders", href: "/categories" },
  { label: "Essential Oils", href: "/categories" },
  { label: "Carrier Oils", href: "/categories" },
  { label: "Oleoresins", href: "/categories" },
];

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export function Footer() {
  const [social, setSocial] = useState<SocialLinks>({});

  useEffect(() => {
    api.getSettings().then((settings: Record<string, string>) => {
      setSocial({
        instagram: settings.social_instagram,
        facebook: settings.social_facebook,
        youtube: settings.social_youtube,
        twitter: settings.social_twitter,
        linkedin: settings.social_linkedin,
      });
    }).catch(() => {});
  }, []);

  const socialIcons: { key: keyof SocialLinks; Icon: React.ComponentType<any>; label: string }[] = [
    { key: "instagram", Icon: FaInstagram, label: "Instagram" },
    { key: "facebook", Icon: FaFacebookF, label: "Facebook" },
    { key: "youtube", Icon: FaYoutube, label: "YouTube" },
    { key: "twitter", Icon: FaXTwitter, label: "X / Twitter" },
    { key: "linkedin", Icon: FaLinkedinIn, label: "LinkedIn" },
  ];

  const activeSocial = socialIcons.filter(s => social[s.key]);
  const fallbackSocial = socialIcons.slice(0, 4);

  return (
    <footer className="bg-foreground text-background pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6" data-testid="footer-logo">
              <img src={logo} alt="Pukhraj Herbals" className="h-16 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Premium manufacturer of GMP & ISO certified botanical extracts, powders, and essential oils bridging ancient tradition and modern science.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {(activeSocial.length > 0 ? activeSocial : fallbackSocial).map(({ key, Icon, label }) => (
                <motion.a
                  key={key}
                  href={social[key] || "#"}
                  target={social[key] ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-background/60 hover:text-primary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-background/60 hover:text-primary text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-background/60 text-sm mb-4">Subscribe to receive updates on new product launches and industry insights.</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-background/10 border-transparent text-background placeholder:text-background/40 h-11" />
              <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © {new Date().getFullYear()} Pukhraj Herbals. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
