import { type ClassValue, clsx } from "clsx";

// Define a simple utility function as a replacement for tailwind-merge 
// since we're having issues with the package
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date to display remaining days, hours, minutes
export function formatTimeLeft(endDate: Date): string {
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return "Expired";
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
  } else {
    return `${diffHrs} hours remaining`;
  }
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Truncate wallet address
export function truncateAddress(address: string): string {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
}

// Calculate time remaining in hours, minutes, seconds
export function getTimeRemaining(endTime: Date): { hours: number; minutes: number; seconds: number } {
  const total = endTime.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  
  return { hours, minutes, seconds };
}

// Add days to current date
export function addDays(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}

// Format date to readable format
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Calculate reward multiplier based on staking days
export function calculateMultiplier(days: number): number {
  if (days >= 90) return 2.0;
  if (days >= 30) return 1.5;
  if (days >= 14) return 1.2;
  return 1.0;
}

// Calculate tier based on staked NFTs count
export function calculateTier(stakedCount: number): string {
  if (stakedCount >= 10) return 'Diamond';
  if (stakedCount >= 7) return 'Gold';
  if (stakedCount >= 4) return 'Silver';
  return 'Bronze';
}

// Calculate tier multiplier based on tier
export function getTierMultiplier(tier: string): number {
  switch (tier) {
    case 'Diamond': return 3.0;
    case 'Gold': return 2.0;
    case 'Silver': return 1.5;
    case 'Bronze': return 1.0;
    default: return 1.0;
  }
}
