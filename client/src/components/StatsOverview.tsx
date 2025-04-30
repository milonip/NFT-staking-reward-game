import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import StatCard from "./StatCard";
import { useWallet } from "@/context/WalletContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsOverview() {
  const { isConnected, userId } = useWallet();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  // Default stats when wallet not connected or data loading
  const defaultStats = {
    totalStaked: 0,
    dailyRewards: 0,
    rewardsPool: 1200000, // 1.2M
    apr: 124
  };

  const statsData = stats || defaultStats;

  if (!isConnected) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Staked"
          value="--"
          helpText="Connect wallet to view"
        />
        <StatCard
          title="Daily Rewards"
          value="--"
          label="$VAULT"
          subValue="--"
        />
        <StatCard
          title="Rewards Pool"
          value="1.2M"
          label="$VAULT"
          helpText="Replenishes every 24h"
        />
        <StatCard
          title="APR"
          value="124%"
          helpText="Based on current stakers"
          isSuccess
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-surface rounded-xl p-5 shadow-lg">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mt-2 mb-4" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Staked"
        value={statsData.totalStaked.toString()}
        helpText={<>
          <i className="ri-arrow-up-line text-success mr-1"></i> +2 this week
        </>}
      />
      <StatCard
        title="Daily Rewards"
        value={formatNumber(statsData.dailyRewards)}
        label="$VAULT"
        subValue="~$47 USD"
      />
      <StatCard
        title="Rewards Pool"
        value={formatNumber(statsData.rewardsPool / 1000) + 'K'}
        label="$VAULT"
        helpText="Replenishes every 24h"
      />
      <StatCard
        title="APR"
        value={`${statsData.apr}%`}
        helpText="Based on current stakers"
        isSuccess
      />
    </div>
  );
}
