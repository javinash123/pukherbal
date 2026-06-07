import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { connectDB, User, Category, Product, Blog, Setting, HeroSlide, VideoItem } from "@workspace/db";
import router from "./routes";

const BASE_PATH = (process.env.BASE_PATH || "/pukhrajherbals").replace(/\/$/, "");
const PORT = Number(process.env.PORT) || 6396;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("\n❌ MONGODB_URI is not set!\n");
  console.error("Run the server like this:");
  console.error(`  MONGODB_URI="mongodb+srv://..." SESSION_SECRET="secret" node index.cjs\n`);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Serve uploaded images
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use(`${BASE_PATH}/api/uploads`, express.static(uploadsDir));

// API routes
app.use(`${BASE_PATH}/api`, router);

// Serve built frontend static files
const publicDir = path.resolve(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(BASE_PATH + "/", express.static(publicDir));
  app.use(BASE_PATH, express.static(publicDir));
  app.get(`${BASE_PATH}/*splat`, (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

app.get("/", (_req, res) => res.redirect(BASE_PATH + "/"));

// ── Auto-seed on first launch ──────────────────────────────────────────────────
async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log("🌱 Empty database detected — seeding initial data...");

  const passwordHash = await bcrypt.hash("Admin@1234", 12);
  await User.create({ name: "Admin", email: "admin@pukhrajherbals.com", passwordHash, role: "admin", active: true });

  const cats = [
    { name: "Herbal Extracts",       slug: "herbal-extracts",       description: "Standardized herbal extracts with guaranteed potency",       sortOrder: 1 },
    { name: "Herbal Powders",        slug: "herbal-powders",        description: "Pure dried and powdered herbs",                              sortOrder: 2 },
    { name: "Essential Oils",        slug: "essential-oils",        description: "Cold-pressed and steam-distilled oils",                      sortOrder: 3 },
    { name: "Raw Herbs",             slug: "raw-herbs",             description: "Carefully sourced raw botanical ingredients",                sortOrder: 4 },
    { name: "Standardized Extracts", slug: "standardized-extracts", description: "Scientifically standardized for active compounds",           sortOrder: 5 },
    { name: "Carrier Oils",          slug: "carrier-oils",          description: "High-quality carrier oils for formulation",                  sortOrder: 6 },
  ];
  const catMap: Record<string, string> = {};
  for (const c of cats) {
    const doc = await Category.create({ ...c, active: true, imageUrl: "" });
    catMap[c.slug] = doc.id;
  }

  const products = [
    { name: "Ashwagandha Extract", catSlug: "herbal-extracts",  spec: "2.5% Withanolides",  cas: "90147-43-6", desc: "Standardized Ashwagandha root extract. Premier adaptogen for stress relief and vitality.", sortOrder: 1 },
    { name: "Turmeric Extract",    catSlug: "herbal-extracts",  spec: "95% Curcuminoids",   cas: "458-37-7",   desc: "High-potency turmeric extract. Powerful anti-inflammatory and antioxidant.", sortOrder: 2 },
    { name: "Neem Extract",        catSlug: "herbal-extracts",  spec: "0.3% Azadirachtin",  cas: "11141-17-6", desc: "Cold-processed neem extract. Natural skin purifier.", sortOrder: 3 },
    { name: "Brahmi Extract",      catSlug: "herbal-extracts",  spec: "20% Bacosides",      cas: "93913-35-0", desc: "Brain-boosting Brahmi extract for cognitive function.", sortOrder: 4 },
    { name: "Amla Extract",        catSlug: "herbal-extracts",  spec: "40% Tannins",        cas: "58546-54-6", desc: "Rich source of natural vitamin C. Powerful antioxidant.", sortOrder: 5 },
    { name: "Moringa Extract",     catSlug: "herbal-powders",   spec: "3% Isothiocyanates", cas: "9000-30-0",  desc: "Nutrient-dense moringa leaf extract. Superior vitamins and minerals.", sortOrder: 6 },
  ];
  for (const { catSlug, spec, cas, desc, ...p } of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-extract";
    await Product.create({ ...p, slug, categoryId: catMap[catSlug] || null, specification: spec, casNumber: cas, description: desc, active: true, featured: true, imageUrl: "" });
  }

  const settings: Record<string, string> = {
    site_tagline:          "Premium Ayurvedic Herbal Extracts",
    contact_email:         "enquiry@pukhrajherbals.com",
    contact_sales_email:   "sales@pukhrajherbals.com",
    contact_phone:         "+91 98765 43210",
    contact_address:       "Indore, Madhya Pradesh, India",
    about_short:           "Pukhraj Herbals is a leading manufacturer and exporter of premium quality herbal extracts, botanical ingredients, and Ayurvedic formulations.",
    hero_heading:          "Premium Ayurvedic Herbal Extracts",
    hero_subheading:       "Bridging Ancient Wisdom with Modern Science",
    seo_meta_title:        "Pukhraj Herbals | Premium Ayurvedic Herbal Extracts",
    seo_meta_description:  "GMP & ISO certified manufacturer of premium herbal extracts, botanical powders and essential oils. Trusted by 500+ manufacturers in 30+ countries.",
    seo_meta_keywords:     "herbal extracts, ayurvedic extracts, botanical extracts, ashwagandha extract, turmeric extract, herbal manufacturer India",
    seo_og_image:          "",
    social_instagram:      "",
    social_facebook:       "",
    social_twitter:        "",
    social_linkedin:       "",
    social_youtube:        "",
    social_whatsapp:       "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await Setting.create({ key, value });
  }

  await Blog.create({
    title: "The Science Behind Ashwagandha",
    slug: "science-behind-ashwagandha",
    excerpt: "Explore how Ashwagandha's withanolides work at a cellular level to regulate cortisol.",
    content: "Ashwagandha (Withania somnifera) has been used for centuries in Ayurvedic medicine. Modern science confirms its remarkable adaptogenic properties.",
    category: "Research", readTime: "8 min read", author: "Pukhraj Herbals", published: true, featured: true, imageUrl: "",
  });

  // Seed default hero slides
  const heroSlides = [
    { title: "Nature's Pharmacy, Modern Precision", subtitle: "Premium botanical extracts manufactured under strict GMP & ISO standards.", ctaText: "Explore Our Extracts", ctaLink: "/products", sortOrder: 1, active: true, imageUrl: "" },
    { title: "Ancient Wisdom, Scientifically Proven", subtitle: "Highest quality Ayurvedic powders and roots sourced directly from pristine farms.", ctaText: "View Our Powders", ctaLink: "/categories", sortOrder: 2, active: true, imageUrl: "" },
    { title: "Pure, Potent, Pristine", subtitle: "Essential oils extracted with utmost care to preserve nature's true essence.", ctaText: "Discover Essential Oils", ctaLink: "/categories", sortOrder: 3, active: true, imageUrl: "" },
  ];
  for (const slide of heroSlides) {
    await HeroSlide.create(slide);
  }

  // Seed default video items
  const videoItems = [
    { title: "Botanical Sourcing", subtitle: "Ethically sourced from pristine farms", sortOrder: 1, active: true, videoUrl: "", thumbnailUrl: "" },
    { title: "Precision Extraction", subtitle: "State-of-the-art extraction technology", sortOrder: 2, active: true, videoUrl: "", thumbnailUrl: "" },
    { title: "Quality Assurance", subtitle: "Rigorous multi-stage testing protocols", sortOrder: 3, active: true, videoUrl: "", thumbnailUrl: "" },
    { title: "Final Product", subtitle: "Premium packaging and delivery", sortOrder: 4, active: true, videoUrl: "", thumbnailUrl: "" },
  ];
  for (const item of videoItems) {
    await VideoItem.create(item);
  }

  console.log("✅ Seed complete!");
  console.log("   Admin login: admin@pukhrajherbals.com / Admin@1234");
  console.log("   ⚠️  Change this password after first login!\n");
}

async function start() {
  try {
    await connectDB();
    await seedIfEmpty();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🌿 Pukhraj Herbals server started`);
      console.log(`   URL  : http://0.0.0.0:${PORT}${BASE_PATH}/`);
      console.log(`   Admin: http://0.0.0.0:${PORT}${BASE_PATH}/admin`);
      console.log(`   Login: admin@pukhrajherbals.com / Admin@1234\n`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
