import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/pukhraj-logo-original.png";
import { useSettings } from "@/lib/settings";
import { api, resolveImageUrl } from "@/lib/api";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHome = location === "/";
  const isDetailPage = /^\/(products|categories|blog)\/.+/.test(location);
  const settings = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load products once for search
  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = searchQuery.trim().length > 0
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 7)
    : [];

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    closeSearch();
  }, [searchQuery, navigate]);

  const handleSuggestionClick = (slug: string) => {
    navigate(`/products/${slug}`);
    closeSearch();
  };

  const isTransparent = !isScrolled && !isDetailPage;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const allSocialLinks = [
    { Icon: FaInstagram, url: settings["social_instagram"] || "#", id: "social-ig" },
    { Icon: FaLinkedinIn, url: settings["social_linkedin"] || "#", id: "social-li" },
    { Icon: FaFacebookF, url: settings["social_facebook"] || "#", id: "social-fb" },
    { Icon: FaTwitter, url: settings["social_twitter"] || "#", id: "social-tw" },
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
        <Link href="/" className="flex items-center shrink-0" data-testid="nav-logo">
          <motion.div
            className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 shadow-lg ring-2 ring-primary/30"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <img src={logo} alt="Pukhraj Herbals" className="w-full h-full object-cover scale-[1.08]" />
          </motion.div>
        </Link>

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

        <div className="hidden md:flex items-center space-x-2">
          {/* Search area */}
          <div ref={searchRef} className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSearchSubmit}
                  className="overflow-hidden"
                >
                  <input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="w-full text-sm border border-border/50 rounded-full px-4 py-1.5 bg-white/90 backdrop-blur-sm focus:outline-none focus:border-primary text-foreground"
                    data-testid="input-search"
                    autoComplete="off"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {searchOpen && showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-72 bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {suggestions.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSuggestionClick(p.slug)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left ${i < suggestions.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted/40 shrink-0">
                        {resolveImageUrl(p.imageUrl) ? (
                          <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">🌿</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        {p.specification && <p className="text-xs text-muted-foreground truncate">{p.specification}</p>}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                  {searchQuery.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center gap-2 border-t border-border/40"
                    >
                      <Search className="w-3.5 h-3.5" />
                      See all results for "{searchQuery}"
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={searchOpen ? closeSearch : openSearch}
              className={`p-2 rounded-full hover:bg-black/10 transition-colors ${iconColor} ml-1`}
              data-testid="btn-search"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          <div className={`w-px h-5 mx-1 ${isTransparent && !isHome ? "bg-white/30" : "bg-border"}`} />
          <div className="flex items-center space-x-1">
            {allSocialLinks.map(({ Icon, url, id }) => (
              <motion.a
                key={id}
                href={url}
                target={url !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
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

        <button
          className={`md:hidden p-2 rounded-full hover:bg-black/10 transition-colors ${textColor}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="btn-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
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
              {/* Mobile search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-full focus:outline-none focus:border-primary bg-muted/30"
                  autoComplete="off"
                />
              </form>
              {/* Mobile suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="bg-white border border-border rounded-2xl shadow-lg overflow-hidden mb-2">
                  {suggestions.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { handleSuggestionClick(p.slug); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left ${i < suggestions.length - 1 ? "border-b border-border/40" : ""}`}
                    >
                      <div className="w-7 h-7 rounded-md overflow-hidden bg-muted/40 shrink-0">
                        {resolveImageUrl(p.imageUrl) ? (
                          <img src={resolveImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">🌿</div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate flex-1">{p.name}</p>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}

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
                {allSocialLinks.map(({ Icon, url, id }) => (
                  <a key={id} href={url} target={url !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
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
