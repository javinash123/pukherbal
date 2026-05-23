import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import catExtracts from "@/assets/category-extracts.jpg";
import catPowders from "@/assets/category-powders.jpg";
import catOils from "@/assets/category-oils.jpg";
import catHerbs from "@/assets/category-herbs.jpg";
import catStandardized from "@/assets/category-standardized.jpg";
import catCarrier from "@/assets/category-carrier.jpg";
import hero1 from "@/assets/hero-1.png";

const FALLBACK_IMGS = [catExtracts, catPowders, catOils, catHerbs, catStandardized, catCarrier];

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

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
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No categories have been added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                    className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={cat.imageUrl || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-6 flex items-end justify-between right-6">
                        <h3 className="text-white text-2xl font-serif font-bold">{cat.name}</h3>
                      </div>
                    </div>
                    <div className="p-8">
                      {cat.description && (
                        <p className="text-foreground/70 mb-6 leading-relaxed">{cat.description}</p>
                      )}
                      <Link href={`/categories/${cat.slug}`}>
                        <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white group/btn">
                          View Products <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Can't Find What You Need?</h2>
              <p className="text-foreground/70 mb-8">We manufacture 500+ botanical ingredients. If you don't see your required product, our team can develop it to your specifications.</p>
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8">
                  Request a Custom Product
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
