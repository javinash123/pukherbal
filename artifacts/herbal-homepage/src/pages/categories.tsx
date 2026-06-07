import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { api } from "@/lib/api";
import hero1 from "@/assets/hero-1.png";

// Fallback images for seeded categories
import catExtracts from "@/assets/category-extracts.jpg";
import catPowders from "@/assets/category-powders.jpg";
import catOils from "@/assets/category-oils.jpg";
import catHerbs from "@/assets/category-herbs.jpg";
import catStandardized from "@/assets/category-standardized.jpg";
import catCarrier from "@/assets/category-carrier.jpg";

const FALLBACK_IMAGES: Record<string, string> = {
  "herbal-extracts": catExtracts,
  "extracts": catExtracts,
  "standardized": catStandardized,
  "herbal-powders": catPowders,
  "powders": catPowders,
  "essential-oils": catOils,
  "oils": catOils,
  "raw-herbs": catHerbs,
  "herbs": catHerbs,
  "carrier-oils": catCarrier,
  "carrier": catCarrier,
};

function getCategoryFallback(slug: string): string | null {
  for (const [key, img] of Object.entries(FALLBACK_IMAGES)) {
    if (slug.includes(key) || key.includes(slug)) return img;
  }
  return null;
}

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fallbackImg = (slug: string) => getCategoryFallback(slug) || catExtracts;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Product Categories"
          subtitle="Premium quality natural extracts, powders & oils manufactured under strict GMP & ISO standards."
          image={hero1}
          breadcrumbs={[{ label: "Categories" }]}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-3xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-muted/50" />
                    <div className="p-8 space-y-3">
                      <div className="h-4 bg-muted/50 rounded w-3/4" />
                      <div className="h-3 bg-muted/50 rounded" />
                      <div className="h-3 bg-muted/50 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {categories.map(({ id, name, slug, description, imageUrl }, i) => {
                  const imgSrc = imageUrl || fallbackImg(slug);
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                      className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={e => {
                            const el = e.target as HTMLImageElement;
                            const fb = fallbackImg(slug);
                            if (el.src !== fb) { el.onerror = null; el.src = fb; }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                          <h3 className="text-white text-2xl font-serif font-bold">{name}</h3>
                        </div>
                      </div>
                      <div className="p-8">
                        {description && (
                          <p className="text-foreground/70 mb-6 leading-relaxed">{description}</p>
                        )}
                        <Link href={`/categories/${slug}`}>
                          <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white group/btn">
                            View Products <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!loading && categories.length === 0 && (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No categories found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Can't Find What You Need?</h2>
              <p className="text-foreground/70 mb-8">We manufacture 500+ botanical ingredients. If you don't see your required product, our team can develop it to your specifications.</p>
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8">Request a Custom Product</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
