import WalletConnect from "./WalletConnect";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface-light">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-3xl font-bold space-grotesk bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StakeVault
          </div>
          <div className="bg-surface-light px-2 py-1 rounded-md text-xs font-medium hidden sm:block">
            BETA
          </div>
        </div>
        
        <WalletConnect />
      </div>
    </header>
  );
}
