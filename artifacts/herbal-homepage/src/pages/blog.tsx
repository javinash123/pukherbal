import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import hero2 from "@/assets/hero-2.png";

const BLOGS = [
  {
    slug: "science-of-standardized-extracts",
    title: "The Science of Standardized Extracts",
    date: "December 12, 2024",
    readTime: "6 min read",
    category: "Science",
    excerpt: "Understanding why standardization is critical for consistent therapeutic results in nutraceuticals and pharmaceutical applications.",
    img: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    slug: "sustainable-botanical-sourcing",
    title: "Sustainable Botanical Sourcing",
    date: "November 28, 2024",
    readTime: "5 min read",
    category: "Sustainability",
    excerpt: "How our farm-to-flask approach ensures quality while protecting the earth's delicate botanical ecosystems for future generations.",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    slug: "ayurveda-in-modern-cosmetics",
    title: "Ayurveda in Modern Cosmetics",
    date: "November 15, 2024",
    readTime: "7 min read",
    category: "Industry",
    excerpt: "Exploring the rising demand for potent herbal extracts in high-end global skincare and beauty formulations.",
    img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    slug: "ashwagandha-global-demand",
    title: "Why Ashwagandha is Taking Over the World",
    date: "October 30, 2024",
    readTime: "8 min read",
    category: "Market Insights",
    excerpt: "From ancient Ayurvedic remedy to global wellness superstar — tracing the meteoric rise of Withania somnifera.",
    img: "https://images.unsplash.com/photo-1608248593822-297cce07210e?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    slug: "gmp-certification-meaning",
    title: "What GMP Certification Really Means",
    date: "October 10, 2024",
    readTime: "5 min read",
    category: "Quality",
    excerpt: "Breaking down what Good Manufacturing Practice certification entails and why it should matter to every ingredient buyer.",
    img: "https://images.unsplash.com/photo-1532054944321-df13180424de?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    slug: "curcumin-bioavailability",
    title: "Solving Curcumin's Bioavailability Challenge",
    date: "September 25, 2024",
    readTime: "6 min read",
    category: "Science",
    excerpt: "Curcumin is potent in the lab but poorly absorbed in the body. Here's how modern formulation science is solving this challenge.",
    img: "https://images.unsplash.com/photo-1615486171448-4fd18c64d852?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
];

const categories = ["All", "Science", "Sustainability", "Industry", "Market Insights", "Quality"];

export default function Blog() {
  const featured = BLOGS.find(b => b.featured);
  const rest = BLOGS.filter(b => !b.featured);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Insights & Research"
          subtitle="Industry news, scientific breakthroughs, and botanical knowledge from our experts."
          image={hero2}
          breadcrumbs={[{ label: "Blog" }]}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">

            {/* Featured Post */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-14 group"
              >
                <div className="rounded-3xl overflow-hidden bg-card border border-border shadow-md flex flex-col md:flex-row">
                  <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
                    <img src={featured.img} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">Featured</div>
                  </div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{featured.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-foreground/70 mb-6 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{featured.date}</span>
                      <Link href={`/blog/${featured.slug}`}>
                        <Button className="rounded-full" data-testid={`btn-blog-featured`}>
                          Read Article <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((blog, idx) => (
                <motion.article
                  key={blog.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                  data-testid={`card-blog-${idx}`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-foreground">{blog.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>{blog.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">{blog.title}</h3>
                    <p className="text-foreground/60 text-sm mb-5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                    <Link href={`/blog/${blog.slug}`}>
                      <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all" data-testid={`link-blog-${idx}`}>
                        Read More <ArrowRight className="w-4 h-4" />
                      </a>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
