import { useEffect } from 'react';
import { UserStats } from '@/types';

interface UseFundayCounterProps {
  userStats: UserStats;
  onUserStatsChange: (updater: (prev: UserStats) => UserStats) => void;
}

/**
 * Hook to automatically convert achievement points to fundays
 * Converts 100 achievement points to 1 funday
 */
export const useFundayCounter = ({ userStats, onUserStatsChange }: UseFundayCounterProps) => {
  useEffect(() => {
    // Calculate how many total fundays should be earned from current points
    const totalFundaysEarnable = Math.floor(userStats.points / 100);
    
    // Calculate available fundays (earned - spent)
    const availableFundays = totalFundaysEarnable - (userStats.fundaysSpent || 0);
    
    // If available fundays don't match current count, update it
    if (availableFundays !== userStats.fundayCount) {
      onUserStatsChange(prev => ({
        ...prev,
        fundayCount: Math.max(0, availableFundays), // Ensure never negative
        fundaysSpent: prev.fundaysSpent || 0 // Initialize if undefined
      }));
      
      if (availableFundays > userStats.fundayCount) {
        const newFundays = availableFundays - userStats.fundayCount;
        console.log(`Earned ${newFundays} funday(s)! Available: ${availableFundays}`);
      }
    }
  }, [userStats.points, userStats.fundayCount, userStats.fundaysSpent, onUserStatsChange]);
  
  return {
    totalFundaysEarnable: Math.floor(userStats.points / 100),
    pointsToNextFunday: 100 - (userStats.points % 100),
    spendFunday: () => {
      onUserStatsChange(prev => ({
        ...prev,
        fundayCount: Math.max(0, prev.fundayCount - 1),
        fundaysSpent: (prev.fundaysSpent || 0) + 1
      }));
    }
  };
};