import { 
  users, 
  nfts, 
  stakingRewards, 
  type User, 
  type InsertUser, 
  type Nft, 
  type InsertNft,
  type StakingReward,
  type InsertStakingReward
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // NFT methods
  getNfts(userId: number): Promise<Nft[]>;
  getNftById(id: number): Promise<Nft | undefined>;
  createNft(nft: InsertNft): Promise<Nft>;
  updateNft(id: number, nft: Partial<Nft>): Promise<Nft | undefined>;
  
  // Staking and rewards methods
  getStakedNfts(userId: number): Promise<Nft[]>;
  stakeNft(id: number, stakePeriod: number): Promise<Nft | undefined>;
  unstakeNft(id: number): Promise<Nft | undefined>;
  getRewards(userId: number): Promise<StakingReward[]>;
  createReward(reward: InsertStakingReward): Promise<StakingReward>;
  claimRewards(userId: number): Promise<StakingReward[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nfts: Map<number, Nft>;
  private rewards: Map<number, StakingReward>;
  
  currentUserId: number;
  currentNftId: number;
  currentRewardId: number;

  constructor() {
    this.users = new Map();
    this.nfts = new Map();
    this.rewards = new Map();
    
    this.currentUserId = 1;
    this.currentNftId = 1;
    this.currentRewardId = 1;
    
    // Initialize with some sample data
    this._initializeData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getNfts(userId: number): Promise<Nft[]> {
    return Array.from(this.nfts.values()).filter(
      (nft) => nft.userId === userId
    );
  }
  
  async getNftById(id: number): Promise<Nft | undefined> {
    return this.nfts.get(id);
  }
  
  async createNft(insertNft: InsertNft): Promise<Nft> {
    const id = this.currentNftId++;
    const nft: Nft = { ...insertNft, id };
    this.nfts.set(id, nft);
    return nft;
  }
  
  async updateNft(id: number, updateData: Partial<Nft>): Promise<Nft | undefined> {
    const nft = this.nfts.get(id);
    if (!nft) return undefined;
    
    const updatedNft = { ...nft, ...updateData };
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }
  
  async getStakedNfts(userId: number): Promise<Nft[]> {
    return Array.from(this.nfts.values()).filter(
      (nft) => nft.userId === userId && nft.isStaked === true
    );
  }
  
  async stakeNft(id: number, stakePeriod: number): Promise<Nft | undefined> {
    const nft = this.nfts.get(id);
    if (!nft) return undefined;
    
    const stakeDate = new Date();
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + stakePeriod);
    
    const updatedNft: Nft = {
      ...nft,
      isStaked: true,
      stakeDate,
      stakePeriod,
      unlockDate
    };
    
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }
  
  async unstakeNft(id: number): Promise<Nft | undefined> {
    const nft = this.nfts.get(id);
    if (!nft) return undefined;
    
    const updatedNft: Nft = {
      ...nft,
      isStaked: false,
      stakeDate: null,
      stakePeriod: null,
      unlockDate: null
    };
    
    this.nfts.set(id, updatedNft);
    return updatedNft;
  }
  
  async getRewards(userId: number): Promise<StakingReward[]> {
    return Array.from(this.rewards.values()).filter(
      (reward) => reward.userId === userId
    );
  }
  
  async createReward(insertReward: InsertStakingReward): Promise<StakingReward> {
    const id = this.currentRewardId++;
    const createdAt = new Date();
    const reward: StakingReward = { ...insertReward, id, createdAt };
    
    this.rewards.set(id, reward);
    return reward;
  }
  
  async claimRewards(userId: number): Promise<StakingReward[]> {
    const userRewards = Array.from(this.rewards.values()).filter(
      (reward) => reward.userId === userId && !reward.claimed
    );
    
    userRewards.forEach(reward => {
      const updatedReward = { ...reward, claimed: true };
      this.rewards.set(reward.id, updatedReward);
    });
    
    return userRewards;
  }
  
  private _initializeData() {
    // Create a demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: 'demo_user',
      password: 'password',
      walletAddress: '0x7f3b55c9dce1480f8b3870834a21f57c3a83a2b'
    };
    this.users.set(demoUser.id, demoUser);
    
    // Create some NFTs for the demo user
    const nftData = [
      {
        tokenId: '3429',
        name: 'Crypto Punk #3429',
        collection: 'CryptoPunks',
        image: 'https://images.unsplash.com/photo-1634196558659-2aa84677da53',
        rarity: 142,
        floor: '1.2 ETH',
        isStaked: false
      },
      {
        tokenId: '8876',
        name: 'Bored Ape #8876',
        collection: 'BAYC',
        image: 'https://images.unsplash.com/photo-1643113135117-50933d8537fb',
        rarity: 348,
        floor: '3.4 ETH',
        isStaked: false
      },
      {
        tokenId: '433',
        name: 'Moonbird #433',
        collection: 'Moonbirds',
        image: 'https://images.unsplash.com/photo-1618022325141-98ec83178e60',
        rarity: 1233,
        floor: '0.8 ETH',
        isStaked: true,
        stakeDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        stakePeriod: 30,
        unlockDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000) // 16 days in future
      },
      {
        tokenId: '2211',
        name: 'Doodle #2211',
        collection: 'Doodles',
        image: 'https://images.unsplash.com/photo-1612487528505-d2338264c821',
        rarity: 5422,
        floor: '0.5 ETH',
        isStaked: false
      },
      {
        tokenId: '765',
        name: 'Azuki #765',
        collection: 'Azuki',
        image: 'https://images.unsplash.com/photo-1629734553003-c83846bb5f4e',
        rarity: 543,
        floor: '1.1 ETH',
        isStaked: true,
        stakeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        stakePeriod: 14,
        unlockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days in future
      },
      {
        tokenId: '5532',
        name: 'CloneX #5532',
        collection: 'CloneX',
        image: 'https://images.unsplash.com/photo-1626163015368-85a8cdc586b9',
        rarity: 892,
        floor: '1.8 ETH',
        isStaked: false
      }
    ];
    
    nftData.forEach(nft => {
      const newNft: Nft = {
        id: this.currentNftId++,
        userId: demoUser.id,
        ...nft
      };
      this.nfts.set(newNft.id, newNft);
    });
    
    // Create initial rewards
    const reward: StakingReward = {
      id: this.currentRewardId++,
      userId: demoUser.id,
      amount: 1234,
      claimed: false,
      createdAt: new Date()
    };
    this.rewards.set(reward.id, reward);
  }
}

export const storage = new MemStorage();
