import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { FaFlask, FaShieldAlt, FaLeaf, FaIndustry, FaStar } from "react-icons/fa";
import hero1 from "@/assets/hero-1.png";

const CERTS = [
  {
    Icon: FaLeaf,
    name: "FSSAI License",
    body: "Food Safety and Standards Authority of India",
    year: "2008",
    desc: "Our FSSAI license confirms full compliance with India's food safety regulations, a mandatory requirement for the manufacturing and commercial sale of food-grade botanical ingredients in India.",
    details: ["Compliance with Indian food safety regulations", "Annual renewal and inspection", "Applicable to all food-grade products", "Required for domestic and export markets"],
    color: "bg-lime-50 border-lime-200 text-lime-700",
    iconBg: "bg-lime-100",
  },
  {
    Icon: FaFlask,
    name: "GMP Certified",
    body: "Good Manufacturing Practice",
    year: "2010",
    desc: "Good Manufacturing Practice certification ensures our facilities, processes, and controls meet the highest international manufacturing standards. Every batch is produced under documented, validated conditions.",
    details: ["Validated manufacturing procedures", "In-process quality controls at each stage", "Full documentation and batch traceability", "Regular internal and third-party audits"],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  {
    Icon: FaShieldAlt,
    name: "ISO 9001:2015",
    body: "International Organization for Standardization",
    year: "2010",
    desc: "ISO 9001:2015 certification demonstrates our commitment to a consistent Quality Management System that drives continuous improvement, customer focus, and process excellence across all operations.",
    details: ["Customer satisfaction focus", "Risk-based process approach", "Continuous improvement framework", "Documented quality objectives"],
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    Icon: FaIndustry,
    name: "MSME Registered",
    body: "Ministry of Micro, Small & Medium Enterprises, India",
    year: "2008",
    desc: "MSME registration recognizes Pukhraj Herbals as a formally registered manufacturing enterprise under the Government of India, enabling access to government schemes, export benefits, and priority sector support.",
    details: ["Registered under Udyam portal", "Eligible for government MSME benefits", "Priority sector for export promotion", "Access to credit-linked capital subsidy schemes"],
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconBg: "bg-orange-100",
  },
  {
    Icon: FaStar,
    name: "AYUSH Approved",
    body: "Ministry of Ayurveda, Yoga & Naturopathy, Unani, Siddha and Homeopathy",
    year: "2012",
    desc: "AYUSH approval from India's Ministry of AYUSH validates that our Ayurvedic herbal products and processes comply with the standards set for traditional medicine systems in India.",
    details: ["Compliance with Ayurvedic pharmacopoeia", "Approved for Ayurvedic formulations", "Adherence to AYUSH manufacturing guidelines", "Recognized by Government of India"],
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconBg: "bg-purple-100",
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
