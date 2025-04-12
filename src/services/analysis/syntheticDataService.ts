
import { BlockchainData, TwitterMetrics } from '@/types';

/**
 * Generate synthetic blockchain data when real API fails
 */
export const generateSyntheticBlockchainData = (address: string): BlockchainData => {
  const dumpingScores = ['low', 'medium', 'high'] as const;
  const rugPullCount = Math.floor(Math.random() * 10);
  
  // Higher rug pull count correlates with higher dumping behavior
  let dumpingIndex = 0;
  if (rugPullCount > 6) dumpingIndex = 2;
  else if (rugPullCount > 3) dumpingIndex = 1;
  
  return {
    address: address || `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    rugPullCount,
    dumpingBehavior: dumpingScores[dumpingIndex],
    mevActivity: rugPullCount > 5, // Correlation between rug pulls and MEV activity
  };
};

/**
 * Generate synthetic Twitter data
 */
export const generateSyntheticTwitterData = (handle: string): TwitterMetrics => {
  // Generate more realistic data based on the handle
  const handleHash = handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use the hash to create pseudo-random but consistent values for a handle
  const followers = 5000 + (handleHash % 10) * 20000;
  const realFollowerPercentage = 40 + (handleHash % 6) * 10;
  const engagementRate = 0.5 + (handleHash % 10) / 10;
  
  // Generate promoted tokens with realistic distribution
  // More risky accounts have more rugpulls
  const tokenCount = 10;
  const rugPullPercentage = Math.min(90, Math.max(10, (handleHash % 100)));
  const tokens = Array(tokenCount).fill(null).map((_, index) => {
    const isRugPull = (index / tokenCount * 100) < rugPullPercentage;
    
    return {
      name: `TOKEN${Math.floor(Math.random() * 100)}`,
      status: isRugPull ? 'rugpull' as const : Math.random() > 0.7 ? 'declined' as const : 'active' as const,
      performancePercentage: isRugPull 
        ? -1 * (Math.floor(Math.random() * 50) + 50)
        : Math.floor(Math.random() * 200) - 100,
    };
  });
  
  return {
    followers,
    realFollowerPercentage,
    engagementRate,
    promotedTokens: tokens
  };
};
