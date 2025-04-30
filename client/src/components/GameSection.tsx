import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Gamepad2, Dice5, User, Flame, Heart, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/context/WalletContext";
import { useStakingContext } from "@/context/StakingContext";
import { addDays, formatDate, formatNumber } from "@/lib/utils";
import { useNfts } from "@/hooks/useNfts";
import { useStaking } from "@/hooks/useStaking";
import { Nft } from "@/lib/types";

export default function GameSection() {
  const { isConnected } = useWallet();
  const { stakedNfts } = useNfts();
  const { claimRewards } = useStaking();
  const [activeGame, setActiveGame] = useState<string>("dice");
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(100);
  const [playerScore, setPlayerScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<Array<{
    game: string;
    result: 'win' | 'lose';
    reward: number;
    timestamp: Date;
  }>>([]);
  
  // Decrease energy over time to simulate resource management
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergyLevel(prev => Math.max(0, prev - 1));
    }, 60000); // Decrease by 1 every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Reset energy if user has no energy left but has staked NFTs
  useEffect(() => {
    if (energyLevel <= 0 && stakedNfts.length > 0) {
      // Energy recharges faster the more NFTs are staked
      const rechargeRate = Math.min(100, 20 + stakedNfts.length * 5);
      setEnergyLevel(rechargeRate);
    }
  }, [energyLevel, stakedNfts]);
  
  // Dice Game Logic
  const playDiceGame = () => {
    if (energyLevel < 10) return; // Not enough energy
    
    setGameInProgress(true);
    setGameResult(null);
    
    // Consume energy
    setEnergyLevel(prev => Math.max(0, prev - 10));
    
    setTimeout(() => {
      const playerRoll = Math.floor(Math.random() * 6) + 1;
      const computerRoll = Math.floor(Math.random() * 6) + 1;
      
      const result = playerRoll > computerRoll ? 'win' : 'lose';
      setGameResult(result);
      
      // Award points based on staked NFTs power
      if (result === 'win') {
        const baseReward = 50;
        const stakingBonus = stakedNfts.length * 15;
        const totalReward = baseReward + stakingBonus;
        setPlayerScore(prev => prev + totalReward);
        
        // Add to game history
        setGameHistory(prev => [
          {
            game: "Dice Roll",
            result: 'win',
            reward: totalReward,
            timestamp: new Date()
          },
          ...prev
        ]);
      }
      
      setGameInProgress(false);
    }, 2000);
  };
  
  // Card Game Logic
  const playCardGame = () => {
    if (energyLevel < 15) return; // Not enough energy
    
    setGameInProgress(true);
    setGameResult(null);
    
    // Consume energy
    setEnergyLevel(prev => Math.max(0, prev - 15));
    
    setTimeout(() => {
      const playerCard = Math.floor(Math.random() * 13) + 1;
      const computerCard = Math.floor(Math.random() * 13) + 1;
      
      const result = playerCard >= computerCard ? 'win' : 'lose';
      setGameResult(result);
      
      // Award points based on staked NFTs power
      if (result === 'win') {
        const baseReward = 80;
        const stakingBonus = stakedNfts.length * 25;
        const totalReward = baseReward + stakingBonus;
        setPlayerScore(prev => prev + totalReward);
        
        // Add to game history
        setGameHistory(prev => [
          {
            game: "Card Draw",
            result: 'win',
            reward: totalReward,
            timestamp: new Date()
          },
          ...prev
        ]);
      }
      
      setGameInProgress(false);
    }, 2000);
  };
  
  // Battle Game Logic
  const playBattleGame = () => {
    if (energyLevel < 25) return; // Not enough energy
    
    setGameInProgress(true);
    setGameResult(null);
    
    // Consume energy
    setEnergyLevel(prev => Math.max(0, prev - 25));
    
    setTimeout(() => {
      // Calculate player power based on staked NFTs
      const nftPower = stakedNfts.reduce((total: number, nft: Nft) => {
        return total + (nft.rarity * 10);
      }, 0);
      
      const playerPower = 50 + nftPower;
      const enemyPower = Math.floor(Math.random() * 150) + 50;
      
      const result = playerPower > enemyPower ? 'win' : 'lose';
      setGameResult(result);
      
      // Award points based on battle outcome
      if (result === 'win') {
        const baseReward = 150;
        const powerBonus = Math.floor(nftPower / 2);
        const totalReward = baseReward + powerBonus;
        setPlayerScore(prev => prev + totalReward);
        
        // Add to game history
        setGameHistory(prev => [
          {
            game: "NFT Battle",
            result: 'win',
            reward: totalReward,
            timestamp: new Date()
          },
          ...prev
        ]);
      }
      
      setGameInProgress(false);
    }, 3000);
  };
  
  // Convert game points to rewards
  const convertPointsToRewards = () => {
    if (playerScore < 500) return;
    
    // Only allow converting if user has staked NFTs
    if (stakedNfts.length === 0) return;
    
    // Convert points to rewards at 10:1 ratio (influenced by staked NFTs)
    const conversionRate = 10 - Math.min(5, Math.floor(stakedNfts.length / 2));
    const rewardsEarned = Math.floor(playerScore / conversionRate);
    
    // Reset player score
    setPlayerScore(0);
    
    // Add to total rewards (this would typically call an API)
    // For now just display a message
    alert(`Converted ${playerScore} points to ${rewardsEarned} rewards!`);
  };
  
  if (!isConnected) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <Gamepad2 className="inline-block mr-2" /> NFT Gaming Arena
          </CardTitle>
          <CardDescription>
            Connect your wallet to play games with your staked NFTs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            <Gamepad2 className="inline-block mr-2" /> NFT Gaming Arena
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="py-1">
              <Trophy className="w-4 h-4 mr-1" />
              <span>{formatNumber(playerScore)} Points</span>
            </Badge>
            
            <Button size="sm" onClick={convertPointsToRewards} 
                    disabled={playerScore < 500 || stakedNfts.length === 0}>
              Convert to Rewards
            </Button>
          </div>
        </div>
        <CardDescription>
          Use your staked NFTs to boost your gaming power and earn rewards.
          {stakedNfts.length === 0 && (
            <div className="mt-2 text-red-500">
              You need to stake NFTs to receive gaming bonuses and earn more rewards!
            </div>
          )}
        </CardDescription>
        
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Energy</span>
              <span>{energyLevel}/100</span>
            </div>
            <Progress value={energyLevel} className="h-2" />
          </div>
          <Badge variant={energyLevel < 25 ? "destructive" : "outline"} className="py-1">
            <Zap className="w-4 h-4 mr-1" />
            <span>{energyLevel}%</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="dice" value={activeGame} onValueChange={setActiveGame}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="dice" className="flex-1">
              <Dice5 className="w-4 h-4 mr-2" /> Dice Roll
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex-1">
              <User className="w-4 h-4 mr-2" /> Card Draw
            </TabsTrigger>
            <TabsTrigger value="battle" className="flex-1">
              <Flame className="w-4 h-4 mr-2" /> NFT Battle
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dice" className="space-y-4">
            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Dice Challenge</h3>
              <p className="mb-4">Roll a dice against the computer. If your roll is higher, you win!</p>
              
              {gameResult && activeGame === "dice" && (
                <div className={`text-2xl font-bold mb-4 ${gameResult === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                  {gameResult === 'win' ? 'You Win!' : 'You Lose!'}
                </div>
              )}
              
              <div className="flex justify-center gap-12 my-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Your Roll</div>
                  <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-lg text-2xl font-bold">
                    {gameInProgress && activeGame === "dice" ? '?' : (gameResult ? Math.floor(Math.random() * 6) + 1 : '-')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Computer Roll</div>
                  <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-lg text-2xl font-bold">
                    {gameInProgress && activeGame === "dice" ? '?' : (gameResult ? Math.floor(Math.random() * 6) + 1 : '-')}
                  </div>
                </div>
              </div>
              
              <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Cost:</span> 10 Energy
                {stakedNfts.length > 0 && (
                  <span className="ml-2 text-green-500">
                    +{stakedNfts.length * 15} points bonus with your staked NFTs!
                  </span>
                )}
              </div>
              
              <Button onClick={playDiceGame} disabled={gameInProgress || energyLevel < 10}>
                {gameInProgress && activeGame === "dice" ? 'Rolling...' : 'Roll Dice'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="cards" className="space-y-4">
            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Card Draw Challenge</h3>
              <p className="mb-4">Draw a card against the computer. Highest card wins!</p>
              
              {gameResult && activeGame === "cards" && (
                <div className={`text-2xl font-bold mb-4 ${gameResult === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                  {gameResult === 'win' ? 'You Win!' : 'You Lose!'}
                </div>
              )}
              
              <div className="flex justify-center gap-12 my-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Your Card</div>
                  <div className="w-24 h-32 bg-primary/10 flex items-center justify-center rounded-lg text-2xl font-bold border border-primary/20">
                    {gameInProgress && activeGame === "cards" ? '?' : (gameResult ? Math.floor(Math.random() * 13) + 1 : '-')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Computer Card</div>
                  <div className="w-24 h-32 bg-primary/10 flex items-center justify-center rounded-lg text-2xl font-bold border border-primary/20">
                    {gameInProgress && activeGame === "cards" ? '?' : (gameResult ? Math.floor(Math.random() * 13) + 1 : '-')}
                  </div>
                </div>
              </div>
              
              <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Cost:</span> 15 Energy
                {stakedNfts.length > 0 && (
                  <span className="ml-2 text-green-500">
                    +{stakedNfts.length * 25} points bonus with your staked NFTs!
                  </span>
                )}
              </div>
              
              <Button onClick={playCardGame} disabled={gameInProgress || energyLevel < 15}>
                {gameInProgress && activeGame === "cards" ? 'Drawing...' : 'Draw Card'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="battle" className="space-y-4">
            <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-2">NFT Battle Arena</h3>
              <p className="mb-4">Use your staked NFTs to battle against enemies. Your NFT's rarity increases your power!</p>
              
              {gameResult && activeGame === "battle" && (
                <div className={`text-2xl font-bold mb-4 ${gameResult === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                  {gameResult === 'win' ? 'Victory!' : 'Defeat!'}
                </div>
              )}
              
              <div className="flex justify-center gap-12 my-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Your Power</div>
                  <div className="w-24 h-24 bg-primary/10 flex items-center justify-center rounded-lg text-2xl font-bold border border-primary/20">
                    {gameInProgress && activeGame === "battle" ? '?' : '50+'}
                    {!gameInProgress && stakedNfts.length > 0 && (
                      <span className="text-green-500">
                        {stakedNfts.reduce((total, nft) => total + (nft.rarity * 10), 0)}
                      </span>
                    )}
                  </div>
                  {stakedNfts.length > 0 && (
                    <div className="mt-1 text-xs text-green-500">
                      Boosted by {stakedNfts.length} NFTs
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Enemy Power</div>
                  <div className="w-24 h-24 bg-destructive/10 flex items-center justify-center rounded-lg text-2xl font-bold border border-destructive/20">
                    {gameInProgress && activeGame === "battle" ? '?' : (gameResult ? Math.floor(Math.random() * 150) + 50 : '???')}
                  </div>
                </div>
              </div>
              
              <div className="mb-4 text-sm">
                <span className="text-muted-foreground">Cost:</span> 25 Energy
                {stakedNfts.length > 0 && (
                  <span className="ml-2 text-green-500">
                    Higher chance to win with your {stakedNfts.length} staked NFTs!
                  </span>
                )}
              </div>
              
              {stakedNfts.length === 0 ? (
                <Button disabled>
                  Stake NFTs to Battle
                </Button>
              ) : (
                <Button onClick={playBattleGame} disabled={gameInProgress || energyLevel < 25} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                  {gameInProgress && activeGame === "battle" ? 'Battling...' : 'Start Battle'}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Crown className="w-4 h-4 mr-1 text-yellow-500" /> Game History
          </h3>
          
          {gameHistory.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Play games to see your history
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-black/5 dark:bg-white/5 rounded-md">
                  <div className="flex items-center">
                    <Badge variant={game.result === 'win' ? "secondary" : "destructive"} className="mr-2">
                      {game.result === 'win' ? 'WIN' : 'LOSS'}
                    </Badge>
                    <span>{game.game}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">+{game.reward} pts</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(game.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}