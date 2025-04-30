import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/context/WalletContext";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import StakingTiers from "./StakingTiers";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Nft } from "@/lib/types";

export default function StakingPanel() {
  const { isConnected, userId } = useWallet();
  const { toast } = useToast();
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);
  const [isStakingAll, setIsStakingAll] = useState(false);

  // Get rewards data
  const { data: rewardsData, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["/api/rewards", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  // Get staked NFTs
  const { data: stakedNfts, isLoading: isLoadingStaked } = useQuery<Nft[]>({
    queryKey: ["/api/nfts/staked", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  // Get all NFTs to calculate max possible stake
  const { data: allNfts } = useQuery<Nft[]>({
    queryKey: ["/api/nfts", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  const maxNfts = allNfts?.length || 10;
  const stakedCount = stakedNfts?.length || 0;
  const unclaimedRewards = rewardsData?.unclaimedRewards || 0;
  
  // Calculate multiplier based on staked count
  const multiplier = Math.min(1.0 + (stakedCount * 0.1), 3.0);
  const multiplierPercentage = ((multiplier - 1.0) / 2.0) * 100; // From 1.0 to 3.0 => 0% to 100%

  const handleClaimRewards = async () => {
    if (!isConnected || !userId || unclaimedRewards <= 0) return;
    
    setIsClaimingRewards(true);
    
    try {
      const result = await apiRequest("POST", "/api/rewards/claim", { userId });
      const data = await result.json();
      
      toast({
        title: "Rewards Claimed!",
        description: `You have successfully claimed ${formatNumber(data.totalClaimed)} $VAULT tokens`,
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaimingRewards(false);
    }
  };

  const handleStakeAll = async () => {
    if (!isConnected || !userId || !allNfts?.length) return;
    
    setIsStakingAll(true);
    
    try {
      const unstaked = allNfts.filter(nft => !nft.isStaked);
      
      if (unstaked.length === 0) {
        toast({
          title: "No NFTs Available",
          description: "You don't have any unstaked NFTs to stake",
          variant: "default",
        });
        return;
      }
      
      // Stake each unstaked NFT with default 7-day period
      const stakingPromises = unstaked.map(nft => 
        apiRequest("POST", `/api/nfts/${nft.id}/stake`, { stakePeriod: 7 })
      );
      
      await Promise.all(stakingPromises);
      
      toast({
        title: "NFTs Staked",
        description: `Successfully staked ${unstaked.length} NFTs`,
        variant: "default",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stake all NFTs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStakingAll(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full md:w-1/3 md:sticky md:top-20 self-start">
        <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
            <h2 className="text-2xl font-bold mb-2 space-grotesk">Staking Vault</h2>
            <p className="text-text-secondary text-sm">Connect your wallet to start staking</p>
          </div>
          <div className="p-6">
            <Button 
              variant="outline" 
              className="w-full bg-surface-light hover:bg-opacity-80 text-text py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center"
              disabled
            >
              <i className="ri-wallet-3-line mr-2"></i>
              Connect Wallet First
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = isLoadingRewards || isLoadingStaked;

  return (
    <div className="w-full md:w-1/3 md:sticky md:top-20 self-start">
      <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
          <h2 className="text-2xl font-bold mb-2 space-grotesk">Staking Vault</h2>
          <p className="text-text-secondary text-sm">Stake your NFTs to earn $VAULT tokens</p>
          
          {/* Countdown Timer */}
          <div className="mt-6">
            <p className="text-sm text-text-secondary mb-2">Next Reward Distribution</p>
            <CountdownTimer />
          </div>
        </div>
        
        {/* Staking Info */}
        <div className="p-6 border-b border-surface-light">
          {isLoading ? (
            <>
              <div className="mb-6">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <div className="mb-6">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-48 mt-1" />
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-text-secondary">Your Staked NFTs</h3>
                  <span className="text-white font-bold">{stakedCount}/{maxNfts}</span>
                </div>
                <Progress value={(stakedCount / maxNfts) * 100} className="h-2 bg-surface-light" />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-text-secondary">Unclaimed Rewards</h3>
                  <span className="text-accent font-bold">{formatNumber(unclaimedRewards)} $VAULT</span>
                </div>
                <Progress 
                  value={Math.min((unclaimedRewards / 2000) * 100, 100)} 
                  className="h-2 bg-surface-light [&>div]:bg-accent [&>div]:animate-pulse" 
                />
              </div>
              
              {/* Reward Multiplier */}
              <div className="mb-4">
                <h3 className="text-text-secondary mb-2">Reward Multiplier</h3>
                <div className="flex items-center">
                  <span className="text-warning text-lg font-bold space-grotesk mr-1">{multiplier.toFixed(1)}x</span>
                  <div className="flex-1 h-2 mx-2 bg-surface-light rounded-full">
                    <div className="bg-warning h-2 rounded-full" style={{ width: `${multiplierPercentage}%` }}></div>
                  </div>
                  <span className="text-text-secondary text-xs">Max: 3x</span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">Increase multiplier by staking rare NFTs or longer periods</p>
              </div>
            </>
          )}
          
          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              disabled={!isConnected || unclaimedRewards <= 0 || isClaimingRewards}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center"
              onClick={handleClaimRewards}
            >
              <i className="ri-money-dollar-circle-line mr-2"></i>
              {isClaimingRewards 
                ? "Claiming..." 
                : `Claim Rewards (${formatNumber(unclaimedRewards)} $VAULT)`}
            </Button>
            
            <Button
              variant="outline"
              disabled={!isConnected || isStakingAll}
              className="w-full bg-surface-light hover:bg-opacity-80 text-text py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center"
              onClick={handleStakeAll}
            >
              <i className="ri-stack-line mr-2"></i>
              {isStakingAll ? "Staking..." : "Stake All NFTs"}
            </Button>
          </div>
        </div>
        
        {/* Staked NFTs Preview */}
        <div className="p-6">
          <h3 className="text-text-secondary mb-3">Currently Staked</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-surface-light rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-md" />
                  <div className="ml-3 flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              ))}
            </div>
          ) : stakedNfts && stakedNfts.length > 0 ? (
            <div className="space-y-3">
              {stakedNfts.slice(0, 3).map((nft) => (
                <div key={nft.id} className="flex items-center p-3 bg-surface-light rounded-lg">
                  <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded-md object-cover" />
                  <div className="ml-3 flex-1">
                    <h4 className="font-medium">{nft.name}</h4>
                    <div className="flex items-center text-xs text-text-secondary">
                      <span>Staked: {nft.stakePeriod} days</span>
                      <span className="mx-2">•</span>
                      <span className="text-accent">+{Math.round(120 * (nft.rarity ? 1 + (1000 - Math.min(nft.rarity, 1000)) / 2000 : 1))} $VAULT/day</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-error hover:bg-error/10 p-1 rounded-md" 
                    onClick={async () => {
                      try {
                        await apiRequest("POST", `/api/nfts/${nft.id}/unstake`, {});
                        toast({
                          title: "NFT Unstaked",
                          description: "Your NFT has been successfully unstaked",
                        });
                        queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
                        queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
                        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to unstake NFT",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <i className="ri-close-circle-line text-xl"></i>
                  </Button>
                </div>
              ))}
              
              {stakedNfts.length > 3 && (
                <p className="text-center text-text-secondary text-sm mt-2">
                  +{stakedNfts.length - 3} more staked NFTs
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-text-secondary text-sm py-3">
              No NFTs staked yet. Stake your NFTs to earn rewards.
            </p>
          )}
        </div>
      </div>
      
      {/* Staking Tiers */}
      <StakingTiers stakedCount={stakedCount} />
    </div>
  );
}
