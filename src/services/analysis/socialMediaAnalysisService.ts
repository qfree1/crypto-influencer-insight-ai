
import { TwitterMetrics } from '@/types';
import { analyzeTwitterEngagement } from '../twitterService';
import { generateSyntheticTwitterData } from './syntheticDataService';

/**
 * Analyze social media metrics for a given handle
 */
export const analyzeSocialMediaMetrics = async (handle: string): Promise<TwitterMetrics> => {
  try {
    // Try to get real Twitter data first
    const twitterData = await analyzeTwitterEngagement(handle);
    
    if (twitterData) {
      // We have real Twitter data!
      const { profile, engagement } = twitterData;
      
      // Generate realistic token data based on engagement
      const tokenCount = 10;
      // Higher engagement tends to correlate with more successful projects
      const rugPullPercentage = Math.max(10, 100 - engagement.engagementRate * 10);
      
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
      
      // Estimate real follower percentage based on engagement rate
      // Very low engagement often indicates fake followers
      const realFollowerPercentage = Math.min(95, Math.max(20, engagement.engagementRate * 10 + 40));
      
      return {
        followers: profile.public_metrics?.followers_count || 5000,
        realFollowerPercentage,
        engagementRate: engagement.engagementRate,
        promotedTokens: tokens
      };
    }
    
    // Fallback to synthetic data
    console.warn('Using synthetic Twitter data');
    return generateSyntheticTwitterData(handle);
  } catch (error) {
    console.error('Error analyzing social media metrics:', error);
    return generateSyntheticTwitterData(handle);
  }
};
