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
    Icon: FaFlask,
    name: "GMP Certified",
    body: "WHO – World Health Organization",
    year: "2004",
    desc: "Good Manufacturing Practice certification ensures our facilities, processes, and controls meet the highest international manufacturing standards. Every batch is produced under documented, validated conditions.",
    details: ["Validated manufacturing procedures", "In-process quality controls at each stage", "Full documentation and batch traceability", "Regular internal and third-party audits"],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    Icon: FaShieldAlt,
    name: "ISO 9001:2015",
    body: "Bureau Veritas Certification",
    year: "2009",
    desc: "ISO 9001:2015 certification demonstrates our commitment to a consistent Quality Management System that drives continuous improvement, customer focus, and process excellence across all operations.",
    details: ["Customer satisfaction focus", "Risk-based process approach", "Continuous improvement framework", "Documented quality objectives"],
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    Icon: FaSeedling,
    name: "USDA Organic",
    body: "NOP – National Organic Program, USA",
    year: "2014",
    desc: "Our USDA Organic certification covers a wide range of our botanical ingredients, confirming they are grown and processed without synthetic pesticides, herbicides, or genetically modified organisms.",
    details: ["No synthetic fertilizers or pesticides", "Non-GMO verified ingredients", "Annual on-farm inspection by accredited certifier", "Full supply chain organic traceability"],
    color: "bg-green-50 border-green-200 text-green-700",
    iconBg: "bg-green-100",
  },
  {
    Icon: FaGlobe,
    name: "Halal Certified",
    body: "Halal India – MUIS Recognized",
    year: "2014",
    desc: "Halal certification confirms that our manufacturing processes, ingredients, and facilities comply with Islamic dietary laws, making our products suitable for Muslim-majority markets globally.",
    details: ["Halal-compliant solvents and excipients", "Dedicated Halal production lines", "Annual facility inspection", "Accepted in GCC, Malaysia, Indonesia, and more"],
    color: "bg-teal-50 border-teal-200 text-teal-700",
    iconBg: "bg-teal-100",
  },
  {
    Icon: FaAward,
    name: "Kosher Certified",
    body: "Star-K Kosher Certification",
    year: "2016",
    desc: "Kosher certification ensures that applicable products are produced according to Jewish dietary laws, opening access to US, European, and Israeli markets that require Kosher-compliant ingredients.",
    details: ["Kosher-compliant processing equipment", "Approved Kosher solvents and carriers", "Regular Mashgiach (Kosher supervisor) inspection", "Full Kosher documentation per lot"],
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconBg: "bg-amber-100",
  },
  {
    Icon: FaLeaf,
    name: "FSSAI License",
    body: "Food Safety and Standards Authority of India",
    year: "2003",
    desc: "Our FSSAI license confirms full compliance with India's food safety regulations, a mandatory requirement for the manufacturing and commercial sale of food-grade botanical ingredients in India.",
    details: ["Compliance with Indian food safety regulations", "Annual renewal and inspection", "Applicable to all food-grade products", "Required for domestic and export markets"],
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
          subtitle="Globally recognized quality standards that validate our commitment to purity, safety, and excellence."
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
