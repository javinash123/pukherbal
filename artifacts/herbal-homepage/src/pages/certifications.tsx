import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { FaFlask, FaShieldAlt, FaSeedling, FaGlobe, FaAward, FaLeaf } from "react-icons/fa";
import hero1 from "@/assets/hero-1.png";

const CERTS = [
  {
    Icon: FaShieldAlt,
    name: "ISO 9001:2008",
    body: "International Organization for Standardization",
    year: "2010",
    desc: "Our ISO 9001:2008 certification demonstrates our commitment to a consistent Quality Management System, ensuring that every product meets customer expectations and regulatory requirements through documented, controlled processes.",
    details: ["Customer satisfaction-focused processes", "Documented and controlled procedures", "Continuous improvement culture", "Regular internal and third-party audits"],
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    Icon: FaFlask,
    name: "GMP Aligned",
    body: "Good Manufacturing Practice",
    year: "Ongoing",
    desc: "Our facility follows GMP-aligned manufacturing protocols ensuring ultra-hygienic production conditions, advanced automation, and strict batch-to-batch consistency — actively working towards full GMP accreditation.",
    details: ["Ultra-hygienic production environment", "Advanced automation systems", "Validated cleaning and changeover protocols", "Complete batch documentation and traceability"],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    Icon: FaSeedling,
    name: "Chemical-Free Processing",
    body: "Pure Extraction Standards",
    year: "1999",
    desc: "We are committed to chemical-free processing using cold-pressed extraction, supercritical CO₂ extraction, and steam distillation — methods that preserve maximum bioactive compounds without solvents, heat degradation, or harmful chemicals.",
    details: ["Cold-Pressed Extraction", "Supercritical CO₂ Extraction", "Steam Distillation", "Zero solvent residues in final products"],
    color: "bg-green-50 border-green-200 text-green-700",
    iconBg: "bg-green-100",
  },
  {
    Icon: FaGlobe,
    name: "Export Ready",
    body: "International Quality Compliance",
    year: "Ongoing",
    desc: "All products are export-ready with complete international documentation including Certificate of Analysis (COA), Material Safety Data Sheet (MSDS), and third-party test reports — meeting global import standards.",
    details: ["Certificate of Analysis (COA) available", "MSDS documentation provided", "Third-party lab test reports", "Accepted in 20+ countries globally"],
    color: "bg-teal-50 border-teal-200 text-teal-700",
    iconBg: "bg-teal-100",
  },
  {
    Icon: FaAward,
    name: "In-House R&D Lab",
    body: "Research & Development",
    year: "2010",
    desc: "Our dedicated in-house R&D laboratory enables rigorous testing for heavy metals, pesticides, microbial contaminants, and potency — using HPLC standardization methods as per USP standards — ensuring every batch meets specification.",
    details: ["HPLC standardization testing (USP methods)", "Heavy metals and pesticide screening", "Microbial contamination testing", "Potency and purity verification per batch"],
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    Icon: FaLeaf,
    name: "Sustainable Sourcing",
    body: "Ethical & Traceable Supply Chain",
    year: "1999",
    desc: "We ethically source raw herbs from our own cultivation fields or trusted local farmers in Mandsaur and surrounding regions, ensuring complete traceability, sustainability, and consistent quality from seed to shelf.",
    details: ["Own cultivation fields in Madhya Pradesh", "Trusted local farmer partnerships", "Seed-to-shelf traceability", "Chemical-free and sustainable farming practices"],
    color: "bg-lime-50 border-lime-200 text-lime-700",
    iconBg: "bg-lime-100",
  },
];

export default function Certifications() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Our Certifications"
          subtitle="Our commitment to quality, purity, and sustainability — backed by ISO certification, chemical-free processing, and complete export-ready documentation for 20+ countries."
          image={hero1}
          breadcrumbs={[{ label: "Certifications" }]}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {CERTS.map(({ Icon, name, body, year, desc, details, color, iconBg }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-5 mb-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-foreground">{name}</h3>
                      <p className="text-sm text-muted-foreground">{body}</p>
                      <span className="text-xs font-semibold text-primary mt-1 inline-block">Certified since {year}</span>
                    </div>
                  </div>
                  <p className="text-foreground/70 text-sm mb-5 leading-relaxed">{desc}</p>
                  <ul className="space-y-2">
                    {details.map(d => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-foreground/70">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Download Our Certificates</h2>
            <p className="text-foreground/70 mb-8">Copies of all our certifications are available upon request for your compliance documentation.</p>
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-8" data-testid="btn-cert-request">
                Request Certificates <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
