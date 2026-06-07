import bcrypt from "bcryptjs";
import { db, usersTable, categoriesTable, productsTable, blogsTable, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Admin user
  const email = "admin@pukhrajherbals.com";
  const password = "Admin@1234";
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!existing.length) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(usersTable).values({ name: "Admin", email, passwordHash, role: "admin" });
    console.log(`✅ Admin user created: ${email} / ${password}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${email}`);
  }

  // Default categories
  const cats = [
    { name: "Herbal Extracts", slug: "herbal-extracts", description: "Standardized herbal extracts with guaranteed potency", imageUrl: "", sortOrder: 1 },
    { name: "Herbal Powders", slug: "herbal-powders", description: "Pure dried and powdered herbs", imageUrl: "", sortOrder: 2 },
    { name: "Essential Oils", slug: "essential-oils", description: "Cold-pressed and steam-distilled oils", imageUrl: "", sortOrder: 3 },
    { name: "Raw Herbs", slug: "raw-herbs", description: "Carefully sourced raw botanical ingredients", imageUrl: "", sortOrder: 4 },
    { name: "Standardized Extracts", slug: "standardized-extracts", description: "Scientifically standardized for active compounds", imageUrl: "", sortOrder: 5 },
    { name: "Carrier Oils", slug: "carrier-oils", description: "High-quality carrier oils for formulation", imageUrl: "", sortOrder: 6 },
  ];
  for (const cat of cats) {
    const exists = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, cat.slug)).limit(1);
    if (!exists.length) {
      await db.insert(categoriesTable).values(cat);
      console.log(`✅ Category: ${cat.name}`);
    }
  }

  // Default products
  const herbalExtractsCat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, "herbal-extracts")).limit(1);
  const powdersCat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, "herbal-powders")).limit(1);
  const catId = herbalExtractsCat[0]?.id;
  const powId = powdersCat[0]?.id;

  const products = [
    { name: "Ashwagandha Extract", slug: "ashwagandha-extract", categoryId: catId, specification: "2.5% Withanolides", casNumber: "90147-43-6", description: "Standardized Ashwagandha root extract, 2.5% Withanolides. Premier adaptogen for stress relief and vitality.", featured: true, sortOrder: 1 },
    { name: "Turmeric Extract", slug: "turmeric-extract", categoryId: catId, specification: "95% Curcuminoids", casNumber: "458-37-7", description: "High-potency turmeric extract standardized to 95% curcuminoids. Powerful anti-inflammatory and antioxidant.", featured: true, sortOrder: 2 },
    { name: "Neem Extract", slug: "neem-extract", categoryId: catId, specification: "0.3% Azadirachtin", casNumber: "11141-17-6", description: "Cold-processed neem extract standardized for azadirachtin content. Natural skin purifier.", featured: true, sortOrder: 3 },
    { name: "Brahmi Extract", slug: "brahmi-extract", categoryId: catId, specification: "20% Bacosides", casNumber: "93913-35-0", description: "Brain-boosting Brahmi extract standardized to 20% bacosides. Supports cognitive function.", featured: true, sortOrder: 4 },
    { name: "Amla Extract", slug: "amla-extract", categoryId: catId, specification: "40% Tannins", casNumber: "58546-54-6", description: "Rich source of natural vitamin C and tannins. Powerful antioxidant for immunity support.", featured: true, sortOrder: 5 },
    { name: "Moringa Extract", slug: "moringa-extract", categoryId: powId, specification: "3% Isothiocyanates", casNumber: "9000-30-0", description: "Nutrient-dense moringa leaf extract. Superior source of vitamins, minerals, and antioxidants.", featured: true, sortOrder: 6 },
  ];
  for (const prod of products) {
    const exists = await db.select().from(productsTable).where(eq(productsTable.slug, prod.slug)).limit(1);
    if (!exists.length) {
      await db.insert(productsTable).values({ ...prod, active: true, imageUrl: "" });
      console.log(`✅ Product: ${prod.name}`);
    }
  }

  // Default settings
  const defaults: Record<string, string> = {
    site_tagline: "Premium Ayurvedic Herbal Extracts",
    contact_email: "enquiry@pukhrajherbals.com",
    contact_sales_email: "sales@pukhrajherbals.com",
    contact_phone: "+91 98765 43210",
    contact_address: "Indore, Madhya Pradesh, India",
    about_short: "Pukhraj Herbals is a leading manufacturer and exporter of premium quality herbal extracts, botanical ingredients, and Ayurvedic formulations.",
    hero_heading: "Premium Ayurvedic Herbal Extracts",
    hero_subheading: "Bridging Ancient Wisdom with Modern Science",
  };
  for (const [key, value] of Object.entries(defaults)) {
    const exists = await db.select().from(settingsTable).where(eq(settingsTable.key, key)).limit(1);
    if (!exists.length) {
      await db.insert(settingsTable).values({ key, value });
    }
  }
  console.log("✅ Default settings seeded");

  // Default blog posts
  const blogs = [
    {
      title: "The Science Behind Ashwagandha: An Adaptogen for Modern Stress",
      slug: "science-behind-ashwagandha-adaptogen-modern-stress",
      excerpt: "Explore how Ashwagandha's withanolides work at a cellular level to regulate cortisol and support adrenal function.",
      content: "Ashwagandha (Withania somnifera) has been used for centuries in Ayurvedic medicine. Modern science confirms its remarkable adaptogenic properties...",
      category: "Research",
      readTime: "8 min read",
      author: "Pukhraj Herbals",
      published: true,
      featured: true,
    },
    {
      title: "Curcumin Bioavailability: Innovations in Turmeric Extract Technology",
      slug: "curcumin-bioavailability-innovations-turmeric-extract",
      excerpt: "Discover the latest innovations in curcumin delivery systems that dramatically improve absorption and therapeutic effectiveness.",
      content: "Curcumin, the primary active compound in turmeric, has long fascinated researchers with its wide range of therapeutic benefits...",
      category: "Technology",
      readTime: "6 min read",
      author: "Pukhraj Herbals",
      published: true,
      featured: true,
    },
    {
      title: "Sustainable Sourcing: Our Commitment to Ethical Herb Procurement",
      slug: "sustainable-sourcing-ethical-herb-procurement",
      excerpt: "Learn about our rigorous supplier selection process and why sustainable sourcing forms the foundation of everything we do.",
      content: "At Pukhraj Herbals, we believe that quality begins long before the extraction process...",
      category: "Sustainability",
      readTime: "5 min read",
      author: "Pukhraj Herbals",
      published: true,
      featured: false,
    },
  ];
  for (const blog of blogs) {
    const exists = await db.select().from(blogsTable).where(eq(blogsTable.slug, blog.slug)).limit(1);
    if (!exists.length) {
      await db.insert(blogsTable).values({ ...blog, imageUrl: "" });
      console.log(`✅ Blog: ${blog.title}`);
    }
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });
