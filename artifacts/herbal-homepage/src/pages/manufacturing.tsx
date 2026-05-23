import { motion } from "framer-motion";
import { CheckCircle2, Zap, Thermometer, Microscope, BarChart2, Shield } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.png";
import aboutImg from "@/assets/about-image.png";

const capabilities = [
  { Icon: Thermometer, title: "Cold-Pressed Extraction", desc: "Mechanical cold-press extraction that preserves heat-sensitive bioactive compounds — no solvents, heat degradation, or harmful chemicals." },
  { Icon: Zap, title: "Supercritical CO₂ Extraction", desc: "Advanced supercritical CO₂ technology for the cleanest, most concentrated extracts — no residues, superior potency, and longer shelf life." },
  { Icon: Microscope, title: "Steam Distillation", desc: "Traditional steam distillation for essential oils and aromatic compounds, preserving the full therapeutic profile of each botanical." },
  { Icon: BarChart2, title: "In-House R&D Laboratory", desc: "Dedicated R&D lab for custom formulations, private labeling, product development, and HPLC-based standardization testing." },
  { Icon: Shield, title: "Rigorous Quality Control", desc: "Each batch is tested for heavy metals, pesticides, microbial contaminants, and potency — with COA and MSDS documentation available." },
  { Icon: CheckCircle2, title: "Ultra-Hygienic Production", desc: "Advanced automation, temperature-controlled warehousing, and strict GMP-aligned protocols ensure batch-to-batch consistency and safety." },
];

const specs = [
  { label: "Total Facility Area", value: "20,000 Sq. Mtr." },
  { label: "Annual Extraction Capacity", value: "100+ MT" },
  { label: "Annual Turnover", value: "₹5–25 Crore" },
  { label: "Location", value: "Mandsaur, MP" },
  { label: "Global Partners", value: "1000+" },
  { label: "Export Countries", value: "20+" },
];

export default function Manufacturing() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Manufacturing Facility"
          subtitle="20,000 sq. meter state-of-the-art facility in Mandsaur, Madhya Pradesh — India's Herbal Capital."
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
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Pukhraj Herbal operates a 20,000 sq. meter state-of-the-art facility in Mandsaur, Madhya Pradesh — widely recognized as India's Herbal Capital. Located in a clean, pollution-free environment with a naturally dry and pristine climate, our campus is ideal for preserving herbal quality.</p>
                <p className="text-foreground/70 leading-relaxed mb-6">Our facility operates with ultra-hygienic production processes, advanced automation systems, and a dedicated in-house R&D laboratory. We ethically source raw herbs from our own cultivation fields or trusted local farmers, ensuring complete traceability, sustainability, and consistent quality.</p>
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8" data-testid="btn-visit-enquiry">
                    Enquire About a Facility Visit
                  </Button>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-1/2">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <img src={aboutImg} alt="Manufacturing Facility" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {specs.map(({ label, value }, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="text-center">
                  <div className="text-3xl font-serif font-bold mb-1">{value}</div>
                  <div className="text-primary-foreground/70 text-xs font-medium leading-tight">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">End-to-End Manufacturing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map(({ Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -5 }} className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">{title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{desc}</p>
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
                { step: "04", label: "Drying & Standardization", desc: "Spray or freeze drying converts the extract to powder, which is then blended to meet the specified active marker content." },
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
