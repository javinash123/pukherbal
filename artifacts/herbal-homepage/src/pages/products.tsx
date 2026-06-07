import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { api } from "@/lib/api";
import hero3 from "@/assets/hero-3.png";

import prodAshwagandha from "@/assets/product-ashwagandha.png";
import prodTurmeric from "@/assets/product-turmeric.png";
import prodNeem from "@/assets/product-neem.png";
import prodBrahmi from "@/assets/product-brahmi.png";
import prodAmla from "@/assets/product-amla.png";
import prodMoringa from "@/assets/product-moringa.png";

const FALLBACK_IMAGES: Record<string, string> = {
  ashwagandha: prodAshwagandha,
  turmeric: prodTurmeric,
  neem: prodNeem,
  brahmi: prodBrahmi,
  amla: prodAmla,
  moringa: prodMoringa,
};

function getFallbackImage(slug: string): string | null {
  for (const [key, img] of Object.entries(FALLBACK_IMAGES)) {
    if (slug.includes(key)) return img;
  }
  return null;
}

function ProductImage({ imageUrl, slug, name }: { imageUrl?: string; slug: string; name: string }) {
  const fallback = getFallbackImage(slug);
  const src = imageUrl || fallback;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={e => {
          const el = e.target as HTMLImageElement;
          el.onerror = null;
          if (fallback && el.src !== fallback) { el.src = fallback; return; }
          el.style.display = "none";
        }}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <span className="text-5xl opacity-40">🌿</span>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = search.trim().length > 0
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const catNames = ["All", ...categories.map(c => c.name)];

  const filtered = products.filter(p => {
    const matchesCat = activeCategory === "All" || categories.find(c => c.id === p.categoryId)?.name === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Our Products"
          subtitle="Premium botanical extracts, powders, and oils manufactured under GMP & ISO standards."
          image={hero3}
          breadcrumbs={[{ label: "Products" }]}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="relative w-full md:w-[480px]" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search products..."
                  className="pl-10 rounded-full"
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                    {suggestions.map(p => {
                      const fb = getFallbackImage(p.slug);
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          onClick={() => { setShowSuggestions(false); setSearch(""); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors cursor-pointer border-b border-border/50 last:border-0"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted/40 shrink-0">
                            {p.imageUrl || fb ? (
                              <img src={p.imageUrl || fb!} alt={p.name} className="w-full h-full object-cover" onError={e => { if (fb) (e.target as HTMLImageElement).src = fb; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm">🌿</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                            {p.specification && <p className="text-xs text-muted-foreground truncate">{p.specification}</p>}
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {catNames.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted/50" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-muted/50 rounded w-3/4" />
                      <div className="h-3 bg-muted/50 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 group"
                    >
                      <Link href={`/products/${product.slug}`} className="block h-full">
                        <div className="relative aspect-square overflow-hidden bg-muted/30 cursor-pointer">
                          <ProductImage imageUrl={product.imageUrl} slug={product.slug} name={product.name} />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-sm font-medium flex items-center gap-1.5">
                              View Details <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
                            {product.categoryId && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0">
                                {categories.find(c => c.id === product.categoryId)?.name || ""}
                              </span>
                            )}
                          </div>
                          {product.specification && (
                            <p className="text-xs text-muted-foreground mb-1">Spec: {product.specification}</p>
                          )}
                          {product.casNumber && (
                            <p className="text-xs text-muted-foreground mb-1">CAS: {product.casNumber}</p>
                          )}
                          {product.description && (
                            <div
                              className="text-sm text-foreground/60 line-clamp-2 mt-2"
                              dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                          )}
                        </div>
                      </Link>
                      {/* Enquiry button overlaid outside the main link */}
                      <div className="px-5 pb-5">
                        <Link href="/contact">
                          <Button variant="outline" size="sm" className="w-full rounded-full text-xs">Enquiry Now</Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No products found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Need a Custom Formulation?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Our R&D team can develop custom botanical extracts to your exact specifications.</p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                Request a Custom Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
