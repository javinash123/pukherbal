import { motion } from "framer-motion";
import { CheckCircle2, Leaf, Award, Users, Globe, Target, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import aboutImg from "@/assets/about-image.png";
import hero2 from "@/assets/hero-2.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

const values = [
  { Icon: Leaf, title: "Purity First", desc: "Every extract begins with carefully sourced, authenticated raw botanicals — ethically sourced from our own cultivation fields or trusted local farmers." },
  { Icon: Award, title: "Quality Assured", desc: "ISO 9001:2008 certified processes with in-house R&D laboratory and rigorous testing at every stage from raw material to final product." },
  { Icon: Globe, title: "Global Reach", desc: "Trusted by 1000+ partners across 20+ countries in pharma, nutraceutical, cosmetic, food, and wellness industries." },
  { Icon: Users, title: "Expert Team", desc: "Led by Mr. Milind Jilhewar with 30+ years of industry expertise, our team delivers customized solutions for every client need." },
];

const timeline = [
  { year: "1999", event: "Founded in Mandsaur, Madhya Pradesh — India's Herbal Capital — under the visionary leadership of Mr. Milind Jilhewar." },
  { year: "2005", event: "Expanded facility to 20,000 sq. meter pollution-free campus. Introduced supercritical CO₂ extraction technology." },
  { year: "2010", event: "Achieved ISO 9001:2008 certification. Built in-house R&D laboratory for custom formulations and standardized extracts." },
  { year: "2015", event: "Entered 15+ export markets. Launched private labeling and bulk supply services for global nutraceutical brands." },
  { year: "2020", event: "Reached 1000+ global partners. Expanded product range to include nutraceutical extracts, CO₂ oils, and cattle/poultry feed ingredients." },
  { year: "2024", event: "100+ MT annual capacity. Exporting to 20+ countries. Recognized as a leading name in India's herbal manufacturing sector." },
];

const stats = [
  { value: "1999", label: "Year Established" },
  { value: "100+", label: "MT Annual Capacity" },
  { value: "20+", label: "Export Countries" },
  { value: "1000+", label: "Global Partners" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="About Pukhraj Herbal"
          subtitle="Founded in 1999 in Mandsaur, Madhya Pradesh — India's Herbal Capital — where ancient Ayurvedic wisdom meets modern extraction science."
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
                    <p className="font-serif font-bold text-lg">ISO 9001:2008 Certified</p>
                    <p className="text-muted-foreground text-sm">Maintaining global quality standards since 2010</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="w-full lg:w-1/2">
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-3 mb-6 leading-tight">Bridging Ancient Tradition & Modern Science</h2>
                <p className="text-foreground/70 text-lg mb-5 leading-relaxed">Founded in 1999 by Mr. Milind Jilhewar, Pukhraj Herbal is a premier herbal products manufacturer located in Mandsaur, Madhya Pradesh — a region widely recognized as the Herbal Capital of India due to its rich agricultural heritage and premium natural produce.</p>
                <p className="text-foreground/70 mb-5 leading-relaxed">Our operations span a 20,000 sq. meter pollution-free campus in a naturally dry and pristine climate, ideal for preserving herbal quality. We are dedicated to harnessing the purest essence of nature by combining ancient Ayurvedic wisdom with modern extraction technology.</p>
                <p className="text-foreground/70 leading-relaxed">With 1000+ global partners across 20+ countries and an annual capacity of 100+ MT, Pukhraj Herbal delivers customized solutions across nutraceutical, pharmaceutical, cosmetic, food, and wellness industries.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { Icon: Target, title: "Our Mission", text: "To deliver nature's finest gifts in their most potent and pure form — combining traditional Ayurvedic knowledge with advanced extraction technology to build long-term partnerships based on trust, quality, and innovation." },
                { Icon: Eye, title: "Our Vision", text: "To promote holistic health, natural beauty, and sustainable wellness globally — making Pukhraj Herbal the most trusted source of pure herbal extracts from India's Herbal Capital, Mandsaur." },
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
