import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").default(""),
  ctaText: text("cta_text").default("Explore Now"),
  ctaLink: text("cta_link").default("/products"),
  imageUrl: text("image_url").default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type HeroSlide = typeof heroSlidesTable.$inferSelect;
