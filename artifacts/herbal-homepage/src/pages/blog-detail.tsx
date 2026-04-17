import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200";

export default function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getBlog(slug)
      .then(setBlog)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <h2 className="text-2xl font-serif font-bold text-foreground">Blog post not found</h2>
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const paragraphs = blog.content ? blog.content.split(/\n+/).filter(Boolean) : [];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
          <img src={blog.imageUrl || FALLBACK_IMG} alt={blog.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-12 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm flex-wrap">
                {blog.category && <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-xs">{blog.category}</span>}
                <span>{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                {blog.readTime && <><span>·</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span></>}
                {blog.author && <><span>·</span><span>By {blog.author}</span></>}
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
                <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-10 hover:gap-3 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </a>
              </Link>
              <div className="prose prose-lg max-w-none">
                {paragraphs.length > 0 ? paragraphs.map((para: string, i: number) => (
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
                )) : (
                  <p className="text-foreground/60 italic">No content available for this post.</p>
                )}
              </div>

              {/* CTA */}
              <div className="mt-14 p-10 bg-muted/30 rounded-3xl border border-border text-center">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Interested in Our Extracts?</h3>
                <p className="text-foreground/70 mb-6">Our team is ready to help you find the right botanical ingredient for your formulation.</p>
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8">
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
