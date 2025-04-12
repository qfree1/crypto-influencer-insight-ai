
import { getTwitterBearerToken, getTwitterApiKey } from './keyManagementService';

/**
 * Fetch Twitter profile data
 */
export const fetchTwitterProfile = async (handle: string) => {
  try {
    const bearerToken = getTwitterBearerToken();
    
    // Twitter API v2 endpoint for user lookup
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${handle}?user.fields=profile_image_url,description,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    return null;
  }
};

/**
 * Fetch Twitter user timeline
 */
export const fetchTwitterTimeline = async (userId: string, maxResults = 10) => {
  try {
    const bearerToken = getTwitterBearerToken();
    
    // Twitter API v2 endpoint for user tweets
    const response = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitter timeline:', error);
    return null;
  }
};

/**
 * Analyze Twitter engagement
 */
export const analyzeTwitterEngagement = async (handle: string) => {
  try {
    // First get the user profile to get the user ID
    const profileData = await fetchTwitterProfile(handle);
    
    if (!profileData || !profileData.data) {
      throw new Error('Failed to fetch Twitter profile');
    }
    
    const userId = profileData.data.id;
    
    // Then get the user's tweets
    const timelineData = await fetchTwitterTimeline(userId, 50);
    
    if (!timelineData || !timelineData.data) {
      throw new Error('Failed to fetch Twitter timeline');
    }
    
    // Calculate average engagement
    const tweets = timelineData.data;
    const totalEngagement = tweets.reduce((sum, tweet) => {
      const metrics = tweet.public_metrics || {};
      return sum + (metrics.like_count || 0) + (metrics.retweet_count || 0) + (metrics.reply_count || 0);
    }, 0);
    
    const averageEngagement = tweets.length > 0 ? totalEngagement / tweets.length : 0;
    const followers = profileData.data.public_metrics?.followers_count || 0;
    
    // Engagement rate as a percentage
    const engagementRate = followers > 0 ? (averageEngagement / followers) * 100 : 0;
    
    return {
      profile: profileData.data,
      engagement: {
        averageEngagement,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
      }
    };
  } catch (error) {
    console.error('Error analyzing Twitter engagement:', error);
    return null;
  }
};
