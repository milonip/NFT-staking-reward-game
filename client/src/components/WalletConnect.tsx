import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import { useState } from "react";

export default function WalletConnect() {
  const { isConnected, walletAddress, connect, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {isConnected && (
        <div className="hidden sm:flex items-center bg-surface rounded-full px-3 py-1 text-sm text-text-secondary">
          <span className="inline-block h-2 w-2 rounded-full bg-success mr-2 animate-pulse"></span>
          <span>Ethereum</span>
        </div>
      )}
      
      <Button
        variant="outline"
        className={`relative px-4 py-2 rounded-lg flex items-center transition duration-300 overflow-hidden ${
          isConnected ? 'bg-surface-light' : 'bg-surface hover:bg-surface-light'
        }`}
        disabled={isLoading}
        onClick={isConnected ? disconnect : handleConnect}
      >
        <span className="absolute inset-0 overflow-hidden rounded-lg before:absolute before:inset-0 before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></span>
        <i className="ri-wallet-3-line mr-2"></i>
        <span>
          {isLoading 
            ? "Connecting..." 
            : isConnected 
              ? truncateAddress(walletAddress)
              : "Connect Wallet"
          }
        </span>
      </Button>
    </div>
  );
}
