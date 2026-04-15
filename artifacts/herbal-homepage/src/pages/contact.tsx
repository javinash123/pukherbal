import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import hero3 from "@/assets/hero-3.png";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }) };

const contactInfo = [
  { Icon: MapPin, title: "Head Office", lines: ["Pukhraj Herbals Pvt. Ltd.", "Plot No. 42, Industrial Estate", "Anand, Gujarat — 388001, India"] },
  { Icon: Phone, title: "Call Us", lines: ["+91 98765 43210", "+91 99887 76654", "Mon–Sat: 9:00 AM – 6:00 PM IST"] },
  { Icon: Mail, title: "Email Us", lines: ["enquiry@pukhrajherbals.com", "sales@pukhrajherbals.com", "quality@pukhrajherbals.com"] },
  { Icon: Clock, title: "Business Hours", lines: ["Monday – Friday: 9 AM – 6 PM", "Saturday: 9 AM – 2 PM", "Sunday: Closed"] },
];

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PageHero
          title="Contact Us"
          subtitle="Reach out to our team of botanical experts for samples, quotes, or any inquiries."
          image={hero3}
          breadcrumbs={[{ label: "Contact" }]}
        />

        {/* Contact Info Cards */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map(({ Icon, title, lines }, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -4 }} className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-foreground mb-3">{title}</h3>
                  {lines.map((line, j) => (
                    <p key={j} className="text-sm text-foreground/60 leading-relaxed">{line}</p>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Form + Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">

              {/* Form */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <span className="text-sm font-bold tracking-wider text-primary uppercase">Send a Message</span>
                <h2 className="text-3xl font-serif font-bold text-foreground mt-2 mb-8">We'd Love to Hear From You</h2>
                <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Full Name *</label>
                      <Input placeholder="Your full name" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary" data-testid="input-name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email Address *</label>
                      <Input type="email" placeholder="you@company.com" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary" data-testid="input-email" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Company Name</label>
                      <Input placeholder="Your company" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary" data-testid="input-company" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Phone Number</label>
                      <Input placeholder="+91 98765 43210" className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary" data-testid="input-phone" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Product of Interest</label>
                    <Input placeholder="e.g. Ashwagandha Extract, Turmeric Powder..." className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary" data-testid="input-product" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Message *</label>
                    <Textarea placeholder="Please provide details about your requirements, quantities, or any questions you have..." className="min-h-[150px] rounded-xl bg-muted/50 border-transparent focus:border-primary resize-none" data-testid="input-message" />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-13 rounded-xl text-base font-semibold shadow-md hover:shadow-xl transition-all" data-testid="btn-submit">
                    <Send className="mr-2 w-4 h-4" /> Send Enquiry
                  </Button>
                </form>
              </motion.div>

              {/* Info Side */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-6">
                {/* Map Placeholder */}
                <div className="rounded-2xl overflow-hidden bg-muted border border-border" style={{ height: 300 }}>
                  <iframe
                    title="Pukhraj Herbals Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.123!2d72.9!3d22.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDMzJzAwLjAiTiA3MsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1618000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="grayscale opacity-80"
                  />
                </div>

                {/* Company Card */}
                <div className="bg-primary text-primary-foreground p-8 rounded-2xl">
                  <h3 className="font-serif font-bold text-xl mb-3">Pukhraj Herbals Pvt. Ltd.</h3>
                  <p className="text-primary-foreground/80 text-sm mb-5 leading-relaxed">GMP & ISO certified manufacturer of premium botanical extracts, powders, and oils. Trusted by 500+ manufacturers in 30+ countries.</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 shrink-0" /><span>+91 98765 43210</span></div>
                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 shrink-0" /><span>enquiry@pukhrajherbals.com</span></div>
                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /><span>Anand, Gujarat, India — 388001</span></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
