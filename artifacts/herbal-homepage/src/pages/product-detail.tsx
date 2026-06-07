import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowRight, ArrowLeft, Tag, FlaskConical } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import prodAshwagandha from "@/assets/product-ashwagandha.png";
import prodTurmeric from "@/assets/product-turmeric.png";
import prodNeem from "@/assets/product-neem.png";
import prodBrahmi from "@/assets/product-brahmi.png";
import prodAmla from "@/assets/product-amla.png";
import prodMoringa from "@/assets/product-moringa.png";

const FALLBACK_IMAGES: Record<string, string> = {
  ashwagandha: prodAshwagandha,
  turmeric: prodTurmeric,
  neem: prodNeem,
  brahmi: prodBrahmi,
  amla: prodAmla,
  moringa: prodMoringa,
};

function getFallback(slug: string) {
  for (const [key, img] of Object.entries(FALLBACK_IMAGES)) {
    if (slug.includes(key)) return img;
  }
  return null;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSEO({
    title: product ? (product.metaTitle || `${product.name} | Pukhraj Herbals`) : undefined,
    description: product?.metaDescription || product?.description?.replace(/<[^>]*>/g, "").slice(0, 160),
    keywords: product?.metaKeywords,
    ogImage: product?.imageUrl,
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.getProduct(slug)
      .then(async (prod) => {
        setProduct(prod);
        if (prod.categoryId) {
          const [cats, allProds] = await Promise.all([api.getCategories(), api.getProducts(prod.categoryId)]);
          setCategory(cats.find((c: any) => c.id === prod.categoryId) || null);
          setRelated(allProds.filter((p: any) => p.slug !== slug).slice(0, 4));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const imgSrc = product?.imageUrl || (slug ? getFallback(slug) : null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌿</p>
            <h2 className="text-2xl font-serif font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">This product may have been removed or the link is incorrect.</p>
            <Link href="/products"><Button variant="outline">Browse All Products</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-[72px]">
        {/* Product hero */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <div className="relative rounded-3xl overflow-hidden aspect-square bg-muted/30 shadow-lg">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      const el = e.target as HTMLImageElement;
                      const fb = slug ? getFallback(slug) : null;
                      if (fb && el.src !== fb) { el.src = fb; return; }
                      el.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                    <span className="text-8xl opacity-30">🌿</span>
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow">Featured</span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-5">
                {category && (
                  <Link href={`/categories/${category.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline w-fit">
                    <Tag className="w-3.5 h-3.5" />
                    {category.name}
                  </Link>
                )}

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">{product.name}</h1>

                <div className="flex flex-col gap-3">
                  {product.specification && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                      <FlaskConical className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">Specification</p>
                        <p className="text-sm text-foreground/80">{product.specification}</p>
                      </div>
                    </div>
                  )}
                  {product.casNumber && (
                    <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border rounded-xl">
                      <span className="text-sm font-mono text-primary mt-0.5 shrink-0">CAS</span>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">CAS Number</p>
                        <p className="text-sm font-mono text-foreground">{product.casNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {product.description && (
                  <div
                    className="prose prose-sm max-w-none text-foreground/75 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/contact">
                    <Button size="lg" className="rounded-full w-full sm:w-auto">
                      Request Enquiry <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                      <ArrowLeft className="mr-2 w-4 h-4" /> All Products
                    </Button>
                  </Link>
                </div>

                {/* Certifications badge row */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["GMP Certified", "ISO 9001", "FSSAI Approved", "Halal & Kosher"].map(cert => (
                    <span key={cert} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-8">More from {category?.name || "This Category"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => {
                  const relFb = getFallback(p.slug);
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`}>
                      <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                        <div className="aspect-square overflow-hidden bg-muted/30">
                          {p.imageUrl || relFb ? (
                            <img
                              src={p.imageUrl || relFb!}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={e => { if (relFb) (e.target as HTMLImageElement).src = relFb; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                              <span className="text-3xl opacity-30">🌿</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                          {p.specification && <p className="text-xs text-muted-foreground mt-1">{p.specification}</p>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">Interested in {product.name}?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">Get in touch with our team for bulk pricing, custom specifications, and samples.</p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                Contact Us Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
