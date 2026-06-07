import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import prodAshwagandha from "@/assets/product-ashwagandha.png";
import prodTurmeric from "@/assets/product-turmeric.png";
import prodNeem from "@/assets/product-neem.png";
import prodBrahmi from "@/assets/product-brahmi.png";
import prodAmla from "@/assets/product-amla.png";
import prodMoringa from "@/assets/product-moringa.png";
import catExtracts from "@/assets/category-extracts.jpg";

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

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");

  useSEO({
    title: category ? (category.metaTitle || `${category.name} | Pukhraj Herbals`) : undefined,
    description: category?.metaDescription || category?.description,
    keywords: category?.metaKeywords,
    ogImage: category?.imageUrl,
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api.getCategory(slug)
      .then(setCategory)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading category...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">📂</p>
            <h2 className="text-2xl font-serif font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-6">This category may have been removed or the link is incorrect.</p>
            <Link href="/categories"><Button variant="outline">Browse All Categories</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products: any[] = category.products || [];
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const heroImg = category.imageUrl || catExtracts;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title={category.name}
          subtitle={category.description || `Browse our premium ${category.name.toLowerCase()} — crafted under strict GMP & ISO standards.`}
          image={heroImg}
          breadcrumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
        />

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <p className="text-sm text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? "s" : ""} in this category</p>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${category.name}...`}
                className="w-full md:w-64 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                {products.length === 0 ? (
                  <>
                    <p className="text-4xl mb-4">🌿</p>
                    <p className="text-lg font-medium">No products in this category yet.</p>
                    <Link href="/contact" className="mt-4 inline-block">
                      <Button variant="outline" className="mt-4 rounded-full">Contact Us for Custom Orders</Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-lg">No products match your search.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => {
                  const fb = getFallback(product.slug);
                  return (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                        <div className="relative aspect-square overflow-hidden bg-muted/30">
                          {product.imageUrl || fb ? (
                            <img
                              src={product.imageUrl || fb!}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={e => { if (fb) (e.target as HTMLImageElement).src = fb; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                              <span className="text-5xl opacity-30">🌿</span>
                            </div>
                          )}
                          {product.featured && (
                            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">Featured</span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-sm font-medium flex items-center gap-1.5">View Details <ArrowRight className="w-4 h-4" /></span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{product.name}</h3>
                          {product.specification && <p className="text-xs text-muted-foreground mt-1.5">Spec: {product.specification}</p>}
                          {product.casNumber && <p className="text-xs text-muted-foreground mt-0.5">CAS: {product.casNumber}</p>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">Need a Custom {category.name} Solution?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">Our team can create customized formulations to meet your exact requirements.</p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
