import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { api } from "@/lib/api";
import hero3 from "@/assets/hero-3.png";

interface DynCategory {
  id: string;
  name: string;
  slug: string;
}

interface DynProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
}

interface DynBlog {
  title: string;
  slug: string;
}

function SitemapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary hover:underline underline-offset-4 transition-colors group"
    >
      <ChevronRight className="w-3 h-3 text-primary/40 group-hover:text-primary shrink-0" />
      {children}
    </Link>
  );
}

function Section({
  title,
  color,
  children,
  delay,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className={`${color} px-5 py-3.5`}>
        <h2 className="text-base font-semibold text-white tracking-wide">{title}</h2>
      </div>
      <div className="p-5 space-y-1.5">{children}</div>
    </motion.div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-2 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 px-1">
        {title}
      </p>
      <div className="space-y-1 pl-1">{children}</div>
    </div>
  );
}

export default function Sitemap() {
  const [categories, setCategories] = useState<DynCategory[]>([]);
  const [products, setProducts] = useState<DynProduct[]>([]);
  const [blogs, setBlogs] = useState<DynBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.getProducts(), api.getCategories(), api.getBlogs()])
      .then(([prodsR, catsR, blgsR]) => {
        if (prodsR.status === "fulfilled") setProducts(prodsR.value as DynProduct[]);
        if (catsR.status === "fulfilled") setCategories(catsR.value as DynCategory[]);
        if (blgsR.status === "fulfilled") setBlogs(blgsR.value as DynBlog[]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group products by category
  const catMap = new Map<string, DynProduct[]>();
  for (const cat of categories) catMap.set(cat.id, []);
  for (const prod of products) {
    const cid = prod.categoryId ? String(prod.categoryId) : "";
    if (cid && catMap.has(cid)) catMap.get(cid)!.push(prod);
  }
  const uncategorised = products.filter(
    (p) => !p.categoryId || !catMap.has(String(p.categoryId))
  );

  // Count total dynamic pages
  const totalDynamic = categories.length + products.length + blogs.length;
  const totalStatic = 13; // all static public pages
  const total = totalStatic + totalDynamic;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Site Map"
          subtitle="A complete overview of all pages on Pukhraj Herbals — find exactly what you're looking for."
          image={hero3}
          breadcrumbs={[{ label: "Sitemap" }]}
        />

        <section className="py-14 md:py-20 bg-background">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">

            {/* Header */}
            <div className="text-center mb-10">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-muted-foreground text-sm"
              >
                {loading
                  ? "Loading…"
                  : `${total} total pages across all sections`}
              </motion.p>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {/* Main Pages */}
              <Section title="🏠  Main Pages" color="bg-emerald-600" delay={0}>
                <SitemapLink href="/">Home</SitemapLink>
                <SitemapLink href="/about">About Us</SitemapLink>
                <SitemapLink href="/contact">Contact Us</SitemapLink>
                <SitemapLink href="/sitemap">Site Map</SitemapLink>
              </Section>

              {/* Company */}
              <Section title="🏭  Company" color="bg-teal-600" delay={0.05}>
                <SitemapLink href="/manufacturing">Manufacturing Facility</SitemapLink>
                <SitemapLink href="/certifications">Certifications</SitemapLink>
                <SitemapLink href="/sustainability">Sustainability</SitemapLink>
              </Section>

              {/* Blog */}
              <Section title="📝  Blog &amp; Research" color="bg-green-700" delay={0.1}>
                <SitemapLink href="/blog">All Blog Posts</SitemapLink>
                {loading ? (
                  <p className="text-xs text-muted-foreground pl-4 pt-1">Loading articles…</p>
                ) : blogs.length > 0 ? (
                  <SubSection title="Articles">
                    {blogs.map((b) => (
                      <SitemapLink key={b.slug} href={`/blog/${b.slug}`}>
                        {b.title}
                      </SitemapLink>
                    ))}
                  </SubSection>
                ) : (
                  <p className="text-xs text-muted-foreground pl-4 pt-1 italic">
                    No articles published yet
                  </p>
                )}
              </Section>

              {/* Categories */}
              <Section title="📂  Categories" color="bg-emerald-700" delay={0.15}>
                <SitemapLink href="/categories">All Categories</SitemapLink>
                {loading ? (
                  <p className="text-xs text-muted-foreground pl-4 pt-1">Loading categories…</p>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <SitemapLink key={cat.id} href={`/categories/${cat.slug}`}>
                      {cat.name}
                    </SitemapLink>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground pl-4 pt-1 italic">
                    No categories added yet
                  </p>
                )}
              </Section>

              {/* Products */}
              <Section title="🌿  Products" color="bg-green-800" delay={0.2}>
                <SitemapLink href="/products">All Products</SitemapLink>
                {loading ? (
                  <p className="text-xs text-muted-foreground pl-4 pt-1">Loading products…</p>
                ) : categories.length > 0 ? (
                  <>
                    {categories.map((cat) => {
                      const catProds = catMap.get(cat.id) ?? [];
                      return catProds.length > 0 ? (
                        <SubSection key={cat.id} title={cat.name}>
                          {catProds.map((p) => (
                            <SitemapLink key={p.slug} href={`/products/${p.slug}`}>
                              {p.name}
                            </SitemapLink>
                          ))}
                        </SubSection>
                      ) : null;
                    })}
                    {uncategorised.length > 0 && (
                      <SubSection title="Other Products">
                        {uncategorised.map((p) => (
                          <SitemapLink key={p.slug} href={`/products/${p.slug}`}>
                            {p.name}
                          </SitemapLink>
                        ))}
                      </SubSection>
                    )}
                    {products.length === 0 && (
                      <p className="text-xs text-muted-foreground pl-4 pt-1 italic">
                        No products added yet
                      </p>
                    )}
                  </>
                ) : products.length > 0 ? (
                  products.map((p) => (
                    <SitemapLink key={p.slug} href={`/products/${p.slug}`}>
                      {p.name}
                    </SitemapLink>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground pl-4 pt-1 italic">
                    No products added yet
                  </p>
                )}
              </Section>

              {/* Quick Links / Utilities */}
              <Section title="🔗  Quick Links" color="bg-lime-700" delay={0.2}>
                <SitemapLink href="/contact">Get a Quote</SitemapLink>
                <SitemapLink href="/contact">Request a Sample</SitemapLink>
                <SitemapLink href="/contact">Partner With Us</SitemapLink>
                <SitemapLink href="/about">Our Story</SitemapLink>
                <SitemapLink href="/certifications">Quality &amp; Standards</SitemapLink>
              </Section>

            </div>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-14 p-8 bg-muted/40 rounded-2xl border border-border text-center"
            >
              <ExternalLink className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Can't find what you need?
              </h3>
              <p className="text-muted-foreground mb-5 text-sm max-w-md mx-auto">
                Our team is happy to help you navigate our full product range and answer any
                questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
