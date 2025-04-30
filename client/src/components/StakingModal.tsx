import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaking } from "@/hooks/useStaking";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { addDays, formatDate, calculateMultiplier } from "@/lib/utils";

interface StakingModalProps {
  onClose: () => void;
}

export default function StakingModal({ onClose }: StakingModalProps) {
  const { selectedNft } = useStaking();
  const { toast } = useToast();
  const [stakePeriod, setStakePeriod] = useState<string>("7");
  const [isStaking, setIsStaking] = useState(false);
  
  if (!selectedNft) return null;
  
  const multiplier = calculateMultiplier(Number(stakePeriod));
  const estimatedDailyReward = 120 + (selectedNft.rarity ? Math.floor((1000 - Math.min(selectedNft.rarity, 1000)) / 50) : 0);
  const totalEstimatedRewards = Math.floor(estimatedDailyReward * Number(stakePeriod) * multiplier);
  const availableAfterDate = formatDate(addDays(Number(stakePeriod)));
  
  const handleStakeConfirm = async () => {
    if (!selectedNft) return;
    
    setIsStaking(true);
    
    try {
      await apiRequest("POST", `/api/nfts/${selectedNft.id}/stake`, {
        stakePeriod: Number(stakePeriod)
      });
      
      toast({
        title: "NFT Successfully Staked!",
        description: `${selectedNft.name} has been staked for ${stakePeriod} days`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nfts/staked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stake NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-surface text-text border-none max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold space-grotesk mb-4">Stake Your NFT</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="w-full sm:w-1/2">
            <img 
              src={selectedNft.image} 
              alt={selectedNft.name} 
              className="w-full rounded-lg object-cover aspect-square" 
            />
          </div>
          
          <div className="w-full sm:w-1/2">
            <h3 className="font-bold text-lg">{selectedNft.name}</h3>
            <p className="text-text-secondary text-sm mb-4">{selectedNft.collection} Collection</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-text-secondary text-sm">Rarity Rank</label>
                <p className="font-medium">#{selectedNft.rarity} of 10,000</p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Estimated Daily Reward</label>
                <p className="font-medium text-accent">{estimatedDailyReward} $VAULT</p>
              </div>
              
              <div>
                <label className="text-text-secondary text-sm">Staking Period</label>
                <Select 
                  defaultValue="7" 
                  onValueChange={setStakePeriod}
                >
                  <SelectTrigger className="w-full bg-surface-light border border-surface-light rounded-lg p-2 mt-1">
                    <SelectValue placeholder="Select a staking period" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-surface-light">
                    <SelectItem value="7">7 Days (1.0x Multiplier)</SelectItem>
                    <SelectItem value="14">14 Days (1.2x Multiplier)</SelectItem>
                    <SelectItem value="30">30 Days (1.5x Multiplier)</SelectItem>
                    <SelectItem value="90">90 Days (2.0x Multiplier)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-surface-light pt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Early Unstaking Fee</span>
            <span>10% of Rewards</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Available After</span>
            <span>{availableAfterDate}</span>
          </div>
          
          <div className="flex justify-between font-medium">
            <span>Total Estimated Rewards</span>
            <span className="text-accent">{totalEstimatedRewards} $VAULT</span>
          </div>
        </div>
        
        <DialogFooter className="mt-6 flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 bg-surface-light hover:bg-opacity-80 text-text py-3 rounded-lg font-medium transition duration-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStakeConfirm}
            disabled={isStaking}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-3 rounded-lg font-medium transition duration-300"
          >
            {isStaking ? "Confirming..." : "Confirm Staking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
