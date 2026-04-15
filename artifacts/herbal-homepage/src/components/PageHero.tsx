import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface Crumb { label: string; href?: string; }

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  breadcrumbs?: Crumb[];
  height?: "sm" | "md" | "lg";
  overlay?: string;
}

export function PageHero({ title, subtitle, image, breadcrumbs, height = "md", overlay = "from-black/75 via-black/50 to-transparent" }: PageHeroProps) {
  const heightClass = height === "lg" ? "h-[70vh]" : height === "sm" ? "h-64 md:h-80" : "h-[50vh] min-h-[380px]";
  return (
    <section className={`relative w-full ${heightClass} overflow-hidden`}>
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover object-center scale-105" style={{ transition: "transform 8s ease" }} />
      <div className={`absolute inset-0 bg-gradient-to-r ${overlay}`}></div>
      <div className="absolute inset-0 flex flex-col items-start justify-end container mx-auto px-4 md:px-6 pb-14 pt-28">
        {breadcrumbs && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-1.5 text-white/70 text-sm mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {breadcrumbs.map(({ label, href }, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3" />
                {href ? <Link href={href} className="hover:text-white transition-colors">{label}</Link> : <span className="text-white font-medium">{label}</span>}
              </span>
            ))}
          </motion.nav>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight max-w-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-white/80 text-lg mt-4 max-w-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
