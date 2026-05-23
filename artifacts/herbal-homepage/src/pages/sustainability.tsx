import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Recycle, Users, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import hero2 from "@/assets/hero-2.png";
import aboutImg from "@/assets/about-image.png";

const pillars = [
  { Icon: Leaf, title: "Ethical Herb Sourcing", desc: "We ethically source raw herbs from our own cultivation fields or trusted local farmers in Mandsaur and surrounding regions — ensuring complete traceability and consistent quality from seed to shelf.", stat: "100%", statLabel: "Traceable Sourcing" },
  { Icon: Droplets, title: "Pollution-Free Campus", desc: "Our 20,000 sq. meter facility is located in a clean, pollution-free environment with a naturally dry and pristine climate — ideal for preserving the natural integrity of herbs throughout the manufacturing process.", stat: "20,000", statLabel: "Sq. Mtr. Campus" },
  { Icon: Sun, title: "Chemical-Free Processing", desc: "We use cold-pressed extraction, supercritical CO₂, and steam distillation — methods that preserve maximum bioactive compounds without solvents, heat degradation, or harmful chemicals.", stat: "Zero", statLabel: "Solvent Residues" },
  { Icon: Recycle, title: "Sustainable Agriculture", desc: "Our farming partnerships prioritize natural and regenerative practices. We work with farmers who avoid synthetic pesticides and fertilizers, supporting a healthier ecosystem and better herbal quality.", stat: "Natural", statLabel: "Farming Practices" },
  { Icon: Users, title: "Community & Farmer Partnership", desc: "We support farmers in Madhya Pradesh with fair pricing, technical knowledge, and long-term partnerships — contributing to rural livelihoods and promoting India's herbal agricultural heritage.", stat: "Local", statLabel: "Farmer Network" },
  { Icon: Globe, title: "Global Wellness Mission", desc: "With exports to 20+ countries and 1000+ global partners, we bring the natural goodness of Mandsaur's herbs to the world — supporting holistic health, natural beauty, and sustainable wellness globally.", stat: "20+", statLabel: "Export Countries" },
];

export default function Sustainability() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Our Commitment to Sustainability"
          subtitle="Responsible botanical sourcing, zero-waste manufacturing, and community empowerment — for the planet and the people."
          image={hero2}
          breadcrumbs={[{ label: "Sustainability" }]}
          height="lg"
        />

        {/* Intro */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full lg:w-2/5">
                <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={aboutImg} alt="Sustainable Farming" className="w-full h-full object-cover" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-3/5">
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Philosophy</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">Nature Gives. We Give Back.</h2>
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Every botanical extract we produce begins with a plant — grown in the fertile fields of Mandsaur, Madhya Pradesh, nourished by the region's naturally dry and pristine climate. We believe that using nature's gifts carries an inherent responsibility to protect and replenish what we take.</p>
                <p className="text-foreground/70 leading-relaxed">Our commitment to sustainability spans the entire value chain — from ethically sourcing herbs from our own cultivation fields and trusted local farmers, to chemical-free extraction using cold-pressed, supercritical CO₂, and steam distillation methods, to building long-term partnerships with farming communities in Madhya Pradesh. We measure our progress in the quality of our extracts, the health of the ecosystems, and the livelihoods we support.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-wider text-primary uppercase">Six Pillars</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">Our Sustainability Framework</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pillars.map(({ Icon, title, desc, stat, statLabel }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-serif font-bold text-primary">{stat}</span>
                    <span className="text-sm text-muted-foreground">{statLabel}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mt-2 mb-3">{title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals Banner */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our 2030 Sustainability Goals</h2>
            <p className="text-primary-foreground/80 mb-10">We are committed to ambitious targets that align our growth with planetary health.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { value: "100%", label: "Renewable Energy in Manufacturing" },
                { value: "200+", label: "Certified Organic Farm Partners" },
                { value: "Carbon", label: "Neutral Operations by 2030" },
              ].map(({ value, label }, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-primary-foreground/10 rounded-2xl p-6 border border-primary-foreground/20">
                  <div className="text-4xl font-serif font-bold mb-2">{value}</div>
                  <div className="text-primary-foreground/70 text-sm">{label}</div>
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
