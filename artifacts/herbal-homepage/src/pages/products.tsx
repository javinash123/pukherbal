import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prodAshwagandha from "@/assets/product-ashwagandha.png";
import prodTurmeric from "@/assets/product-turmeric.png";
import prodNeem from "@/assets/product-neem.png";
import prodBrahmi from "@/assets/product-brahmi.png";
import prodAmla from "@/assets/product-amla.png";
import prodMoringa from "@/assets/product-moringa.png";
import hero3 from "@/assets/hero-3.png";

const PRODUCTS = [
  { name: "Ashwagandha Extract", category: "Extracts", spec: "Withanolides 5%", cas: "84-26-4", img: prodAshwagandha, desc: "Adaptogenic root extract standardized for withanolides. Supports stress, immunity, and vitality." },
  { name: "Turmeric Powder", category: "Powders", spec: "Curcumin 95%", cas: "458-37-7", img: prodTurmeric, desc: "High-potency turmeric with curcuminoid standardization for anti-inflammatory formulations." },
  { name: "Neem Oil", category: "Essential Oils", spec: "Cold Pressed", cas: "8002-65-1", img: prodNeem, desc: "Cold-pressed pure neem oil ideal for dermatological and cosmetic applications." },
  { name: "Brahmi Extract", category: "Extracts", spec: "Bacosides 40%", cas: "76-32-4", img: prodBrahmi, desc: "Standardized bacopa extract for cognitive support and memory enhancement." },
  { name: "Amla Powder", category: "Powders", spec: "Vitamin C 25%", cas: "89-65-6", img: prodAmla, desc: "Spray-dried amla powder rich in Vitamin C and antioxidants for immunity support." },
  { name: "Moringa Extract", category: "Extracts", spec: "Isothiocyanates 0.5%", cas: "223143-91-7", img: prodMoringa, desc: "Nutrient-dense superfood extract for energy, inflammation, and overall wellness." },
  { name: "Boswellia Extract", category: "Extracts", spec: "Boswellic Acids 65%", cas: "631-69-6", img: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=600", desc: "High potency boswellic acid extract for joint health and inflammation management." },
  { name: "Green Tea Extract", category: "Extracts", spec: "EGCG 50%", cas: "989-51-5", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600", desc: "Polyphenol-rich green tea extract for antioxidant and metabolic support." },
  { name: "Piperine Extract", category: "Extracts", spec: "Piperine 95%", cas: "94-62-2", img: "https://images.unsplash.com/photo-1615485736971-91f0cb7fcf79?auto=format&fit=crop&q=80&w=600", desc: "Black pepper alkaloid that enhances bioavailability of other nutrients." },
  { name: "Rosemary Extract", category: "Extracts", spec: "Rosmarinic Acid 5%", cas: "20283-92-5", img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=80&w=600", desc: "Natural antioxidant for food preservation and nutraceutical formulations." },
  { name: "Neem Powder", category: "Powders", spec: "Azadirachtin 0.03%", cas: "11141-17-6", img: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?auto=format&fit=crop&q=80&w=600", desc: "Pure neem leaf powder with antibacterial and skin-beneficial compounds." },
  { name: "Lavender Oil", category: "Essential Oils", spec: "Linalool 40%", cas: "8000-28-0", img: "https://images.unsplash.com/photo-1471943038916-05dc7d90a8f7?auto=format&fit=crop&q=80&w=600", desc: "Steam-distilled lavender essential oil for aromatherapy and cosmetics." },
];

const CATEGORIES = ["All", "Extracts", "Powders", "Essential Oils"];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const filtered = PRODUCTS.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
                    data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {cat}
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
                  data-testid="input-product-search"
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    onHoverStart={() => setHoveredIdx(idx)}
                    onHoverEnd={() => setHoveredIdx(null)}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 group cursor-pointer"
                    data-testid={`card-product-${idx}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/30">
                      <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIdx === idx ? 1 : 0 }}
                        className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-3 p-5"
                      >
                        <Button variant="secondary" className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-full text-sm" data-testid={`btn-read-${idx}`}>
                          Read More
                        </Button>
                        <Button className="w-full rounded-full text-sm" data-testid={`btn-enquiry-${idx}`}>
                          Enquiry Now
                        </Button>
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0">{product.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Spec: {product.spec}</p>
                      <p className="text-sm text-foreground/60 line-clamp-2 mt-2">{product.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
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
            <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90" data-testid="btn-custom-enquiry">
              Request a Custom Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
