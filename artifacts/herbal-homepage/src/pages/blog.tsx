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

// Placeholder blog images by index for blogs without imageUrl
const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1608248593822-297cce07210e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1532054944321-df13180424de?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1615486171448-4fd18c64d852?auto=format&fit=crop&q=80&w=800",
];

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = blogs.find(b => b.featured) || blogs[0];
  const rest = blogs.filter(b => b !== featured);

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
              <div className="space-y-8">
                <div className="rounded-3xl overflow-hidden bg-card border border-border animate-pulse h-72" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                      <div className="h-52 bg-muted/50" />
                      <div className="p-6 space-y-2">
                        <div className="h-4 bg-muted/50 rounded w-3/4" />
                        <div className="h-3 bg-muted/50 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
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
                        <img
                          src={featured.imageUrl || PLACEHOLDER_IMGS[0]}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">Featured</div>
                      </div>
                      <div className="md:w-1/2 p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          {featured.category && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{featured.category}</span>
                          )}
                          {featured.readTime && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />{featured.readTime}
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{featured.title}</h2>
                        {featured.excerpt && (
                          <p className="text-foreground/70 mb-6 leading-relaxed">{featured.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{formatDate(featured.createdAt)}</span>
                          <Link href={`/blog/${featured.slug}`}>
                            <Button className="rounded-full">Read Article <ArrowRight className="ml-2 w-4 h-4" /></Button>
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
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={blog.imageUrl || PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length]}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {blog.category && (
                          <div className="absolute top-4 left-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/90 text-foreground">{blog.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span>{formatDate(blog.createdAt)}</span>
                          {blog.readTime && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">{blog.title}</h3>
                        {blog.excerpt && (
                          <p className="text-foreground/60 text-sm mb-5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                        )}
                        <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {blogs.length === 0 && (
                  <div className="text-center py-24 text-muted-foreground">
                    <p className="text-lg">No blog posts published yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
