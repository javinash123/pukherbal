import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const videoItemsTable = pgTable("video_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").default(""),
  videoUrl: text("video_url").default(""),
  thumbnailUrl: text("thumbnail_url").default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  productId: text("product_id").default(""),
  productSlug: text("product_slug").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type VideoItem = typeof videoItemsTable.$inferSelect;
