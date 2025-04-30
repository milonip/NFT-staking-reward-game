import { Nft } from "./types";

// This is a fallback data file in case the API call fails during development
export const dummyNfts: Nft[] = [
  {
    id: 1,
    userId: 1,
    tokenId: "3429",
    name: "Crypto Punk #3429",
    collection: "CryptoPunks",
    image: "https://images.unsplash.com/photo-1634196558659-2aa84677da53",
    rarity: 142,
    floor: "1.2 ETH",
    isStaked: false
  },
  {
    id: 2,
    userId: 1,
    tokenId: "8876",
    name: "Bored Ape #8876",
    collection: "BAYC",
    image: "https://images.unsplash.com/photo-1643113135117-50933d8537fb",
    rarity: 348,
    floor: "3.4 ETH",
    isStaked: false
  },
  {
    id: 3,
    userId: 1,
    tokenId: "433",
    name: "Moonbird #433",
    collection: "Moonbirds",
    image: "https://images.unsplash.com/photo-1618022325141-98ec83178e60",
    rarity: 1233,
    floor: "0.8 ETH",
    isStaked: true,
    stakeDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    stakePeriod: 30,
    unlockDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000) // 16 days in future
  },
  {
    id: 4,
    userId: 1,
    tokenId: "2211",
    name: "Doodle #2211",
    collection: "Doodles",
    image: "https://images.unsplash.com/photo-1612487528505-d2338264c821",
    rarity: 5422,
    floor: "0.5 ETH",
    isStaked: false
  },
  {
    id: 5,
    userId: 1,
    tokenId: "765",
    name: "Azuki #765",
    collection: "Azuki",
    image: "https://images.unsplash.com/photo-1629734553003-c83846bb5f4e",
    rarity: 543,
    floor: "1.1 ETH",
    isStaked: true,
    stakeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    stakePeriod: 14,
    unlockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days in future
  },
  {
    id: 6,
    userId: 1,
    tokenId: "5532",
    name: "CloneX #5532",
    collection: "CloneX",
    image: "https://images.unsplash.com/photo-1626163015368-85a8cdc586b9",
    rarity: 892,
    floor: "1.8 ETH",
    isStaked: false
  }
];

// Staking tiers data
export const stakingTiers = [
  {
    name: "Bronze",
    minNfts: 1,
    maxNfts: 3,
    multiplier: 1.0,
    icon: "ri-copper-coin-line"
  },
  {
    name: "Silver",
    minNfts: 4,
    maxNfts: 6,
    multiplier: 1.5,
    icon: "ri-silver-coin-line"
  },
  {
    name: "Gold",
    minNfts: 7,
    maxNfts: 9,
    multiplier: 2.0,
    icon: "ri-gold-coin-line"
  },
  {
    name: "Diamond",
    minNfts: 10,
    maxNfts: Infinity,
    multiplier: 3.0,
    icon: "ri-vip-diamond-line"
  }
];

// Staking periods
export const stakingPeriods = [
  { days: 7, multiplier: 1.0, label: "7 Days (1.0x Multiplier)" },
  { days: 14, multiplier: 1.2, label: "14 Days (1.2x Multiplier)" },
  { days: 30, multiplier: 1.5, label: "30 Days (1.5x Multiplier)" },
  { days: 90, multiplier: 2.0, label: "90 Days (2.0x Multiplier)" }
];
