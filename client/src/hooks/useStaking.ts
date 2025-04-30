import { useContext } from "react";
import { StakingContext } from "@/context/StakingContext";
import { useWallet } from "@/context/WalletContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useStaking() {
  const stakingContext = useContext(StakingContext);
  const { isConnected, userId } = useWallet();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get rewards data
  const { data: rewardsData } = useQuery({
    queryKey: ["/api/rewards", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });
  
  // Get staking stats
  const { data: statsData } = useQuery({
    queryKey: ["/api/stats", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  // Claim rewards
  const claimRewards = async () => {
    if (!isConnected || !userId) return false;
    
    try {
      const result = await apiRequest("POST", "/api/rewards/claim", { userId });
      const data = await result.json();
      
      toast({
        title: "Rewards Claimed!",
        description: `You have successfully claimed ${data.totalClaimed} $VAULT tokens`,
      });
      
      // Invalidate rewards query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Calculate reward for an NFT
  const calculateNftReward = (rarity: number, stakePeriod: number) => {
    // Base reward calculation
    const rarityFactor = Math.max(0, (1000 - Math.min(rarity, 1000)) / 1000);
    const baseReward = 100 + (rarityFactor * 50);
    
    // Multiplier based on staking period
    let multiplier = 1.0;
    if (stakePeriod >= 90) multiplier = 2.0;
    else if (stakePeriod >= 30) multiplier = 1.5; 
    else if (stakePeriod >= 14) multiplier = 1.2;
    
    return Math.round(baseReward * stakePeriod * multiplier);
  };
  
  return {
    ...stakingContext,
    rewards: rewardsData,
    stats: statsData,
    claimRewards,
    calculateNftReward,
  };
}
