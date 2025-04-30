import { Button } from "@/components/ui/button";

interface CollectionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CollectionTabs({ activeTab, onTabChange }: CollectionTabsProps) {
  return (
    <div className="bg-surface rounded-xl p-4 shadow-lg mb-8">
      <div className="flex space-x-4 border-b border-surface-light overflow-x-auto pb-3">
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "my-nfts" 
              ? "text-primary border-b-2 border-primary font-medium" 
              : "text-text-secondary hover:text-text transition"
          }`}
          onClick={() => onTabChange("my-nfts")}
        >
          My NFTs
        </Button>
        
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "staked-nfts" 
              ? "text-primary border-b-2 border-primary font-medium" 
              : "text-text-secondary hover:text-text transition"
          }`}
          onClick={() => onTabChange("staked-nfts")}
        >
          Staked NFTs
        </Button>
        
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "all-collections" 
              ? "text-primary border-b-2 border-primary font-medium" 
              : "text-text-secondary hover:text-text transition"
          }`}
          onClick={() => onTabChange("all-collections")}
        >
          All Collections
        </Button>
      </div>
    </div>
  );
}
