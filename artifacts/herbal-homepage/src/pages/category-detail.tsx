import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const FALLBACK_CAT_IMG = "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=1200";
const FALLBACK_PROD_IMG = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600";

export default function CategoryDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [category, setCategory] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getCategory(slug)
      .then(setCategory)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <h2 className="text-2xl font-serif font-bold text-foreground">Category not found</h2>
          <Link href="/categories">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const products: any[] = category.products || [];
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
          <img
            src={category.imageUrl || FALLBACK_CAT_IMG}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-12 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Category</p>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-3xl leading-tight">
                {category.name}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Description & Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <Link href="/categories" className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-10 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </Link>

            {category.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-12"
              >
                <p className="text-foreground/70 text-lg leading-relaxed">{category.description}</p>
              </motion.div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Products in this Category
                <span className="ml-3 text-base font-normal text-muted-foreground">({products.length} products)</span>
              </h2>
              {products.length > 0 && (
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="pl-10 rounded-full"
                  />
                </div>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No products in this category yet.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No products match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((prod, idx) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <Link href={`/products/${prod.slug}`} className="block bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative aspect-square overflow-hidden bg-muted/30">
                        <img
                          src={prod.imageUrl || FALLBACK_PROD_IMG}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm flex items-center gap-2">
                            View Details <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">{prod.name}</h3>
                        {prod.specification && <p className="text-xs text-muted-foreground mb-1">Spec: {prod.specification}</p>}
                        {prod.casNumber && <p className="text-xs text-muted-foreground mb-1">CAS: {prod.casNumber}</p>}
                        {prod.description && <p className="text-sm text-foreground/60 line-clamp-2 mt-2">{prod.description}</p>}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Can't Find What You Need?</h2>
            <p className="text-foreground/70 mb-8 max-w-xl mx-auto">Our R&D team can develop custom botanical extracts to your exact specifications.</p>
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-8">
                Request a Custom Product <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
