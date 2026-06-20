import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Recycle, Users, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import hero2 from "@/assets/hero-2.png";

import factory26 from "@assets/image_26.jpg_1781680763629.jpeg";
import factory48 from "@assets/image_48.jpg_1781680763624.jpeg";

const pillars = [
  { Icon: Leaf, title: "Sustainable Sourcing", desc: "We partner with 150+ contracted farmers across India who practice organic, regenerative agriculture. Wild-harvesting is minimized and strictly regulated to prevent over-extraction of plant populations.", stat: "150+", statLabel: "Farmer Partners" },
  { Icon: Droplets, title: "Water Conservation", desc: "Our zero-liquid-discharge manufacturing facilities recycle all process water. We've reduced freshwater consumption per kg of extract by 60% over the past decade through closed-loop systems.", stat: "60%", statLabel: "Water Use Reduction" },
  { Icon: Sun, title: "Renewable Energy", desc: "40% of our total energy consumption now comes from rooftop solar installations at both our manufacturing facilities. We are committed to 100% renewable energy by 2030.", stat: "40%", statLabel: "Renewable Energy" },
  { Icon: Recycle, title: "Zero Waste Manufacturing", desc: "Spent plant biomass is composted and returned to our farm partners as organic fertilizer. Packaging waste is minimized through concentrated formats and recyclable materials.", stat: "Zero", statLabel: "Landfill Waste" },
  { Icon: Users, title: "Community Empowerment", desc: "We employ and train people in rural farming communities, with a focus on women's employment. Our Fair Trade pricing model ensures farmers receive above-market rates.", stat: "50–100", statLabel: "Rural Livelihoods" },
  { Icon: Globe, title: "Biodiversity Protection", desc: "We support conservation programs for 12 endangered medicinal plant species through seed banks, habitat protection grants, and cultivation research partnerships with Indian universities.", stat: "12", statLabel: "Species Protected" },
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
                  <img src={factory26} alt="Pukhraj Herbals Sustainable Manufacturing" className="w-full h-full object-cover" />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-3/5">
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Philosophy</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6">Nature Gives. We Give Back.</h2>
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Every botanical extract we produce begins with a plant — grown in soil, nourished by rain, cultivated by human hands. We believe that using nature's gifts carries an inherent responsibility to protect and replenish what we take.</p>
                <p className="text-foreground/70 leading-relaxed">Our sustainability strategy covers the entire value chain: from regenerative farming and water-conserving extraction to fair wages for rural workers and protection of endangered plant species. We measure our progress not just in revenue, but in the health of the ecosystems and communities that make our work possible.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Six Pillars — with factory background */}
        <section
          className="relative py-28 overflow-hidden"
          style={{ backgroundImage: `url(${factory48})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-foreground/80" />
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-wider text-white/60 uppercase">Six Pillars</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-3">Our Sustainability Framework</h2>
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
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-sm hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/40 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-serif font-bold text-primary-foreground">{stat}</span>
                    <span className="text-sm text-white/60">{statLabel}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mt-2 mb-3">{title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {[
                { value: "100%", label: "Renewable Energy in Manufacturing" },
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
