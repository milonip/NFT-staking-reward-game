import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNftSchema, insertStakingRewardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/wallet", async (req: Request, res: Response) => {
    try {
      const walletAddressSchema = z.object({
        walletAddress: z.string().min(1)
      });
      
      const parsed = walletAddressSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }
      
      const { walletAddress } = parsed.data;
      
      // Find or create user by wallet address
      let user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        user = await storage.createUser({
          username: `user_${walletAddress.substring(0, 8)}`,
          password: "wallet_auth",
          walletAddress
        });
      }
      
      res.json({ user: { id: user.id, walletAddress: user.walletAddress } });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // NFT management routes
  app.get("/api/nfts", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const nfts = await storage.getNfts(userId);
      res.json(nfts);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/nfts/staked", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const stakedNfts = await storage.getStakedNfts(userId);
      res.json(stakedNfts);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/nfts", async (req: Request, res: Response) => {
    try {
      const parsed = insertNftSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid NFT data" });
      }
      
      const nft = await storage.createNft(parsed.data);
      res.status(201).json(nft);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Staking routes
  app.post("/api/nfts/:id/stake", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      
      const stakePeriodSchema = z.object({
        stakePeriod: z.number().int().positive()
      });
      
      const parsed = stakePeriodSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid stake period" });
      }
      
      const { stakePeriod } = parsed.data;
      
      const stakedNft = await storage.stakeNft(id, stakePeriod);
      
      if (!stakedNft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      res.json(stakedNft);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/nfts/:id/unstake", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid NFT ID" });
      }
      
      const unstakedNft = await storage.unstakeNft(id);
      
      if (!unstakedNft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      
      res.json(unstakedNft);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Reward routes
  app.get("/api/rewards", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const rewards = await storage.getRewards(userId);
      
      // Calculate total unclaimed rewards
      const unclaimedRewards = rewards
        .filter(reward => !reward.claimed)
        .reduce((total, reward) => total + reward.amount, 0);
      
      res.json({ rewards, unclaimedRewards });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/rewards", async (req: Request, res: Response) => {
    try {
      const parsed = insertStakingRewardSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid reward data" });
      }
      
      const reward = await storage.createReward(parsed.data);
      res.status(201).json(reward);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/rewards/claim", async (req: Request, res: Response) => {
    try {
      const userIdSchema = z.object({
        userId: z.number().int().positive()
      });
      
      const parsed = userIdSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const { userId } = parsed.data;
      
      const claimedRewards = await storage.claimRewards(userId);
      const totalClaimed = claimedRewards.reduce((total, reward) => total + reward.amount, 0);
      
      res.json({ claimedRewards, totalClaimed });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Game statistics
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const nfts = await storage.getNfts(userId);
      const stakedNfts = nfts.filter(nft => nft.isStaked);
      
      // Calculate daily rewards based on staked NFTs (simple calculation for demo)
      const dailyRewards = stakedNfts.length * 120; // 120 tokens per NFT per day
      
      // Next reward distribution time (24 hours from now)
      const nextRewardTime = new Date();
      nextRewardTime.setHours(nextRewardTime.getHours() + 24);
      
      // Basic APR calculation (for demonstration)
      const apr = Math.min(100 + (stakedNfts.length * 8), 200); // 100% base + 8% per NFT, max 200%
      
      res.json({
        totalStaked: stakedNfts.length,
        dailyRewards,
        rewardsPool: 1200000, // 1.2M fixed pool
        apr,
        nextRewardTime
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
