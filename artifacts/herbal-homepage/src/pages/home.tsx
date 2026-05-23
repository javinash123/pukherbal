import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import logo from "@/assets/logo-new.png";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight, Play, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaTwitter, FaLeaf, FaFlask, FaSeedling, FaShieldAlt, FaGlobe, FaAward } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

// Assets (Using the generated & stock images)
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import aboutImg from "@/assets/about-image.png";
import catExtracts from "@/assets/category-extracts.jpg";
import catPowders from "@/assets/category-powders.jpg";
import catOils from "@/assets/category-oils.jpg";
import catHerbs from "@/assets/category-herbs.jpg";
import catStandardized from "@/assets/category-standardized.jpg";
import catCarrier from "@/assets/category-carrier.jpg";

const FALLBACK_CAT_IMGS = [catExtracts, catPowders, catOils, catHerbs, catStandardized, catCarrier];
const FALLBACK_PROD_IMG = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600";
const FALLBACK_BLOG_IMG = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800";

export default function Home() {
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
        <TestimonialsSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

const STATIC_SLIDES = [
  { imageUrl: hero1, title: "Nature's Pharmacy, Modern Precision", subtitle: "Premium botanical extracts manufactured under strict GMP & ISO standards.", ctaText: "Explore Our Extracts", ctaLink: "/products" },
  { imageUrl: hero2, title: "Ancient Wisdom, Scientifically Proven", subtitle: "Highest quality Ayurvedic powders and roots sourced directly from pristine farms.", ctaText: "View Our Powders", ctaLink: "/products" },
  { imageUrl: hero3, title: "Pure, Potent, Pristine", subtitle: "Essential oils extracted with utmost care to preserve nature's true essence.", ctaText: "Discover Essential Oils", ctaLink: "/products" },
];

function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState<any[]>(STATIC_SLIDES);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    api.getHeroSlides().then(apiSlides => {
      if (apiSlides.length > 0) setSlides(apiSlides);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    
    // Auto slide
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%] min-w-0">
              <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover object-center" />
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
                        {slide.ctaText || "Explore Now"}
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
    <section id="about" className="py-24 bg-background overflow-hidden">
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
            
            <div className="absolute bottom-12 -right-6 lg:-right-12 bg-card p-6 rounded-xl shadow-xl border border-border max-w-xs">
              <div className="flex items-center gap-4 mb-2">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <div className="text-3xl font-serif font-bold text-foreground">1999</div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Est. in Mandsaur, India's Herbal Capital</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-3">About Pukhraj Herbal</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              Pure Herbs. Proven Trust. Your Partner in Natural Wellness.
            </h3>
            <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
              Pukhraj Herbal is a leading herbal products manufacturer based in Mandsaur, Madhya Pradesh — widely known as India's Herbal Capital. Our 20,000 sq. meter pollution-free campus benefits from a naturally dry and pristine climate ideal for preserving herbal quality.
            </p>
            <p className="text-base text-foreground/70 mb-8 leading-relaxed">
              Founded in 1999 by Mr. Milind Jilhewar with 30+ years of expertise, we specialize in premium herbal extracts, powders, and oils using cold-pressed, supercritical CO₂, and steam distillation methods — trusted by 1000+ global partners across 20+ countries.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: "100+", label: "MT Capacity/Year" },
                { value: "20+", label: "Countries" },
                { value: "1000+", label: "Global Partners" },
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
              <Button size="lg" className="rounded-full px-8 h-12" data-testid="btn-about-readmore">
                Read Our Story
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground" data-testid="btn-about-certifications">
                View Certifications
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LatestProductsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    api.getProducts().then(all => {
      const featured = all.filter((p: any) => p.featured);
      setProducts(featured.length > 0 ? featured : all.slice(0, 6));
    }).catch(() => {});
  }, []);

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
          {products.map((product, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 group cursor-pointer"
            >
              <Link href={`/products/${product.slug}`} className="block bg-card rounded-2xl overflow-hidden border border-border shadow-sm group-hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-muted/50">
                  <img src={product.imageUrl || FALLBACK_PROD_IMG} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
                    <span className="w-full text-center bg-white text-black rounded-full py-2 text-sm font-semibold">
                      View Details
                    </span>
                    <span className="block w-full text-center bg-primary text-white rounded-full py-2 text-sm font-semibold">
                      Enquiry Now
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Our Product Categories</h2>
          <p className="text-foreground/70 text-lg">Premium quality natural extracts, powders & oils manufactured under strict GMP & ISO standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
            >
              <Link href={`/categories/${cat.slug}`} className="block absolute inset-0">
                <img
                  src={cat.imageUrl || FALLBACK_CAT_IMGS[idx % FALLBACK_CAT_IMGS.length]}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-white/70 text-sm mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 line-clamp-2">{cat.description}</p>
                  )}
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

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const FALLBACK_MOTIONS = [
  { id: "f1", title: "Botanical Sourcing", img: catHerbs },
  { id: "f2", title: "Precision Extraction", img: catExtracts },
  { id: "f3", title: "Quality Assurance", img: catStandardized },
  { id: "f4", title: "Final Product", img: catOils },
  { id: "f5", title: "Pure Herbal Powders", img: catPowders },
];

function ProductMotionSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, loop: false });
  const [videos, setVideos] = useState<any[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    update();
  }, [emblaApi]);

  useEffect(() => {
    api.getVideos().then(v => { if (v.length > 0) setVideos(v); }).catch(() => {});
  }, []);

  const hasVideos = videos.length > 0;
  const items = hasVideos ? videos : FALLBACK_MOTIONS;

  return (
    <section className="bg-[#0f1a0f] text-white overflow-hidden">
      {/* Top header row */}
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">@pukhrajherbal</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Nature in motion,<br />
              <span className="text-primary">our everything.</span>
            </h2>
            <p className="mt-4 text-white/60 text-base leading-relaxed max-w-md">
              From farm to extract — witness the craftsmanship behind every batch of Pukhraj Herbal's premium botanical products.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact">
              <button className="bg-primary hover:bg-primary/90 text-white px-7 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap">
                Get in Touch
              </button>
            </Link>
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canPrev}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canNext}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="w-full overflow-hidden pb-16" ref={emblaRef}>
        <div className="flex gap-4 pl-4 md:pl-8">
          {items.map((item: any, idx: number) => {
            const ytId = hasVideos ? getYouTubeId(item.youtubeUrl) : null;
            const isPlaying = playing === item.id;
            const thumb = hasVideos
              ? (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null)
              : item.img;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex-[0_0_72%] sm:flex-[0_0_44%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_19%] min-w-0"
                style={{ paddingBottom: idx % 2 === 0 ? "0px" : "40px", paddingTop: idx % 2 === 0 ? "40px" : "0px" }}
              >
                <div className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-[#1a2a1a] cursor-pointer shadow-xl">
                  {isPlaying && ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                      title={item.title}
                    />
                  ) : (
                    <>
                      {thumb && (
                        <img
                          src={thumb}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Play button — only for real videos */}
                      {hasVideos && (
                        <button
                          onClick={() => setPlaying(item.id)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </button>
                      )}

                      {/* Title at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-white font-semibold text-sm leading-snug drop-shadow">{item.title}</p>
                        {hasVideos && (
                          <p className="text-white/50 text-xs mt-0.5">Tap to watch</p>
                        )}
                      </div>

                      {/* Tag badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {hasVideos ? "Video" : "Process"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* CTA card at the end */}
          <div
            className="flex-[0_0_72%] sm:flex-[0_0_44%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_19%] min-w-0 pr-4 md:pr-8"
            style={{ paddingTop: items.length % 2 === 0 ? "0px" : "40px" }}
          >
            <div className="rounded-3xl aspect-[3/4] border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center px-6 gap-5">
              <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <FaLeaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-serif font-bold text-xl mb-2">See More of Our Work</p>
                <p className="text-white/50 text-sm">Explore our full product catalogue and manufacturing capabilities.</p>
              </div>
              <Link href="/products">
                <button className="mt-2 border border-white/30 hover:border-primary hover:bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all">
                  View Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyProductsSection() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.getProducts().then(all => {
      const featured = all.filter((p: any) => p.featured);
      setProducts((featured.length > 0 ? featured : all).slice(0, 3));
    }).catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Featured Excellence</h2>
          <p className="text-foreground/70 text-lg">Our flagship products, representing the pinnacle of botanical extraction technology.</p>
        </div>

        <div className="grid gap-12 lg:gap-16">
          {products.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg group">
                  <img src={product.imageUrl || FALLBACK_PROD_IMG} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-3xl font-serif font-bold text-foreground mb-4">{product.name}</h3>
                <p className="text-lg text-foreground/70 mb-6 leading-relaxed">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.specification && (
                    <span className="px-4 py-1.5 bg-primary/10 text-primary font-medium text-sm rounded-full">{product.specification}</span>
                  )}
                  {product.casNumber && (
                    <span className="px-4 py-1.5 bg-primary/10 text-primary font-medium text-sm rounded-full">CAS: {product.casNumber}</span>
                  )}
                </div>
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

function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    api.getBlogs().then(all => setBlogs(all.slice(0, 3))).catch(() => {});
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Latest Insights</h2>
            <p className="text-foreground/70 text-lg">Industry news, scientific breakthroughs, and botanical knowledge from our experts.</p>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">View All Articles</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.article 
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={blog.imageUrl || FALLBACK_BLOG_IMG} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{blog.title}</h3>
                <p className="text-foreground/70 mb-6 line-clamp-2">{blog.excerpt}</p>
                <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FALLBACK_TESTIMONIALS = [
  {
    id: "f1", name: "Dr. Rahul Mehta", designation: "R&D Head", company: "NutriVeda Labs",
    rating: 5, message: "Pukhraj Herbals consistently delivers high-purity extracts that meet our stringent quality standards. Their Ashwagandha extract is the backbone of our bestselling product line."
  },
  {
    id: "f2", name: "Sarah Thompson", designation: "Procurement Manager", company: "Botanica Global",
    rating: 5, message: "We've sourced botanical extracts from multiple suppliers worldwide, and Pukhraj stands out for their GMP compliance, on-time delivery, and exceptional customer support."
  },
  {
    id: "f3", name: "Arun Kapoor", designation: "CEO", company: "HerbWell Pharmaceuticals",
    rating: 5, message: "The COA documentation and testing data provided with every batch gives us complete confidence in the traceability and purity of the ingredients."
  },
  {
    id: "f4", name: "Priya Nair", designation: "Formulations Lead", company: "AyurPure Health",
    rating: 5, message: "From Turmeric to Moringa, every extract we've ordered has been consistent in standardization and potency. A truly dependable manufacturing partner."
  },
];

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    api.getTestimonials().then(data => setTestimonials(data && data.length > 0 ? data : FALLBACK_TESTIMONIALS)).catch(() => setTestimonials(FALLBACK_TESTIMONIALS));
  }, []);

  const displayed = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    if (!emblaApi || displayed.length === 0) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi, displayed]);

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-wider text-primary uppercase mb-2">What Our Clients Say</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Customer Testimonials</h3>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex ml-4 md:ml-6 lg:ml-8 gap-6 touch-pan-y">
          {displayed.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_28%] min-w-0"
            >
              <div className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < (t.rating || 5) ? "text-yellow-400" : "text-muted-foreground/30"}`}>★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground/70 leading-relaxed mb-8 flex-1 italic">"{t.message}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {t.imageUrl ? (
                    <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{[t.designation, t.company].filter(Boolean).join(" · ")}</div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Our Laboratory</h4>
                  <p className="text-background/70 text-sm">123 Botanical Park, Innovation Dist.<br/>Bangalore, India 560001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <p className="text-background/70 text-sm">+91 98765 43210<br/>Mon-Fri: 9am to 6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <p className="text-background/70 text-sm">enquiry@pukhrajherbals.com<br/>sales@pukhrajherbals.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-3/5 p-10 md:p-12 bg-card">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input placeholder="John Doe" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <Input type="email" placeholder="john@company.com" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input placeholder="Acme Pharmaceuticals" className="h-12 bg-muted/50 border-transparent focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Message</label>
                <Textarea placeholder="Please provide details about the extracts or quantities you are looking for..." className="min-h-[150px] bg-muted/50 border-transparent focus:border-primary resize-none" />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 rounded-full text-base font-semibold shadow-md hover:shadow-xl transition-all">
                Send Enquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

