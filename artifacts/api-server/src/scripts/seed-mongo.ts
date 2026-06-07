import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB, User, Category, Product, Blog, Setting } from "@workspace/db";

async function seed() {
  await connectDB();
  console.log("🌱 Seeding MongoDB...\n");

  // Admin user
  const email = "admin@pukhrajherbals.com";
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash("Admin@1234", 12);
    await User.create({ name: "Admin", email, passwordHash, role: "admin" });
    console.log("✅ Admin user created");
    console.log("   Email   : admin@pukhrajherbals.com");
    console.log("   Password: Admin@1234");
    console.log("   ⚠️  Change this password after first login!\n");
  } else {
    console.log("ℹ️  Admin user already exists\n");
  }

  // Categories
  const cats = [
    { name: "Herbal Extracts",      slug: "herbal-extracts",      description: "Standardized herbal extracts with guaranteed potency",      sortOrder: 1 },
    { name: "Herbal Powders",       slug: "herbal-powders",       description: "Pure dried and powdered herbs",                             sortOrder: 2 },
    { name: "Essential Oils",       slug: "essential-oils",       description: "Cold-pressed and steam-distilled oils",                     sortOrder: 3 },
    { name: "Raw Herbs",            slug: "raw-herbs",            description: "Carefully sourced raw botanical ingredients",               sortOrder: 4 },
    { name: "Standardized Extracts",slug: "standardized-extracts",description: "Scientifically standardized for active compounds",          sortOrder: 5 },
    { name: "Carrier Oils",         slug: "carrier-oils",         description: "High-quality carrier oils for formulation",                 sortOrder: 6 },
  ];
  const catMap: Record<string, string> = {};
  for (const cat of cats) {
    const c = await Category.findOneAndUpdate({ slug: cat.slug }, { ...cat, active: true, imageUrl: "" }, { upsert: true, new: true });
    catMap[cat.slug] = c!.id;
    console.log(`✅ Category: ${cat.name}`);
  }

  // Products
  const products = [
    { name: "Ashwagandha Extract", categorySlug: "herbal-extracts",  specification: "2.5% Withanolides",    casNumber: "90147-43-6", description: "Standardized Ashwagandha root extract. Premier adaptogen for stress relief and vitality.", featured: true, sortOrder: 1 },
    { name: "Turmeric Extract",    categorySlug: "herbal-extracts",  specification: "95% Curcuminoids",     casNumber: "458-37-7",   description: "High-potency turmeric extract standardized to 95% curcuminoids. Powerful anti-inflammatory.", featured: true, sortOrder: 2 },
    { name: "Neem Extract",        categorySlug: "herbal-extracts",  specification: "0.3% Azadirachtin",    casNumber: "11141-17-6", description: "Cold-processed neem extract for natural skin purification.", featured: true, sortOrder: 3 },
    { name: "Brahmi Extract",      categorySlug: "herbal-extracts",  specification: "20% Bacosides",        casNumber: "93913-35-0", description: "Brain-boosting Brahmi extract standardized to 20% bacosides.", featured: true, sortOrder: 4 },
    { name: "Amla Extract",        categorySlug: "herbal-extracts",  specification: "40% Tannins",          casNumber: "58546-54-6", description: "Rich source of natural vitamin C. Powerful antioxidant for immunity.", featured: true, sortOrder: 5 },
    { name: "Moringa Extract",     categorySlug: "herbal-powders",   specification: "3% Isothiocyanates",   casNumber: "9000-30-0",  description: "Nutrient-dense moringa leaf extract. Superior source of vitamins and minerals.", featured: true, sortOrder: 6 },
  ];
  for (const { categorySlug, ...p } of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    await Product.findOneAndUpdate(
      { name: p.name },
      { ...p, slug, categoryId: catMap[categorySlug] || null, active: true, imageUrl: "" },
      { upsert: true, new: true },
    );
    console.log(`✅ Product: ${p.name}`);
  }

  // Settings
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
    await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
  }
  console.log("✅ Default settings seeded");

  // Blogs
  const blogs = [
    {
      title: "The Science Behind Ashwagandha: An Adaptogen for Modern Stress",
      slug: "science-behind-ashwagandha-" + Date.now(),
      excerpt: "Explore how Ashwagandha's withanolides work at a cellular level to regulate cortisol and support adrenal function.",
      content: "Ashwagandha (Withania somnifera) has been used for centuries in Ayurvedic medicine. Modern science confirms its remarkable adaptogenic properties, with clinical studies showing significant reductions in cortisol levels and stress-related symptoms.",
      category: "Research", readTime: "8 min read", author: "Pukhraj Herbals", published: true, featured: true,
    },
    {
      title: "Curcumin Bioavailability: Innovations in Turmeric Extract Technology",
      slug: "curcumin-bioavailability-" + Date.now(),
      excerpt: "Discover the latest innovations in curcumin delivery systems that dramatically improve absorption.",
      content: "Curcumin, the primary active compound in turmeric, has long fascinated researchers. New delivery systems including phospholipid complexes, nanoparticle formulations, and black pepper extract (piperine) co-administration have revolutionized bioavailability.",
      category: "Technology", readTime: "6 min read", author: "Pukhraj Herbals", published: true, featured: true,
    },
  ];
  for (const blog of blogs) {
    const exists = await Blog.findOne({ title: blog.title });
    if (!exists) {
      await Blog.create({ ...blog, imageUrl: "" });
      console.log(`✅ Blog: ${blog.title}`);
    }
  }

  console.log("\n🎉 Seeding complete!");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
