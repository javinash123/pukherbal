import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { api, resolveImageUrl } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import { useSettings } from "@/lib/settings";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight, Play, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter, FaLeaf, FaFlask, FaSeedling, FaShieldAlt, FaGlobe, FaAward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Assets (Using the generated & stock images)
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import aboutImg from "@assets/image_3.jpg_1781680763629.jpeg";
import prodAshwagandha from "@/assets/product-ashwagandha.png";
import prodTurmeric from "@/assets/product-turmeric.png";
import prodNeem from "@/assets/product-neem.png";
import prodBrahmi from "@/assets/product-brahmi.png";
import prodAmla from "@/assets/product-amla.png";
import prodMoringa from "@/assets/product-moringa.png";
import catExtracts from "@/assets/category-extracts.jpg";
import catPowders from "@/assets/category-powders.jpg";
import catOils from "@/assets/category-oils.jpg";
import catHerbs from "@/assets/category-herbs.jpg";
import catStandardized from "@/assets/category-standardized.jpg";
import catCarrier from "@/assets/category-carrier.jpg";

export default function Home() {
  const settings = useSettings();
  useSEO({
    title: settings["seo_meta_title"] || undefined,
    description: settings["seo_meta_description"],
    keywords: settings["seo_meta_keywords"],
    ogImage: settings["seo_og_image"] || undefined,
  });

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <LatestProductsSection />
        <CategoriesSection />
        <ProductMotionSection />
        <KeyProductsSection />
        <BlogSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

const STATIC_SLIDES = [
  { imageUrl: "", image: hero1, title: "Nature's Pharmacy, Modern Precision", subtitle: "Premium botanical extracts manufactured under strict GMP & ISO standards.", ctaText: "Explore Our Extracts", ctaLink: "/products" },
  { imageUrl: "", image: hero2, title: "Ancient Wisdom, Scientifically Proven", subtitle: "Highest quality Ayurvedic powders and roots sourced directly from pristine farms.", ctaText: "View Our Powders", ctaLink: "/categories" },
  { imageUrl: "", image: hero3, title: "Pure, Potent, Pristine", subtitle: "Essential oils extracted with utmost care to preserve nature's true essence.", ctaText: "Discover Essential Oils", ctaLink: "/categories" },
];

function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiSlides, setApiSlides] = useState<any[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    api.getHeroSlides().then(data => { if (data && data.length > 0) setApiSlides(data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => { if (emblaApi) emblaApi.scrollNext(); }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const slides = apiSlides.length > 0
    ? apiSlides.map((s, i) => ({ ...s, image: [hero1, hero2, hero3][i % 3], cta: s.ctaText || "Learn More" }))
    : STATIC_SLIDES.map(s => ({ ...s, cta: s.ctaText }));

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%] min-w-0">
              <img src={resolveImageUrl(slide.imageUrl) || slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent"></div>
              
              <div className="container mx-auto px-4 md:px-6 h-full flex items-center relative z-10">
                <div className="max-w-2xl text-left">
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight mb-6"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-foreground/80 mb-10 max-w-xl font-medium"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: index === selectedIndex ? 1 : 0, y: index === selectedIndex ? 0 : 30 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link href={slide.ctaLink || "/products"}>
                      <Button size="lg" className="text-base h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" data-testid={`btn-hero-cta-${index}`}>
                        {slide.cta}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-20 container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-primary w-8" : "bg-foreground/30 hover:bg-primary/50"}`}
              data-testid={`btn-hero-dot-${index}`}
            />
          ))}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={scrollPrev} 
            className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all backdrop-blur-sm"
            data-testid="btn-hero-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollNext} 
            className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all backdrop-blur-sm"
            data-testid="btn-hero-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto lg:ml-0">
              <img src={aboutImg} alt="Botanical Lab" className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10"></div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="absolute bottom-8 right-2 sm:bottom-12 sm:-right-6 lg:-right-12 bg-card p-4 sm:p-6 rounded-xl shadow-xl border border-border max-w-[200px] sm:max-w-xs">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
                <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">25+</div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Years of Botanical Excellence</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">About Pukhraj Herbals</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              Bridging Ancient Tradition & Modern Science
            </h3>
            <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
              We are a premier manufacturer of GMP & ISO certified natural extracts, powders, and essential oils. Our state-of-the-art facilities ensure that the profound wisdom of Ayurveda is delivered with uncompromising precision and purity.
            </p>
            <p className="text-base text-foreground/70 mb-8 leading-relaxed">
              From sustainable sourcing of raw botanicals to advanced extraction methodologies, every step of our process is designed to preserve the delicate active compounds of nature while meeting the rigorous demands of global pharmaceutical, nutraceutical, and cosmetic industries.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: "500+", label: "Products" },
                { value: "30+", label: "Countries" },
                { value: "98%", label: "Client Retention" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                  className="bg-muted/50 rounded-2xl p-4 text-center border border-border/50"
                >
                  <div className="text-2xl md:text-3xl font-serif font-bold text-primary">{value}</div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">{label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button size="lg" className="rounded-full px-8 h-12" data-testid="btn-about-readmore">
                  Read Our Story
                </Button>
              </Link>
              <Link href="/certifications">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid="btn-about-certifications">
                  View Certifications
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const HOME_FALLBACK_IMAGES: Record<string, string> = {
  ashwagandha: prodAshwagandha,
  turmeric: prodTurmeric,
  neem: prodNeem,
  brahmi: prodBrahmi,
  amla: prodAmla,
  moringa: prodMoringa,
};

function getProductFallback(slug: string): string | null {
  for (const [key, img] of Object.entries(HOME_FALLBACK_IMAGES)) {
    if (slug.includes(key)) return img;
  }
  return null;
}

function LatestProductsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    dragFree: true,
  });
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    api.getProducts().then(setLiveProducts).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const staticProducts = [
    { name: "Ashwagandha Extract", desc: "Standardized to 5% Withanolides. Premium adaptogen for stress support.", img: prodAshwagandha, slug: "ashwagandha" },
    { name: "Turmeric Powder", desc: "High Curcumin content. Anti-inflammatory powerhouse.", img: prodTurmeric, slug: "turmeric" },
    { name: "Neem Oil", desc: "Cold-pressed pure oil. Exceptional for skin and cosmetic formulations.", img: prodNeem, slug: "neem" },
    { name: "Brahmi Extract", desc: "Standardized Bacosides. Cognitive support and mental clarity.", img: prodBrahmi, slug: "brahmi" },
    { name: "Amla Powder", desc: "Rich in Vitamin C. Antioxidant and immune support.", img: prodAmla, slug: "amla" },
    { name: "Moringa Extract", desc: "Nutrient-dense superfood extract for vitality.", img: prodMoringa, slug: "moringa" },
  ];

  const displayProducts = liveProducts.length > 0
    ? liveProducts.map(p => ({
        name: p.name,
        desc: p.description?.replace(/<[^>]*>/g, "").slice(0, 100) || "",
        img: resolveImageUrl(p.imageUrl) || getProductFallback(p.slug) || prodAshwagandha,
        slug: p.slug,
      }))
    : staticProducts;

  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">Our Innovations</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Latest Products</h3>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="btn-products-prev">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="btn-products-next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex ml-4 md:ml-6 lg:ml-8 gap-6 touch-pan-y">
          {displayProducts.map((product, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 group"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm group-hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-muted/50 cursor-pointer">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <Button variant="secondary" className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-full" data-testid={`btn-product-read-${idx}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="p-5 pb-3 flex flex-col flex-1">
                    <h4 className="text-xl font-serif font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.desc}</p>
                  </div>
                </Link>
                <div className="px-5 pb-5 pt-2">
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="w-full rounded-full text-xs" data-testid={`btn-product-enquiry-${idx}`}>
                      Enquiry Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CAT_FALLBACK_IMAGES: Record<string, string> = {
  extract: catExtracts,
  powder: catPowders,
  oil: catOils,
  herb: catHerbs,
  standard: catStandardized,
  carrier: catCarrier,
};

function getCatFallback(slug: string, name: string): string {
  const s = (slug + name).toLowerCase();
  for (const [key, img] of Object.entries(CAT_FALLBACK_IMAGES)) {
    if (s.includes(key)) return img;
  }
  return catExtracts;
}

function CategoriesSection() {
  const [liveCategories, setLiveCategories] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(setLiveCategories).catch(() => {});
  }, []);

  const staticCategories = [
    { name: "Extracts", slug: "extracts", img: catExtracts },
    { name: "Powders", slug: "powders", img: catPowders },
    { name: "Essential Oils", slug: "essential-oils", img: catOils },
    { name: "Ayurvedic Herbs", slug: "ayurvedic-herbs", img: catHerbs },
    { name: "Standardized Extracts", slug: "standardized-extracts", img: catStandardized },
    { name: "Carrier Oils", slug: "carrier-oils", img: catCarrier },
  ];

  const displayCategories = liveCategories.length > 0
    ? liveCategories.map(c => ({ name: c.name, slug: c.slug, img: resolveImageUrl(c.imageUrl) || getCatFallback(c.slug, c.name) }))
    : staticCategories;

  return (
    <section id="categories" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Our Product Categories</h2>
          <p className="text-foreground/70 text-lg">Premium quality natural extracts, powders & oils manufactured under strict GMP & ISO standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
            >
              <Link href={`/categories/${cat.slug}`} className="block w-full h-full">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).src = catExtracts; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 text-sm font-medium">
                    <span>View Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATIC_MOTIONS = [
  { title: "Botanical Sourcing", thumbnailUrl: "", img: catHerbs, videoUrl: "" },
  { title: "Precision Extraction", thumbnailUrl: "", img: catExtracts, videoUrl: "" },
  { title: "Quality Assurance", thumbnailUrl: "", img: catStandardized, videoUrl: "" },
  { title: "Final Product", thumbnailUrl: "", img: catOils, videoUrl: "" },
];

function ProductMotionSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const [apiMotions, setApiMotions] = useState<any[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    api.getVideoItems().then(data => { if (data && data.length > 0) setApiMotions(data); }).catch(() => {});
  }, []);

  const motions = apiMotions.length > 0
    ? apiMotions.map((v, i) => ({ ...v, img: [catHerbs, catExtracts, catStandardized, catOils, catPowders, catCarrier][i % 6] }))
    : STATIC_MOTIONS;

  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Product in Motion</h2>
            <p className="text-background/70">See our pristine manufacturing process in action.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex ml-4 md:ml-6 lg:ml-8 gap-6 touch-pan-y">
          {motions.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-[0_0_75%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0"
            >
              <div className="flex flex-col gap-4">
                <div
                  className="relative rounded-2xl overflow-hidden aspect-[9/16] group cursor-pointer"
                  onClick={() => { if (item.videoUrl) window.open(item.videoUrl, "_blank", "noopener"); }}
                >
                  <img src={item.thumbnailUrl || item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => { (e.target as HTMLImageElement).src = item.img; }} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/90 transition-all">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-serif font-bold mb-3">{item.title}</h4>
                  {item.productSlug ? (
                    <Link href={`/products/${item.productSlug}`}>
                      <Button variant="outline" className="w-full rounded-full border-background/20 hover:bg-primary hover:text-white hover:border-primary text-background bg-transparent">
                        View Product
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/contact">
                      <Button variant="outline" className="w-full rounded-full border-background/20 hover:bg-primary hover:text-white hover:border-primary text-background bg-transparent">
                        Enquiry Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyProductsSection() {
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  const staticProducts = [
    { name: "Curcumin 95%", slug: "curcumin-95", desc: "Highly purified turmeric extract. A potent anti-inflammatory and antioxidant compound used in premium nutraceuticals globally.", tags: ["Anti-inflammatory", "Antioxidant", "Standardized 95%"], img: prodTurmeric },
    { name: "Premium Ashwagandha", slug: "premium-ashwagandha", desc: "Our signature adaptogenic root extract. Cultivated in pristine soils and processed to preserve the complete spectrum of active withanolides.", tags: ["Adaptogen", "Stress Relief", "KSM-66 Equivalent"], img: prodAshwagandha },
    { name: "Pure Bacopa Monnieri", slug: "pure-bacopa-monnieri", desc: "Ancient nootropic herb extracted with modern precision to support cognitive function, memory, and mental clarity.", tags: ["Nootropic", "Cognitive Support", "Standardized Bacosides"], img: prodBrahmi },
  ];

  useEffect(() => {
    api.getProducts().then(prods => {
      if (prods && prods.length > 0) {
        setLiveProducts(prods.slice(0, 3).map((p: any, i: number) => ({
          name: p.name,
          slug: p.slug,
          desc: p.description?.replace(/<[^>]*>/g, "").slice(0, 200) || staticProducts[i % staticProducts.length].desc,
          tags: [],
          img: resolveImageUrl(p.imageUrl) || staticProducts[i % staticProducts.length].img,
        })));
      }
    }).catch(() => {});
  }, []);

  const products = liveProducts.length > 0 ? liveProducts : staticProducts;

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground mb-4">Featured Excellence</h2>
          <p className="text-foreground/70 text-base md:text-lg">Our flagship products, representing the pinnacle of botanical extraction technology.</p>
        </div>

        <div className="grid gap-10 lg:gap-16">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg group">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">{product.name}</h3>
                <p className="text-base md:text-lg text-foreground/70 mb-6 leading-relaxed">{product.desc}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {product.tags.map((tag: string) => (
                      <span key={tag} className="px-4 py-1.5 bg-primary/10 text-primary font-medium text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link href={`/products/${product.slug}`}>
                  <Button size="lg" className="rounded-full px-8 hover:shadow-lg transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATIC_BLOGS = [
  { slug: "", title: "The Science of Standardized Extracts", createdAt: "2023-10-12", excerpt: "Understanding why standardization is critical for consistent therapeutic results in nutraceuticals.", imageUrl: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800" },
  { slug: "", title: "Sustainable Botanical Sourcing", createdAt: "2023-09-28", excerpt: "How our farm-to-flask approach ensures quality while protecting the earth's delicate ecosystems.", imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800" },
  { slug: "", title: "Ayurveda in Modern Cosmetics", createdAt: "2023-09-15", excerpt: "Exploring the rising demand for potent herbal extracts in high-end global skincare formulations.", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" },
];

function formatBlogDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}

function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>(STATIC_BLOGS);

  useEffect(() => {
    api.getBlogs().then(data => { if (data && data.length > 0) setBlogs(data.filter((b: any) => b.published !== false).slice(0, 3)); }).catch(() => {});
  }, []);

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Latest Insights</h2>
            <p className="text-foreground/70 text-lg">Industry news, scientific breakthroughs, and botanical knowledge from our experts.</p>
          </div>
          <Link href="/blog"><Button variant="outline" className="rounded-full">View All Articles</Button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog.slug || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <Link href={blog.slug ? `/blog/${blog.slug}` : "/blog"} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={resolveImageUrl(blog.imageUrl)} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    {formatBlogDate(blog.createdAt || blog.date || "")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{blog.title}</h3>
                  <p className="text-foreground/70 mb-6 line-clamp-2">{blog.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsSection() {
  const certs = [
    { label: "GMP Certified", sub: "Good Manufacturing Practice", Icon: FaFlask, color: "from-emerald-400/20 to-emerald-600/20" },
    { label: "ISO 9001:2015", sub: "Quality Management System", Icon: FaShieldAlt, color: "from-blue-400/20 to-blue-600/20" },
    { label: "USDA Organic", sub: "Certified Organic Standards", Icon: FaSeedling, color: "from-green-400/20 to-green-600/20" },
    { label: "Halal Certified", sub: "Globally Recognized Standard", Icon: FaGlobe, color: "from-teal-400/20 to-teal-600/20" },
    { label: "Kosher Certified", sub: "Meets Kosher Requirements", Icon: FaAward, color: "from-amber-400/20 to-amber-600/20" },
    { label: "FSSAI Approved", sub: "Food Safety Standard India", Icon: FaLeaf, color: "from-lime-400/20 to-lime-600/20" },
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Trusted Certifications</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">Our products are validated by globally recognized certifying bodies, ensuring every batch meets the highest standards.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {certs.map(({ label, sub, Icon, color }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, type: "spring", stiffness: 120, damping: 14 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="flex flex-col items-center w-32 md:w-40 gap-4 cursor-pointer"
            >
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-primary-foreground/40 bg-gradient-to-br ${color} backdrop-blur-sm flex items-center justify-center shadow-lg hover:border-primary-foreground transition-all duration-300 relative`}>
                <div className="absolute inset-2 rounded-full border border-primary-foreground/20"></div>
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground drop-shadow-md relative z-10" />
              </div>
              <div className="text-center">
                <span className="block text-sm md:text-base font-bold leading-tight">{label}</span>
                <span className="block text-xs text-primary-foreground/60 mt-1 leading-tight">{sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const phone = settings["contact_phone"] || "+91 98765 43210";
  const email = settings["contact_email"] || "enquiry@pukhrajherbals.com";
  const salesEmail = settings["contact_sales_email"] || "sales@pukhrajherbals.com";
  const address = settings["contact_address"] || "Indore, Madhya Pradesh, India";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setFormError("Please fill in Name, Email, and Message."); return; }
    setSubmitting(true);
    setFormError("");
    try {
      await api.createEnquiry(form);
      setSubmitted(true);
      setForm({ name: "", email: "", company: "", message: "" });
    } catch { setFormError("Failed to submit. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl overflow-hidden shadow-xl border border-border flex flex-col lg:flex-row">
          
          {/* Info Side */}
          <div className="w-full lg:w-2/5 bg-foreground text-background p-10 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <h2 className="text-3xl font-serif font-bold mb-2 relative z-10">Get in Touch</h2>
            <p className="text-primary text-sm font-semibold mb-4 relative z-10">Pukhraj Herbals</p>
            <p className="text-background/70 mb-12 relative z-10">Have questions about our extracts or want to request a quote? Our botanical experts are ready to assist.</p>
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                <div><h4 className="font-semibold mb-1">Our Office</h4><p className="text-background/70 text-sm">{address}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                <div><h4 className="font-semibold mb-1">Call Us</h4><p className="text-background/70 text-sm">{phone}<br/>Mon–Fri: 9am to 6pm</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                <div><h4 className="font-semibold mb-1">Email Us</h4><p className="text-background/70 text-sm">{email}<br/>{salesEmail}</p></div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-3/5 p-10 md:p-12 bg-card">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <CheckCircle2 className="w-14 h-14 text-green-600 mb-4" />
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-foreground/60 mb-6">Thank you. Our team will get back to you within 1–2 business days.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {formError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{formError}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name *</label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address *</label>
                    <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Company Name</label>
                  <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Acme Pharmaceuticals" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Message *</label>
                  <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Please provide details about the extracts or quantities you are looking for..." className="min-h-[150px] bg-muted/50 border-transparent focus:border-primary resize-none" />
                </div>
                <Button type="submit" disabled={submitting} size="lg" className="w-full h-12 rounded-full text-base font-semibold shadow-md hover:shadow-xl transition-all">
                  {submitting ? "Sending..." : "Send Enquiry"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

