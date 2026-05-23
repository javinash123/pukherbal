import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf, FlaskConical, Tag } from "lucide-react";
import { Link, useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=1200";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getProduct(slug)
      .then(async (prod) => {
        setProduct(prod);
        // Fetch category name and related products
        if (prod.categoryId) {
          const cats = await api.getCategories().catch(() => []);
          const cat = cats.find((c: any) => c.id === prod.categoryId);
          if (cat) setCategory(cat.name);
          const related = await api.getProducts(prod.categoryId).catch(() => []);
          setRelatedProducts(related.filter((p: any) => p.slug !== slug).slice(0, 4));
        }
      })
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

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <h2 className="text-2xl font-serif font-bold text-foreground">Product not found</h2>
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Button>
          </Link>
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
        <section className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
          <img
            src={product.imageUrl || FALLBACK_IMG}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-12 pt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {category && (
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold text-xs mb-4 inline-block">
                  {category}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-3xl leading-tight">
                {product.name}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Link href="/products" className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-10 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Products
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-2xl overflow-hidden aspect-square shadow-xl"
                >
                  <img
                    src={product.imageUrl || FALLBACK_IMG}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">{product.name}</h2>

                  {/* Specs badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.specification && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary font-medium text-sm rounded-full">
                        <FlaskConical className="w-3.5 h-3.5" />
                        {product.specification}
                      </span>
                    )}
                    {product.casNumber && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-secondary/20 text-secondary-foreground font-medium text-sm rounded-full">
                        <Tag className="w-3.5 h-3.5" />
                        CAS: {product.casNumber}
                      </span>
                    )}
                    {category && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-muted text-muted-foreground font-medium text-sm rounded-full">
                        <Leaf className="w-3.5 h-3.5" />
                        {category}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-foreground/70 text-lg leading-relaxed mb-8">{product.description}</p>
                  )}

                  <div className="space-y-3 mb-8 border border-border rounded-2xl p-6 bg-muted/20">
                    <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">Product Details</h4>
                    {product.specification && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Specification</span>
                        <span className="text-foreground font-semibold">{product.specification}</span>
                      </div>
                    )}
                    {product.casNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">CAS Number</span>
                        <span className="text-foreground font-semibold">{product.casNumber}</span>
                      </div>
                    )}
                    {category && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Category</span>
                        <span className="text-foreground font-semibold">{category}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Link href="/contact">
                      <Button size="lg" className="rounded-full px-8 flex-1 sm:flex-none">
                        Enquiry Now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white flex-1 sm:flex-none">
                        Request Sample
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Related Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((prod, idx) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                    >
                      <Link href={`/products/${prod.slug}`} className="block bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="aspect-square overflow-hidden bg-muted/30">
                          <img
                            src={prod.imageUrl || FALLBACK_IMG}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors text-sm line-clamp-2">{prod.name}</h4>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Need a Custom Formulation?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Our R&D team can develop custom botanical extracts to your exact specifications.</p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                Request a Custom Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
