import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/context/WalletContext";
import { formatTimeLeft } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Nft } from "@/lib/types";
import { useStaking } from "@/hooks/useStaking";
import { queryClient } from "@/lib/queryClient";

export default function NftGrid({
  activeTab,
  currentPage,
  onPageChange,
  onNftSelect
}: {
  activeTab: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onNftSelect: (nftId: number) => void;
}) {
  const { isConnected, userId } = useWallet();
  const { toast } = useToast();
  const [isUnstaking, setIsUnstaking] = useState<number | null>(null);
  const { selectNft } = useStaking();

  const { data: nfts, isLoading } = useQuery<Nft[]>({
    queryKey: [activeTab === "staked-nfts" ? "/api/nfts/staked" : "/api/nfts", userId],
    queryFn: undefined,
    enabled: isConnected && !!userId,
  });
  
  const handleStakeClick = (nftId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onNftSelect(nftId);
    selectNft(nftId);
  };
  
  const handleUnstakeClick = async (nftId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUnstaking(nftId);
    
    try {
      await apiRequest("POST", `/api/nfts/${nftId}/unstake`, {});
      
      toast({
        title: "NFT Unstaked",
        description: "Your NFT has been successfully unstaked",
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unstake NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnstaking(null);
    }
  };
  
  const handlePagination = (page: number) => {
    onPageChange(page);
  };
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil((nfts?.length || 0) / itemsPerPage);
  const paginatedNfts = nfts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  if (!isConnected) {
    return (
      <div className="rounded-xl p-8 bg-surface text-center">
        <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
        <p className="text-text-secondary mb-4">Connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-surface rounded-xl overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <div className="p-4">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (paginatedNfts.length === 0) {
    return (
      <div className="rounded-xl p-8 bg-surface text-center">
        <h3 className="text-lg font-medium mb-2">No NFTs Found</h3>
        <p className="text-text-secondary">
          {activeTab === "staked-nfts" 
            ? "You don't have any staked NFTs yet" 
            : "No NFTs found in your wallet"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNfts.map((nft) => (
          <div 
            key={nft.id} 
            className={`transition-all duration-300 cursor-pointer ${nft.isStaked ? 'opacity-70 grayscale' : ''}`}
            onClick={() => !nft.isStaked && onNftSelect(nft.id)}
          >
            <div className={`${!nft.isStaked ? 'relative hover:before:opacity-100 before:absolute before:inset-0 before:rounded-xl before:z-[-1] before:opacity-0 before:transition-opacity before:bg-gradient-to-r before:from-primary before:to-secondary before:p-[2px]' : ''} bg-surface rounded-xl overflow-hidden`}>
              <div className="relative">
                <img 
                  src={nft.image} 
                  className="w-full aspect-square object-cover" 
                  alt={nft.name} 
                />
                <span className="absolute top-3 right-3 bg-background/80 text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                  Rarity: #{nft.rarity}
                </span>
                
                {nft.isStaked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="text-center">
                      <i className="ri-lock-2-line text-2xl text-primary"></i>
                      <p className="text-white font-medium mt-2">Currently Staked</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {nft.unlockDate ? formatTimeLeft(new Date(nft.unlockDate)) : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-text-secondary text-sm">Floor: {nft.floor}</p>
                
                <div className="mt-3 flex justify-between items-center">
                  <Badge variant="outline" className="bg-surface-light">
                    {nft.collection}
                  </Badge>
                  
                  {nft.isStaked ? (
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleUnstakeClick(nft.id, e)}
                      disabled={isUnstaking === nft.id}
                      className="bg-error/20 text-error hover:bg-error/30"
                    >
                      {isUnstaking === nft.id ? "Unstaking..." : "Unstake"}
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-white hover:bg-primary"
                      onClick={(e) => handleStakeClick(nft.id, e)}
                    >
                      Stake
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm bg-surface" role="group">
            <Button 
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePagination(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text border-r border-surface-light"
            >
              <i className="ri-arrow-left-s-line"></i>
            </Button>
            
            {[...Array(totalPages)].map((_, i) => (
              <Button 
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => handlePagination(i + 1)}
                className={`px-4 py-2 text-sm font-medium ${
                  currentPage === i + 1 ? 'text-primary' : 'text-text-secondary hover:text-text'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button 
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePagination(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text border-l border-surface-light"
            >
              <i className="ri-arrow-right-s-line"></i>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
