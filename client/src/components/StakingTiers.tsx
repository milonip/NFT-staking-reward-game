import { calculateTier, getTierMultiplier } from "@/lib/utils";

interface StakingTiersProps {
  stakedCount: number;
}

const tiers = [
  {
    name: "Bronze",
    icon: "ri-copper-coin-line",
    color: "primary",
    requirements: "1-3 NFTs staked • 1.0x multiplier",
    minNfts: 1,
    maxNfts: 3
  },
  {
    name: "Silver",
    icon: "ri-silver-coin-line",
    color: "secondary",
    requirements: "4-6 NFTs staked • 1.5x multiplier",
    minNfts: 4,
    maxNfts: 6
  },
  {
    name: "Gold",
    icon: "ri-gold-coin-line",
    color: "warning",
    requirements: "7-9 NFTs staked • 2.0x multiplier",
    minNfts: 7,
    maxNfts: 9
  },
  {
    name: "Diamond",
    icon: "ri-vip-diamond-line",
    color: "accent",
    requirements: "10+ NFTs staked • 3.0x multiplier",
    minNfts: 10,
    maxNfts: Infinity
  }
];

export default function StakingTiers({ stakedCount }: StakingTiersProps) {
  // Calculate the current tier based on staked count
  const currentTier = stakedCount >= 10 
    ? "Diamond" 
    : stakedCount >= 7 
      ? "Gold" 
      : stakedCount >= 4 
        ? "Silver" 
        : stakedCount >= 1 
          ? "Bronze" 
          : "";

  return (
    <div className="mt-6 bg-surface rounded-xl p-6 shadow-lg">
      <h3 className="font-bold space-grotesk text-lg mb-4">Staking Tiers</h3>
      <div className="space-y-3">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`flex items-center p-3 bg-surface-light/50 rounded-lg ${
              tier.name !== currentTier && stakedCount > 0 ? 'opacity-60' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full bg-${tier.color}/20 flex items-center justify-center text-${tier.color} mr-3`}>
              <i className={tier.icon}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{tier.name}</h4>
              <p className="text-xs text-text-secondary">{tier.requirements}</p>
            </div>
            {tier.name === currentTier ? (
              <div className="text-primary text-sm font-medium">Active</div>
            ) : stakedCount > 0 ? (
              <div className="text-text-secondary text-sm">Locked</div>
            ) : (
              <div className="text-text-secondary text-sm">-</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
