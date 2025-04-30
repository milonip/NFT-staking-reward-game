import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
});

export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenId: text("token_id").notNull(),
  name: text("name").notNull(),
  collection: text("collection").notNull(),
  image: text("image").notNull(),
  rarity: integer("rarity"),
  floor: text("floor"),
  isStaked: boolean("is_staked").default(false),
  stakeDate: timestamp("stake_date"),
  stakePeriod: integer("stake_period"),
  unlockDate: timestamp("unlock_date"),
});

export const stakingRewards = pgTable("staking_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  claimed: boolean("claimed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
});

export const insertStakingRewardSchema = createInsertSchema(stakingRewards).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;
export type InsertStakingReward = z.infer<typeof insertStakingRewardSchema>;
export type StakingReward = typeof stakingRewards.$inferSelect;
