import { createContext, useContext, useState, ReactNode } from "react";
import { Nft } from "@/lib/types";
import { useNfts } from "@/hooks/useNfts";

interface StakingContextType {
  selectedNft: Nft | null;
  selectNft: (nftId: number) => void;
  clearSelectedNft: () => void;
}

export const StakingContext = createContext<StakingContextType>({
  selectedNft: null,
  selectNft: () => {},
  clearSelectedNft: () => {},
});

export const useStakingContext = () => useContext(StakingContext);

export const StakingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
  const { getNftById } = useNfts();
  
  const selectedNft = selectedNftId ? getNftById(selectedNftId) : null;
  
  const selectNft = (nftId: number) => {
    setSelectedNftId(nftId);
  };
  
  const clearSelectedNft = () => {
    setSelectedNftId(null);
  };
  
  return (
    <StakingContext.Provider
      value={{
        selectedNft,
        selectNft,
        clearSelectedNft,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};
