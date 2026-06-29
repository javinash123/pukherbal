import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  company: text("company").default(""),
  productOfInterest: text("product_of_interest").default(""),
  subject: text("subject").default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiriesTable.$inferSelect;
