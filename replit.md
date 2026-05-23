# Pukhraj Herbal Website

## Overview

pnpm workspace monorepo — React/Vite frontend + Express/MongoDB backend for the Pukhraj Herbal company website.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Wouter (routing) + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express 5 + MongoDB (Mongoose) + JWT auth
- **Build**: esbuild (API server)

## Artifacts

| Artifact | Dir | Preview Path | Purpose |
|---|---|---|---|
| Herbal Products Homepage | `artifacts/herbal-homepage` | `/` | Public-facing company website |
| API Server | `artifacts/api-server` | `/api` | REST API backend (MongoDB) |
| Canvas/Mockup Sandbox | `artifacts/mockup-sandbox` | `/mockup-sandbox` | UI design playground |

## Real Company Data

- **Company**: Pukhraj Herbal (formerly: Pukhraj Herbal Pvt. Ltd.)
- **Founder/CEO**: Mr. Milind Jilhewar
- **Founded**: 1999
- **Location**: 15-16, Industrial Area, Mandsaur, Madhya Pradesh, India — 458002
- **Phone**: +91-9425105058
- **Email**: garlicoherbal@gmail.com
- **WhatsApp**: +919425105058
- **GST**: 23ADDPP6014F1ZZ
- **Facility**: 20,000 sq. meter pollution-free campus in Mandsaur
- **Capacity**: 100+ MT/Year
- **Turnover**: ₹5–25 Crore
- **Exports**: 20+ countries
- **Partners**: 1000+ global partners
- **Certification**: ISO 9001:2008 (GMP-aligned, working towards full accreditation)
- **Extraction methods**: Cold-Pressed, Supercritical CO₂, Steam Distillation

## Database (MongoDB)

Collections: `categories`, `products`, `blogs`, `settings`, `users`, `enquiries`, `testimonials`, `heroSlides`, `videos`, `visitors`

Admin API routes are JWT-protected (`/api/admin/*`). Default admin login: check User model seed.

**Seeded Real Data** (from pukhrajherbal.com):
- 12 product categories (Herbal Extract, Oils, Pure Herbs Powder, Nutraceutical Extract, Cattle & Poultry Feed, Cosmetics & PG Extract, CO2 Oil Extract, Aromatic Chemicals, Dry Powder Extract, Soft Extract, Essential Oils, Fixed Oils)
- 18 products (Ashwagandha, Turmeric/Curcumin, Amla, Brahmi, Neem, Giloy, Shatavari, Bakuchi, Bakuchi CO2 Oil, Rosehip CO2, Malkangani Oil, Black Seed Oil, Peppermint EO, Eucalyptus EO, Moringa Powder, Ashwagandha Powder, Aloe Vera PG, Boswellia)
- 4 blog posts (Ashwagandha, Bakuchi CO2 Oil, Malkangani Oil, Aloe Amrut)
- 9 site settings (phone, email, address, tagline, SEO, WhatsApp, GST)

## Features Implemented

1. **Hero Slider Admin** — manage hero slides (image, title, subtitle, CTA) via admin panel
2. **SEO Management** — per-page SEO settings (title, description, keywords) stored in DB
3. **WhatsApp Button** — floating WhatsApp CTA button with configurable number
4. **Visitor Analytics** — tracks and displays daily/monthly visitor statistics in admin
5. **Search in Admin CRUD** — search/filter across products, categories, blogs, testimonials, enquiries
6. **Social Media Links** — admin-configurable social links (Instagram, LinkedIn, Facebook, Twitter, YouTube)
7. **YouTube Video Management** — admin panel to add/manage YouTube videos displayed on site
8. **Real Content** — all pages updated with real data scraped from old pukhrajherbal.com website

## Frontend Pages

- `/` — Homepage (hero slider, products, categories, blogs, testimonials, about stats)
- `/about` — About Us (founded 1999, Mr. Milind Jilhewar, Mandsaur MP, real stats)
- `/contact` — Contact (+91-9425105058, garlicoherbal@gmail.com, Mandsaur address)
- `/manufacturing` — Manufacturing Facility (20,000 sqm, cold-pressed/CO₂/steam distillation)
- `/certifications` — Certifications (ISO 9001:2008, GMP-aligned, chemical-free processing)
- `/sustainability` — Sustainability (ethical sourcing, pollution-free campus, Mandsaur farming)
- `/products` — Products listing (from MongoDB)
- `/categories` — Categories listing (12 real product categories)
- `/blog` — Blog listing (4 real blog posts)
- `/admin` — Admin panel (all CRUD + analytics)

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — run API server
- `pnpm --filter @workspace/herbal-homepage run dev` — run frontend
