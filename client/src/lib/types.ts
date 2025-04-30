export interface Nft {
  id: number;
  userId: number;
  tokenId: string;
  name: string;
  collection: string;
  image: string;
  rarity: number;
  floor: string;
  isStaked: boolean;
  stakeDate?: Date | null;
  stakePeriod?: number | null;
  unlockDate?: Date | null;
}

export interface StakingReward {
  id: number;
  userId: number;
  amount: number;
  claimed: boolean;
  createdAt: Date;
}

export interface StakingStats {
  totalStaked: number;
  dailyRewards: number;
  rewardsPool: number;
  apr: number;
  nextRewardTime: string;
}

export interface StakingTier {
  name: string;
  minNfts: number;
  maxNfts: number;
  multiplier: number;
  icon: string;
}

export interface StakingPeriod {
  days: number;
  multiplier: number;
  label: string;
}
