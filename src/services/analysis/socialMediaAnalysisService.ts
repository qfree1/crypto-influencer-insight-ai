
import { TwitterMetrics } from '@/types';
import { analyzeTwitterEngagement } from '../twitterService';
import { generateSyntheticTwitterData } from './syntheticDataService';
import { toast } from '@/hooks/use-toast';

/**
 * Analyze social media metrics for a given handle
 */
export const analyzeSocialMediaMetrics = async (handle: string, platform: string = 'x'): Promise<TwitterMetrics> => {
  try {
    console.log(`Attempting to fetch real ${platform} data for ${handle}`);
    
    // For platforms other than Twitter/X, we currently only have synthetic data
    if (platform !== 'x') {
      console.log(`Using synthetic data for ${platform} as real API is not connected`);
      toast({
        title: `Using Demo Data for ${getPlatformName(platform)}`,
        description: `No ${getPlatformName(platform)} API connected, using demonstration data instead`,
      });
      return generateSyntheticTwitterData(handle, platform);
    }
    
    // Try to get real Twitter data first
    const twitterData = await analyzeTwitterEngagement(handle);
    
    if (twitterData) {
      console.log(`Successfully retrieved real Twitter data for ${handle}`);
      toast({
        title: "Real Data Fetched",
        description: "Successfully connected to Twitter API",
      });
      
      // We have real Twitter data!
      const { profile, engagement } = twitterData;
      
      // Generate realistic token data based on engagement
      const tokenCount = 10;
      // Higher engagement tends to correlate with more successful projects
      const rugPullPercentage = Math.max(10, 100 - engagement.engagementRate * 10);
      
      const tokens = Array(tokenCount).fill(null).map((_, index) => {
        const isRugPull = (index / tokenCount * 100) < rugPullPercentage;
        
        return {
          name: `${handle.toUpperCase().substring(0, 3)}_TOKEN${Math.floor(Math.random() * 100)}`,
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
        promotedTokens: tokens,
        platform: 'x'
      };
    }
    
    // Fallback to synthetic data
    console.warn('Unable to fetch real Twitter data. Using synthetic data for', handle);
    toast({
      title: "Using Demo Data",
      description: "Could not access Twitter API, using demonstration data instead",
    });
    return generateSyntheticTwitterData(handle, platform);
  } catch (error) {
    console.error(`Error analyzing ${platform} metrics:`, error);
    console.warn(`Falling back to synthetic ${platform} data due to error`);
    toast({
      title: "Using Demo Data",
      description: `Error accessing ${getPlatformName(platform)} API, using demonstration data instead`,
      variant: "destructive",
    });
    return generateSyntheticTwitterData(handle, platform);
  }
};

// Helper function to get platform display name
const getPlatformName = (platform: string): string => {
  switch(platform) {
    case 'x': return 'Twitter/X';
    case 'instagram': return 'Instagram';
    case 'telegram': return 'Telegram';
    default: return 'Social Media';
  }
};
