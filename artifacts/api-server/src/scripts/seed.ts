import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { Blog } from "../models/Blog";
import { Setting } from "../models/Setting";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri);
  console.log("🌱 Seeding MongoDB...");

  // Admin user
  const email = "admin@pukhrajherbals.com";
  const password = "Admin@1234";
  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name: "Admin", email, passwordHash, role: "admin" });
    console.log(`✅ Admin user: ${email} / ${password}`);
  } else {
    console.log(`ℹ️  Admin user already exists`);
  }

  // Categories
  const cats = [
    { name: "Herbal Extracts", description: "Standardized herbal extracts", sortOrder: 1 },
    { name: "Herbal Powders", description: "Pure dried and powdered herbs", sortOrder: 2 },
    { name: "Essential Oils", description: "Cold-pressed and steam-distilled oils", sortOrder: 3 },
    { name: "Raw Herbs", description: "Carefully sourced raw botanical ingredients", sortOrder: 4 },
    { name: "Standardized Extracts", description: "Scientifically standardized extracts", sortOrder: 5 },
    { name: "Carrier Oils", description: "High-quality carrier oils", sortOrder: 6 },
  ];
  for (const cat of cats) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await Category.create({ ...cat, slug, imageUrl: "", active: true });
      console.log(`✅ Category: ${cat.name}`);
    }
  }

  // Products
  const herbalCat = await Category.findOne({ name: "Herbal Extracts" });
  const powderCat = await Category.findOne({ name: "Herbal Powders" });

  const products = [
    { name: "Ashwagandha Extract", categoryId: herbalCat?._id, specification: "2.5% Withanolides", casNumber: "90147-43-6", description: "Standardized Ashwagandha root extract.", featured: true, sortOrder: 1 },
    { name: "Turmeric Extract", categoryId: herbalCat?._id, specification: "95% Curcuminoids", casNumber: "458-37-7", description: "High-potency turmeric extract.", featured: true, sortOrder: 2 },
    { name: "Neem Extract", categoryId: herbalCat?._id, specification: "0.3% Azadirachtin", casNumber: "11141-17-6", description: "Cold-processed neem extract.", featured: true, sortOrder: 3 },
    { name: "Brahmi Extract", categoryId: herbalCat?._id, specification: "20% Bacosides", casNumber: "93913-35-0", description: "Brain-boosting Brahmi extract.", featured: true, sortOrder: 4 },
    { name: "Amla Extract", categoryId: herbalCat?._id, specification: "40% Tannins", casNumber: "58546-54-6", description: "Rich source of natural Vitamin C.", featured: true, sortOrder: 5 },
    { name: "Moringa Extract", categoryId: powderCat?._id, specification: "3% Isothiocyanates", casNumber: "9000-30-0", description: "Nutrient-dense moringa leaf extract.", featured: true, sortOrder: 6 },
  ];
  for (const prod of products) {
    const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const exists = await Product.findOne({ name: prod.name });
    if (!exists) {
      await Product.create({ ...prod, slug, imageUrl: "", active: true });
      console.log(`✅ Product: ${prod.name}`);
    }
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
    await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
  }
  console.log("✅ Settings seeded");

  // Blogs
  const blogs = [
    {
      title: "The Science Behind Ashwagandha: An Adaptogen for Modern Stress",
      excerpt: "Ashwagandha has been used for centuries in Ayurveda as a Rasayana herb for longevity and vitality.",
      content: "Ashwagandha (Withania somnifera) has been used for centuries in Ayurveda. Modern clinical research has validated many traditional uses, particularly around its adaptogenic properties.",
      category: "Research",
      readTime: "5 min read",
      author: "Dr. Priya Sharma",
      published: true,
      featured: true,
    },
    {
      title: "Curcumin Bioavailability: Innovations in Turmeric Extract Technology",
      excerpt: "While turmeric has been used for millennia, maximizing curcumin bioavailability remains a challenge.",
      content: "While turmeric (Curcuma longa) has been used in traditional medicine for millennia, one of the main challenges with curcumin as an active ingredient has been its relatively poor bioavailability when taken orally.",
      category: "Technology",
      readTime: "6 min read",
      author: "Pukhraj Herbals",
      published: true,
      featured: false,
    },
    {
      title: "Sustainable Sourcing: Our Commitment to Ethical Herb Procurement",
      excerpt: "Sustainability is not just a buzzword for us—it is a core business principle.",
      content: "Sustainability is not just a buzzword for us—it is a core business principle that guides every procurement decision we make. Our sourcing teams work directly with local farmers across India.",
      category: "Sustainability",
      readTime: "4 min read",
      author: "Pukhraj Herbals",
      published: true,
      featured: false,
    },
  ];
  for (const blog of blogs) {
    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const exists = await Blog.findOne({ title: blog.title });
    if (!exists) {
      await Blog.create({ ...blog, slug, imageUrl: "" });
      console.log(`✅ Blog: ${blog.title}`);
    }
  }

  console.log("✅ Seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
