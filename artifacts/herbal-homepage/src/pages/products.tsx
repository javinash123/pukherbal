import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import hero3 from "@/assets/hero-3.png";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || categories.find(c => c.id === p.categoryId)?.name === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catName = (id?: string) => categories.find(c => c.id === id)?.name || "";

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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === "All" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat.name ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
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
                        onHoverStart={() => setHoveredIdx(idx)}
                        onHoverEnd={() => setHoveredIdx(null)}
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 group cursor-pointer"
                      >
                        <Link href={`/products/${product.slug}`} className="block">
                          <div className="relative aspect-square overflow-hidden bg-muted/30">
                            <img
                              src={product.imageUrl || FALLBACK_IMG}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredIdx === idx ? 1 : 0 }}
                              className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3 p-5"
                            >
                              <span className="w-full text-center bg-white text-black rounded-full py-2 text-sm font-semibold">
                                View Details
                              </span>
                              <span className="w-full text-center bg-primary text-white rounded-full py-2 text-sm font-semibold">
                                Enquiry Now
                              </span>
                            </motion.div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
                              {catName(product.categoryId) && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0">{catName(product.categoryId)}</span>
                              )}
                            </div>
                            {product.specification && <p className="text-xs text-muted-foreground mb-1">Spec: {product.specification}</p>}
                            {product.casNumber && <p className="text-xs text-muted-foreground mb-1">CAS: {product.casNumber}</p>}
                            <p className="text-sm text-foreground/60 line-clamp-2 mt-2">{product.description}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    <p className="text-lg">{products.length === 0 ? "No products have been added yet." : "No products found matching your search."}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Need a Custom Formulation?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Our R&D team can develop custom botanical extracts to your exact specifications.</p>
            <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
              Request a Custom Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
