import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import hero2 from "@/assets/hero-2.png";

const BLOGS: Record<string, {
  title: string; date: string; readTime: string; category: string;
  img: string; content: string[];
  relatedTitle?: string;
}> = {
  "science-of-standardized-extracts": {
    title: "The Science of Standardized Extracts",
    date: "December 12, 2024",
    readTime: "6 min read",
    category: "Science",
    img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=1200",
    content: [
      "In the world of botanical ingredients, 'standardized extract' has become a hallmark of quality. But what does standardization actually mean — and why does it matter so profoundly for nutraceutical and pharmaceutical applications?",
      "A standardized extract is one that is manufactured to contain a consistent concentration of one or more active (marker) compounds. For example, an Ashwagandha extract standardized to 5% Withanolides guarantees that every 100mg of extract delivers exactly 5mg of its key active compound. This consistency is what sets standardized extracts apart from raw powders, where active compound content can vary dramatically by season, geography, and processing method.",
      "The standardization process at Pukhraj Herbals begins at the farm. We work directly with certified growers to source raw botanicals at the peak of their active compound cycle. Material is authenticated using HPTLC (High-Performance Thin Layer Chromatography) and HPLC (High-Performance Liquid Chromatography) before any processing begins.",
      "Extraction then proceeds using solvent systems optimized for each specific compound class — polar solvents for glycosides and polyphenols, non-polar systems for terpenoids and essential oils. The extract is then concentrated, purified, and assayed to verify the active marker concentration.",
      "If the concentration is above target, the batch is blended with excipient material. If below target, it is re-extracted or blended with a more concentrated batch. Every lot is released only after final verification by our QC laboratory, which operates independently from production.",
      "The result is an ingredient that a formulator can depend on — batch after batch, year after year. This is the promise and the science behind standardized botanical extracts.",
    ],
  },
  "sustainable-botanical-sourcing": {
    title: "Sustainable Botanical Sourcing",
    date: "November 28, 2024",
    readTime: "5 min read",
    category: "Sustainability",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1200",
    content: [
      "Sustainability isn't just a buzzword at Pukhraj Herbals — it's a core operational principle that guides every procurement decision we make.",
      "India is home to thousands of medicinal plant species, and the global demand for Ayurvedic and botanical ingredients has soared in recent years. This demand, if managed irresponsibly, can lead to over-harvesting of wild plant populations, loss of biodiversity, and degradation of forest ecosystems.",
      "Our approach begins with a clear preference for cultivated over wild-harvested botanicals. We maintain direct relationships with over 150 contracted farmers across Gujarat, Kerala, Uttarakhand, and Himachal Pradesh. These partnerships are built on transparency, fair pricing, and technical support that helps farmers adopt organic, regenerative practices.",
      "For species that cannot yet be cultivated at scale, we work with government-approved wild collection programs that enforce strict seasonal and volume limits. Our procurement team includes trained botanists who verify harvest methods in the field.",
      "We track the origin of every raw material batch using a digital traceability system. From the GPS coordinates of the farm to the final Certificate of Analysis, each step is documented and available to our customers on request.",
      "Because sustainability also means reducing waste, our manufacturing facilities operate zero-liquid-discharge systems. Spent plant material is composted or used as biofuel, and process water is recycled within our facilities.",
    ],
  },
};

const DEFAULT_BLOG = {
  title: "The Benefits of Botanical Ingredients",
  date: "October 2024",
  readTime: "5 min read",
  category: "Science",
  img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200",
  content: [
    "Botanical ingredients have been central to human health and wellness for thousands of years. From the turmeric used in Ayurvedic kitchens to the adaptogenic roots prescribed by traditional healers, plants hold a pharmacopeia of bioactive compounds that modern science is only beginning to fully understand.",
    "At Pukhraj Herbals, we believe that the future of health lies at the intersection of traditional botanical wisdom and modern extraction science. Our work is driven by a deep respect for the plant kingdom and a commitment to making its healing potential available to formulators and consumers around the world.",
    "This article explores some of the key botanical ingredients in our portfolio and the scientific evidence supporting their use in modern health formulations.",
  ],
};

export default function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const blog = BLOGS[slug] || { ...DEFAULT_BLOG };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
          <img src={blog.img} alt={blog.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-12 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-xs">{blog.category}</span>
                <span>{blog.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-3xl leading-tight">{blog.title}</h1>
            </motion.div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <Link href="/blog">
                <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-10 hover:gap-3 transition-all" data-testid="link-back-blog">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </a>
              </Link>
              <div className="prose prose-lg max-w-none">
                {blog.content.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="text-foreground/80 leading-relaxed mb-6 text-lg"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-14 p-10 bg-muted/30 rounded-3xl border border-border text-center">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Interested in Our Extracts?</h3>
                <p className="text-foreground/70 mb-6">Our team is ready to help you find the right botanical ingredient for your formulation.</p>
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8" data-testid="btn-blog-cta">
                    Request a Sample <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
