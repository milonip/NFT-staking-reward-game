import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/context/WalletContext";
import { Nft } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

export function useNfts() {
  const { isConnected, userId } = useWallet();
  const queryClient = useQueryClient();
  
  // Query for all NFTs
  const { 
    data: nfts = [], 
    isLoading, 
    isError 
  } = useQuery<Nft[]>({
    queryKey: ["/api/nfts", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });
  
  // Query for staked NFTs
  const { 
    data: stakedNfts = [] 
  } = useQuery<Nft[]>({
    queryKey: ["/api/nfts/staked", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });

  // Get an NFT by ID from cache
  const getNftById = (id: number): Nft | null => {
    return nfts.find(nft => nft.id === id) || null;
  };
  
  // Stake an NFT
  const stakeNft = async (nftId: number, stakePeriod: number) => {
    try {
      await apiRequest("POST", `/api/nfts/${nftId}/stake`, { stakePeriod });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      return true;
    } catch (error) {
      console.error("Failed to stake NFT:", error);
      return false;
    }
  };
  
  // Unstake an NFT
  const unstakeNft = async (nftId: number) => {
    try {
      await apiRequest("POST", `/api/nfts/${nftId}/unstake`, {});
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      return true;
    } catch (error) {
      console.error("Failed to unstake NFT:", error);
      return false;
    }
  };

  return {
    nfts,
    stakedNfts,
    isLoading,
    isError,
    getNftById,
    stakeNft,
    unstakeNft,
  };
}
