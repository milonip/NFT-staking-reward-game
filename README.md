# NFT Staking Game Platform

An interactive NFT staking and gaming platform where users can stake their NFTs, play mini-games, and earn rewards.

## Features

### NFT Staking
- Stake your NFTs to earn passive rewards
- Multiple staking periods with different reward multipliers
- Tiered staking system based on number of NFTs staked
- Unstake anytime (with potential penalties for early unstaking)

### Interactive Games
- **Dice Game**: Roll dice against the computer. Your staked NFTs increase your potential rewards!
- **Card Game**: Draw cards against the computer for higher rewards
- **NFT Battle**: Use your staked NFTs' power to battle enemies with boosted attacks

### Reward System
- Energy system that regenerates faster with more staked NFTs
- Convert game points to staking rewards
- Boost game performance with your staked NFTs
- Daily rewards for staked NFTs
- Achievement-based bonuses

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Data Storage**: In-memory storage (can be connected to a database)
- **Authentication**: Wallet-based

## Visuals
<img width="1470" alt="Screenshot 2025-04-30 at 11 32 55 AM" src="https://github.com/user-attachments/assets/3a5809eb-c21e-443c-9184-c16989f82ae5" />
<img width="1470" alt="Screenshot 2025-04-30 at 11 33 25 AM" src="https://github.com/user-attachments/assets/5ba42f1c-7b4d-4af0-8546-3478463a0f94" />


## Getting Started

### Prerequisites
- Node.js (v16+)

### Installation

1. Clone the repository
```
git clone https://github.com/milonip/NFT-staking-reward-game.git
```

2. Install dependencies
```
cd NFT-staking-reward-game
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and visit `http://localhost:5000`

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Browse your NFTs in the collection tabs
3. Stake your NFTs by selecting them and choosing a staking period
4. Play games in the Gaming Arena to earn additional rewards
5. Claim your rewards from the staking panel

## Game Mechanics

- Staking more NFTs increases your power in games
- Higher rarity NFTs provide better bonuses in battles
- Energy is consumed when playing games but regenerates over time
- The more NFTs you stake, the faster your energy regenerates
- Convert game points to rewards once you've accumulated enough

## Development Roadmap

- **Phase 1**: Core staking and gaming mechanics (current)
- **Phase 2**: Database integration for persistent storage
- **Phase 3**: Smart contract integration for on-chain staking
- **Phase 4**: Advanced game mechanics and multiplayer features
- **Phase 5**: Leaderboard and competitive gameplay

## Author

Miloni Patel 
@milonip

## Acknowledgments

- Inspired by various NFT staking platforms and web-based mini-games
- Built with React and Express for a responsive, modern experience
