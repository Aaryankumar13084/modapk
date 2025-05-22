import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories for APK files
export const categoryEnum = pgEnum('category', [
  'games',
  'social',
  'entertainment',
  'utilities',
  'education',
  'music-audio',
  'security',
]);

// Features that a mod APK might have
export const featureEnum = pgEnum('feature', [
  'no-ads',
  'premium',
  'unlimited-resources',
  'pro-features',
  'anti-ban',
  'background-play',
  'hd-support',
  'save-media',
  'radar-hack',
]);

// User schema for auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// APK app files schema
export const apkFiles = pgTable("apk_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  category: categoryEnum("category").notNull(),
  size: text("size").notNull(), // e.g. "150MB"
  fileName: text("file_name").notNull(),
  iconPath: text("icon_path"),
  rating: integer("rating").default(0), // 0-50 scale (for half-star precision)
  downloads: integer("downloads").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
});

// Features of the APK mods
export const apkFeatures = pgTable("apk_features", {
  id: serial("id").primaryKey(),
  apkId: integer("apk_id").notNull().references(() => apkFiles.id),
  feature: featureEnum("feature").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertApkFileSchema = createInsertSchema(apkFiles).omit({
  id: true,
  uploadedAt: true,
  downloads: true,
  rating: true,
  isFeatured: true,
  isTrending: true,
});

export const insertApkFeatureSchema = createInsertSchema(apkFeatures).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertApkFile = z.infer<typeof insertApkFileSchema>;
export type ApkFile = typeof apkFiles.$inferSelect;

export type InsertApkFeature = z.infer<typeof insertApkFeatureSchema>;
export type ApkFeature = typeof apkFeatures.$inferSelect;

// Additional type for frontend use
export type ApkFileWithFeatures = ApkFile & {
  features: string[];
};
