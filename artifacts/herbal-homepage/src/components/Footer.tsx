import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp, FaAmazon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/pukhraj-logo-original.png";
import { useSettings } from "@/lib/settings";

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

export function Footer() {
  const settings = useSettings();

  const socialLinks = [
    { Icon: FaInstagram, url: settings["social_instagram"], label: "Instagram" },
    { Icon: FaLinkedinIn, url: settings["social_linkedin"], label: "LinkedIn" },
    { Icon: FaFacebookF, url: settings["social_facebook"], label: "Facebook" },
    { Icon: FaTwitter, url: settings["social_twitter"], label: "Twitter" },
    { Icon: FaYoutube, url: settings["social_youtube"], label: "YouTube" },
    { Icon: FaWhatsapp, url: settings["social_whatsapp"] ? `https://wa.me/${settings["social_whatsapp"].replace(/\D/g, "")}` : undefined, label: "WhatsApp" },
  ].filter(s => s.url);

  const displaySocial = socialLinks.length > 0 ? socialLinks : [
    { Icon: FaInstagram, url: "#", label: "Instagram" },
    { Icon: FaLinkedinIn, url: "#", label: "LinkedIn" },
    { Icon: FaFacebookF, url: "#", label: "Facebook" },
    { Icon: FaTwitter, url: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-foreground text-background pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4" data-testid="footer-logo">
              <img src={logo} alt="Pukhraj Herbals" className="h-14 w-auto object-contain" />
              <span className="font-serif font-bold text-lg leading-tight text-background">Pukhraj<br />Herbals</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-5">
              Premium manufacturer of GMP & ISO certified botanical extracts, powders, and essential oils bridging ancient tradition and modern science.
            </p>

            {/* Available on Amazon & Meesho */}
            <div className="mb-5">
              <p className="text-background/50 text-xs font-semibold uppercase tracking-wider mb-2">Also available on</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-background/10 hover:bg-[#FF9900]/20 border border-background/20 hover:border-[#FF9900]/50 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <FaAmazon className="w-4 h-4 text-[#FF9900]" />
                  <span className="text-xs font-semibold text-background/80">Amazon</span>
                </a>
                <a
                  href="https://www.meesho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-background/10 hover:bg-[#f43397]/20 border border-background/20 hover:border-[#f43397]/50 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <span className="text-[#f43397] font-black text-xs">M</span>
                  <span className="text-xs font-semibold text-background/80">Meesho</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {displaySocial.map(({ Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target={url !== "#" ? "_blank" : undefined}
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
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-background/40 hover:text-primary text-sm transition-colors">Sitemap</a>
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-background/40 hover:text-primary text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
