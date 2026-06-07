import { motion } from "framer-motion";
import { CheckCircle2, Leaf, Award, Users, Globe, Target, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import aboutImg from "@/assets/about-image.png";
import hero2 from "@/assets/hero-2.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

const values = [
  { Icon: Leaf, title: "Purity First", desc: "Every extract begins with carefully sourced, authenticated raw botanicals. No shortcuts, no compromise." },
  { Icon: Award, title: "Quality Assured", desc: "GMP and ISO certified processes with in-house testing at every stage from raw material to final product." },
  { Icon: Globe, title: "Global Reach", desc: "Trusted by manufacturers in 30+ countries across pharma, nutraceutical, and cosmetic industries." },
  { Icon: Users, title: "Expert Team", desc: "Our botanists, chemists and QA professionals bring decades of combined experience in plant science." },
];

const timeline = [
  { year: "1998", event: "Founded by Dr. Ramesh Patel with a single extraction unit in Gujarat, India." },
  { year: "2004", event: "Achieved GMP certification. Expanded product portfolio to 100+ botanical extracts." },
  { year: "2009", event: "ISO 9001 certified. Opened second state-of-the-art facility with modern equipment." },
  { year: "2014", event: "Received USDA Organic and Halal certifications. Entered European markets." },
  { year: "2019", event: "Launched R&D division for novel standardized extracts. Exports to 25+ countries." },
  { year: "2024", event: "Expanded to 500+ products. Present in 30+ countries. Leading name in botanical excellence." },
];

const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "500+", label: "Products" },
  { value: "30+", label: "Export Countries" },
  { value: "98%", label: "Client Retention" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="About Pukhraj Herbals"
          subtitle="25 years of botanical excellence — where ancient Ayurvedic wisdom meets modern extraction science."
          image={hero2}
          breadcrumbs={[{ label: "About Us" }]}
        />

        {/* Stats Bar */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ value, label }, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                  <div className="text-4xl md:text-5xl font-serif font-bold mb-1">{value}</div>
                  <div className="text-primary-foreground/70 text-sm font-medium">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                  <img src={aboutImg} alt="Pukhraj Herbals Lab" className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 -right-6 bg-card p-6 rounded-xl shadow-xl border border-border max-w-xs">
                    <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
                    <p className="font-serif font-bold text-lg">GMP & ISO Certified</p>
                    <p className="text-muted-foreground text-sm">Meeting global quality standards since 2004</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-1/2">
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6 leading-tight">Bridging Ancient Tradition & Modern Science</h2>
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Founded in 1998, Pukhraj Herbals began as a humble extraction unit with a singular vision: to make the healing power of Ayurvedic plants accessible to the world through scientifically validated, standardized extracts.</p>
                <p className="text-foreground/70 mb-5 leading-relaxed">Today, we operate two GMP-certified manufacturing facilities equipped with cutting-edge extraction, purification, and analysis technologies. Our team of over 200 scientists, botanists, and quality professionals ensures every batch meets the highest standards.</p>
                <p className="text-foreground/70 leading-relaxed">From the farms of Gujarat and Kerala to labs in Europe, the USA, and beyond, Pukhraj Herbals is a trusted name in pure herbal excellence.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { Icon: Target, title: "Our Mission", text: "To manufacture the finest botanical extracts and herbal ingredients using sustainable practices, rigorous science, and unwavering quality — empowering health and wellness industries around the globe." },
                { Icon: Eye, title: "Our Vision", text: "To be the world's most trusted source of plant-based ingredients, recognized for purity, consistency, and the power to bridge ancient botanical wisdom with cutting-edge modern science." },
              ].map(({ Icon, title, text }, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card p-10 rounded-3xl border border-border shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-wider text-primary uppercase">What Drives Us</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map(({ Icon, title, desc }, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -6 }} className="text-center p-8 rounded-2xl bg-muted/30 border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">{title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3">Milestones of Growth</h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
              {timeline.map(({ year, event }, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} pl-20 md:pl-0`}>
                  <div className="hidden md:block w-1/2"></div>
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 mt-1.5 shrink-0"></div>
                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                      <div className="text-primary font-bold text-lg mb-1 font-serif">{year}</div>
                      <p className="text-foreground/70 text-sm leading-relaxed">{event}</p>
                    </div>
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
