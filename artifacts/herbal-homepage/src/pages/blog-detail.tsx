import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api, resolveImageUrl } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200";

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return iso; }
}

export default function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSEO({
    title: blog ? (blog.seoTitle || `${blog.title} | Pukhraj Herbals`) : undefined,
    description: blog?.seoDescription || blog?.excerpt,
    keywords: blog?.seoKeywords,
    ogImage: blog?.imageUrl,
  });

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
        <main className="flex-1">
          <div className="h-[55vh] min-h-[360px] bg-muted animate-pulse" />
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`h-4 bg-muted/50 rounded animate-pulse ${i % 3 === 2 ? "w-3/4" : "w-full"}`} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-foreground/60 mb-6">This blog post doesn't exist or has been unpublished.</p>
            <Link href="/blog"><Button className="rounded-full">Back to Blog</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
          <img
            src={resolveImageUrl(blog.imageUrl) || DEFAULT_IMG}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-12 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm flex-wrap">
                {blog.category && (
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-xs">{blog.category}</span>
                )}
                <span>{formatDate(blog.createdAt)}</span>
                {blog.readTime && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                  </>
                )}
                {blog.author && blog.author !== "Pukhraj Herbals" && (
                  <>
                    <span>·</span>
                    <span>By {blog.author}</span>
                  </>
                )}
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

              {blog.excerpt && (
                <p className="text-xl text-foreground/70 leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4 italic">
                  {blog.excerpt}
                </p>
              )}

              {blog.content ? (
                <div
                  className="prose prose-lg max-w-none text-foreground/80
                    prose-headings:font-serif prose-headings:text-foreground
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                    prose-p:leading-relaxed prose-p:mb-4
                    prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6
                    prose-li:mb-1
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/60
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-a:text-primary prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-foreground/60 italic">No content available for this post.</p>
              )}

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
