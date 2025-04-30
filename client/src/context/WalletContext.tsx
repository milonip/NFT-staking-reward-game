import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  userId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  walletAddress: "",
  userId: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
    
    if (savedUserId) {
      setUserId(parseInt(savedUserId, 10));
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    
    try {
      // In a real-world app, we would use a wallet library like ethers.js
      // For this demo, we'll just generate a fake wallet address
      const fakeWalletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      // Register wallet with backend
      const response = await apiRequest("POST", "/api/auth/wallet", { 
        walletAddress: fakeWalletAddress 
      });
      
      const data = await response.json();
      
      setWalletAddress(fakeWalletAddress);
      setUserId(data.user.id);
      setIsConnected(true);
      
      // Save wallet to localStorage
      localStorage.setItem("wallet", fakeWalletAddress);
      localStorage.setItem("userId", data.user.id.toString());
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress("");
    setUserId(null);
    setIsConnected(false);
    
    // Remove wallet from localStorage
    localStorage.removeItem("wallet");
    localStorage.removeItem("userId");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletAddress,
        userId,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
