
import { TwitterMetrics } from '@/types';

/**
 * Generate synthetic Twitter data for demonstration/development
 */
export const generateSyntheticTwitterData = (handle: string, platform: string = 'x'): TwitterMetrics => {
  // Create deterministic but seemingly random data based on the handle string
  const handleSum = Array.from(handle).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Use the handle sum to seed our "random" calculations
  const followerBase = platform === 'instagram' ? 50000 : platform === 'telegram' ? 15000 : 25000;
  const followers = followerBase + (handleSum % 100000);
  
  // Engagement rates are often dependent on follower count (inverse relationship in many cases)
  // Small accounts often have higher engagement rates
  const baseEngagement = platform === 'instagram' ? 3.5 : platform === 'telegram' ? 5.0 : 2.0;
  const followerFactor = Math.min(0.5, 5000 / followers);
  const engagementRate = baseEngagement + (followerFactor * (handleSum % 10)) / 10;
  
  // Lower quality/suspicious accounts often have lower real follower percentages
  const realFollowerBase = platform === 'instagram' ? 65 : platform === 'telegram' ? 70 : 75;
  const realFollowerPercentage = Math.min(98, Math.max(25, realFollowerBase + (handleSum % 30)));
  
  // Generate token data
  const tokenCount = 8 + (handleSum % 5); // 8-12 tokens
  const rugPullLikelihood = platform === 'instagram' ? 0.4 : platform === 'telegram' ? 0.5 : 0.3;
  const rugPullPercentage = Math.max(10, Math.min(90, (handleSum % 100) * rugPullLikelihood));
  
  const promotedTokens = Array(tokenCount).fill(null).map((_, index) => {
    const isRugPull = (index / tokenCount * 100) < rugPullPercentage;
    
    const prefix = handle.substring(0, 3).toUpperCase();
    const nameOptions = platform === 'instagram' ? ['GRAM', 'INSTA', 'PHOTO'] : 
                         platform === 'telegram' ? ['TELE', 'GRAM', 'MSG'] : ['TWEET', 'BIRD', 'POST'];
    const nameSuffix = nameOptions[index % nameOptions.length];
    
    return {
      name: `${prefix}_${nameSuffix}${Math.floor((handleSum + index) % 100)}`,
      status: isRugPull ? 'rugpull' as const : Math.random() > 0.7 ? 'declined' as const : 'active' as const,
      performancePercentage: isRugPull 
        ? -1 * (Math.floor((handleSum + index) % 50) + 50)
        : Math.floor((handleSum + index) % 200) - 100,
    };
  });
  
  return {
    followers,
    realFollowerPercentage,
    engagementRate,
    promotedTokens,
    platform
  };
};
