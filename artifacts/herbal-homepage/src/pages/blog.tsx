import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import hero2 from "@/assets/hero-2.png";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800";

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs().then(setBlogs).finally(() => setLoading(false));
  }, []);

  const featured = blogs.find(b => b.featured);
  const rest = blogs.filter(b => !b.featured);

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
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No blog posts published yet.</p>
              </div>
            ) : (
              <>
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
                        <img src={featured.imageUrl || FALLBACK_IMG} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">Featured</div>
                      </div>
                      <div className="md:w-1/2 p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          {featured.category && <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{featured.category}</span>}
                          {featured.readTime && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>}
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{featured.title}</h2>
                        <p className="text-foreground/70 mb-6 leading-relaxed">{featured.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{new Date(featured.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                          <Link href={`/blog/${featured.slug}`}>
                            <Button className="rounded-full">
                              Read Article <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((blog, idx) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img src={blog.imageUrl || FALLBACK_IMG} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {blog.category && (
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-foreground">{blog.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span>{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                          {blog.readTime && <><span>·</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span></>}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">{blog.title}</h3>
                        <p className="text-foreground/60 text-sm mb-5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                        <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
