import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import logo from "@assets/pukhraj_herbals_logo-removebg-preview_1775509460215.png";
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
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

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

  const slides = [
    {
      image: hero1,
      title: "Nature's Pharmacy, Modern Precision",
      subtitle: "Premium botanical extracts manufactured under strict GMP & ISO standards.",
      cta: "Explore Our Extracts"
    },
    {
      image: hero2,
      title: "Ancient Wisdom, Scientifically Proven",
      subtitle: "Highest quality Ayurvedic powders and roots sourced directly from pristine farms.",
      cta: "View Our Powders"
    },
    {
      image: hero3,
      title: "Pure, Potent, Pristine",
      subtitle: "Essential oils extracted with utmost care to preserve nature's true essence.",
      cta: "Discover Essential Oils"
    }
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%] min-w-0">
              <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover object-center" />
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
                    <Button size="lg" className="text-base h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all" data-testid={`btn-hero-cta-${index}`}>
                      {slide.cta}
                    </Button>
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
                <div className="text-3xl font-serif font-bold text-foreground">25+</div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">Years of Botanical Excellence</p>
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
              <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm group-hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-muted/50">
                  <img src={product.imageUrl || FALLBACK_PROD_IMG} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
                    <Button variant="secondary" className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-full" data-testid={`btn-product-read-${idx}`}>
                      Read More
                    </Button>
                    <Button className="w-full rounded-full" data-testid={`btn-product-enquiry-${idx}`}>
                      Enquiry Now
                    </Button>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductMotionSection() {
  // We don't have video URLs easily, so we simulate video cards with images + play button
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const motions = [
    { title: "Botanical Sourcing", img: catHerbs },
    { title: "Precision Extraction", img: catExtracts },
    { title: "Quality Assurance", img: catStandardized },
    { title: "Final Product", img: catOils },
  ];

  return (
    <section className="py-24 bg-foreground text-background">
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
                <div className="relative rounded-2xl overflow-hidden aspect-[9/16] group cursor-pointer">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/90 transition-all">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-serif font-bold mb-3">{item.title}</h4>
                  <Button variant="outline" className="w-full rounded-full border-background/20 hover:bg-primary hover:text-white hover:border-primary text-background bg-transparent">
                    Enquiry Now
                  </Button>
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
                <Button size="lg" className="rounded-full px-8 hover:shadow-lg transition-all">
                  Learn More
                </Button>
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

