import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import CollectionTabs from "@/components/CollectionTabs";
import NftGrid from "@/components/NftGrid";
import StakingPanel from "@/components/StakingPanel";
import GameSection from "@/components/GameSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import StakingModal from "@/components/StakingModal";
import { useWallet } from "@/context/WalletContext";
import { useStaking } from "@/hooks/useStaking";

export default function Home() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<string>("my-nfts");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [stakingModalOpen, setStakingModalOpen] = useState<boolean>(false);
  const { selectedNft, selectNft } = useStaking();

  const handleNftSelect = (nftId: number) => {
    selectNft(nftId);
    setStakingModalOpen(true);
  };

  const handleCloseStakingModal = () => {
    setStakingModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <StatsOverview />
            
            {/* Add the new GameSection component */}
            <GameSection />
            
            <CollectionTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            <NftGrid 
              activeTab={activeTab}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onNftSelect={handleNftSelect}
            />
          </div>
          
          <StakingPanel />
        </div>
        
        {stakingModalOpen && selectedNft && (
          <StakingModal
            onClose={handleCloseStakingModal}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
