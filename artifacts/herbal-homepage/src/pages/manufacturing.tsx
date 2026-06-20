import { motion } from "framer-motion";
import { CheckCircle2, Zap, BarChart2, Shield } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.png";

import factory29 from "@assets/image_29.jpg_1781680763628.jpeg";
import factory2  from "@assets/image_2.jpg_1781680763630.jpeg";

const capabilities = [
  { Icon: Zap, title: "Multi-Solvent Extraction", desc: "Water, ethanol, methanol, hexane, acetone and supercritical CO₂ extraction capabilities for every polarity class." },
  { Icon: BarChart2, title: "ERP-Driven Traceability", desc: "End-to-end digital batch documentation from raw material receipt to final dispatch, with full lot traceability." },
  { Icon: Shield, title: "Validated Cleaning & Changeover", desc: "Validated equipment cleaning protocols and dedicated manufacturing suites for allergen and organic segregation." },
  { Icon: CheckCircle2, title: "Concentration & Purification", desc: "Evaporators, column chromatography, and membrane filtration refine the extract to target concentration and purity." },
];

const specs = [
  { label: "Total Manufacturing Area", value: "20,000 sq. ft." },
  { label: "Extraction Capacity", value: "250 MT / year" },
  { label: "Storage Capacity", value: "1,200 MT" },
  { label: "Active SKUs in Production", value: "300+" },
];

export default function Manufacturing() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Manufacturing Facility"
          subtitle="State-of-the-art GMP-certified extraction and processing facilities in Mandsaur, Madhya Pradesh."
          image={hero1}
          breadcrumbs={[{ label: "Manufacturing Facility" }]}
          height="lg"
        />

        {/* Intro */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full lg:w-1/2">
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Facility</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">Where Science Meets Nature</h2>
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Pukhraj Herbals operates two GMP and ISO 9001 certified manufacturing facilities located in Mandsaur, Madhya Pradesh — India's heartland for pharmaceutical and botanical ingredient production.</p>
                <p className="text-foreground/70 leading-relaxed mb-6">Together, our facilities span 20,000 square feet of manufacturing, laboratory, and warehouse space. Every area is designed to meet international regulatory requirements for cGMP (current Good Manufacturing Practice), supporting customers in regulated markets across the US, EU, and beyond.</p>
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8" data-testid="btn-visit-enquiry">
                    Enquire About a Facility Visit
                  </Button>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-1/2">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <img src={factory29} alt="Pukhraj Herbals Extraction Vessels" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {specs.map(({ label, value }, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center">
                  <div className="text-3xl font-serif font-bold mb-1">{value}</div>
                  <div className="text-primary-foreground/70 text-xs font-medium leading-tight">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities — with factory background */}
        <section
          className="relative py-28 overflow-hidden"
          style={{ backgroundImage: `url(${factory2})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-foreground/80" />
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-wider text-white/60 uppercase">Our Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-3">End-to-End Manufacturing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {capabilities.map(({ Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-sm hover:bg-white/15 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary/40 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-serif font-bold text-foreground">Our Manufacturing Process</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-0 max-w-5xl mx-auto">
              {[
                { step: "01", label: "Raw Material Receipt & QC", desc: "Every incoming raw material is sampled and tested for identity, purity, and microbial quality before release to production." },
                { step: "02", label: "Extraction", desc: "Optimized multi-solvent extraction in stainless steel vessels, scaled to maintain consistent active compound recovery." },
                { step: "03", label: "Concentration & Purification", desc: "Evaporators, column chromatography, and membrane filtration refine the extract to target concentration." },
                { step: "04", label: "Drying & Standardization", desc: "The extract is converted to powder and blended to meet the specified active marker content." },
                { step: "05", label: "QC Testing & Release", desc: "Every finished lot is tested against 20+ quality parameters by our independent QC laboratory before release." },
              ].map(({ step, label, desc }, i) => (
                <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex-1 flex flex-col md:flex-row items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{step}</div>
                    {i < 4 && <div className="hidden md:block w-0.5 h-full bg-border mt-2 flex-1 min-h-8"></div>}
                  </div>
                  <div className="pb-8 md:pb-0 md:pr-8 flex-1">
                    <h4 className="font-serif font-bold text-foreground mb-2">{label}</h4>
                    <p className="text-sm text-foreground/60 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
