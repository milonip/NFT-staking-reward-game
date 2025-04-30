export default function Footer() {
  return (
    <footer className="bg-surface mt-8 border-t border-surface-light">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold space-grotesk bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StakeVault
            </div>
            <p className="text-text-secondary text-sm mt-1">Stake your NFTs, earn rewards</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <i className="ri-discord-line text-xl"></i>
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <i className="ri-twitter-line text-xl"></i>
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <i className="ri-medium-line text-xl"></i>
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors">
              <i className="ri-github-line text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-surface-light pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">© 2023 StakeVault. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-text-secondary hover:text-text text-sm transition-colors">Terms</a>
            <a href="#" className="text-text-secondary hover:text-text text-sm transition-colors">Privacy</a>
            <a href="#" className="text-text-secondary hover:text-text text-sm transition-colors">Docs</a>
            <a href="#" className="text-text-secondary hover:text-text text-sm transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
