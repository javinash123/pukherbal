import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import catExtracts from "@/assets/category-extracts.jpg";
import catPowders from "@/assets/category-powders.jpg";
import catOils from "@/assets/category-oils.jpg";
import catHerbs from "@/assets/category-herbs.jpg";
import catStandardized from "@/assets/category-standardized.jpg";
import catCarrier from "@/assets/category-carrier.jpg";
import hero1 from "@/assets/hero-1.png";

const CATEGORIES = [
  {
    name: "Standardized Extracts",
    img: catExtracts,
    desc: "Botanically authenticated extracts standardized to active markers for consistent potency in every batch.",
    products: ["Ashwagandha Extract (5% Withanolides)", "Brahmi Extract (40% Bacosides)", "Boswellia Extract (65% Boswellic Acids)", "Green Tea Extract (50% EGCG)", "Piperine (95%)", "Curcumin (95%)"],
    count: 80,
  },
  {
    name: "Ayurvedic Powders",
    img: catPowders,
    desc: "Pure single-herb and classical Ayurvedic formulation powders sourced from certified organic farms.",
    products: ["Amla Powder", "Triphala Powder", "Shatavari Powder", "Moringa Powder", "Neem Powder", "Giloy Powder"],
    count: 60,
  },
  {
    name: "Essential Oils",
    img: catOils,
    desc: "Steam-distilled and cold-pressed essential oils of uncompromising purity for aromatherapy and cosmetics.",
    products: ["Neem Oil", "Lavender Oil", "Peppermint Oil", "Eucalyptus Oil", "Tea Tree Oil", "Rosemary Oil"],
    count: 45,
  },
  {
    name: "Ayurvedic Herbs",
    img: catHerbs,
    desc: "Whole, cut, and sifted dried herbs sourced directly from authentic growing regions across India.",
    products: ["Ashwagandha Root", "Brahmi Leaves", "Shatavari Root", "Tulsi Leaves", "Ginger Root", "Licorice Root"],
    count: 120,
  },
  {
    name: "Oleoresins",
    img: catStandardized,
    desc: "Concentrated oleoresin extracts capturing the full spectrum of active compounds from spices and herbs.",
    products: ["Turmeric Oleoresin", "Ginger Oleoresin", "Black Pepper Oleoresin", "Capsicum Oleoresin", "Celery Oleoresin"],
    count: 35,
  },
  {
    name: "Carrier Oils",
    img: catCarrier,
    desc: "Cold-pressed carrier oils ideal for cosmetic, nutraceutical, and therapeutic applications.",
    products: ["Rosehip Oil", "Jojoba Oil", "Argan Oil", "Coconut Oil", "Sesame Oil", "Sunflower Oil"],
    count: 30,
  },
];

export default function Categories() {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {CATEGORIES.map(({ name, img, desc, products, count }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 flex items-end justify-between right-6">
                      <h3 className="text-white text-2xl font-serif font-bold">{name}</h3>
                      <span className="text-white/80 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{count}+ Products</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-foreground/70 mb-6 leading-relaxed">{desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {products.map(p => (
                        <span key={p} className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20">{p}</span>
                      ))}
                    </div>
                    <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white group/btn" data-testid={`btn-category-${i}`}>
                      View All Products <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Can't Find What You Need?</h2>
              <p className="text-foreground/70 mb-8">We manufacture 500+ botanical ingredients. If you don't see your required product, our team can develop it to your specifications.</p>
              <Button size="lg" className="rounded-full px-8" data-testid="btn-custom-product">
                Request a Custom Product
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
