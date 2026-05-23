import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-new.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transparent when: on any page at top of scroll
  const isTransparent = !isScrolled;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const textColor = isTransparent
    ? (isHome ? "text-foreground" : "text-white")
    : "text-foreground";

  const iconColor = isTransparent
    ? (isHome ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white")
    : "text-foreground/60 hover:text-primary";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isTransparent
          ? "bg-transparent py-4"
          : "bg-white/97 backdrop-blur-md shadow-md py-2"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" data-testid="nav-logo">
          <motion.img
            src={logo}
            alt="Pukhraj Herbals"
            className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${
              isTransparent && !isHome ? "brightness-0 invert" : ""
            }`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors relative group ${textColor} ${isActive ? "text-primary" : ""}`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <AnimatePresence>
            {searchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 160, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                type="search"
                placeholder="Search products..."
                className="text-sm border border-border/50 rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-primary text-foreground"
                autoFocus
                data-testid="input-search"
              />
            )}
          </AnimatePresence>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-full hover:bg-black/10 transition-colors ${iconColor}`}
            data-testid="btn-search"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <div className={`w-px h-5 mx-1 ${isTransparent && !isHome ? "bg-white/30" : "bg-border"}`}></div>
          <div className="flex items-center space-x-1">
            {[
              { Icon: FaInstagram, id: "social-ig" },
              { Icon: FaLinkedinIn, id: "social-li" },
              { Icon: FaFacebookF, id: "social-fb" },
              { Icon: FaTwitter, id: "social-tw" },
            ].map(({ Icon, id }) => (
              <motion.a
                key={id}
                href="#"
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconColor}`}
                data-testid={id}
              >
                <Icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 rounded-full hover:bg-black/10 transition-colors ${textColor}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white border-t border-border/50 shadow-lg"
          >
            <div className="p-4 flex flex-col space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-base font-semibold py-3 px-4 rounded-xl text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center space-x-3 pt-4 px-4">
                {[FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
