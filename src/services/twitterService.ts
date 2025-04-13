
import { getTwitterBearerToken, getTwitterApiKey } from './keyManagementService';
import { toast } from '@/hooks/use-toast';
import { CORS_PROXY } from '@/constants/apiConfig';

/**
 * Fetch Twitter profile data
 */
export const fetchTwitterProfile = async (handle: string) => {
  try {
    console.log(`Fetching Twitter profile for: ${handle}`);
    const bearerToken = getTwitterBearerToken();
    
    if (!bearerToken) {
      console.error('Twitter bearer token is missing');
      return null;
    }
    
    // Clean up handle to ensure it's just the username
    const cleanHandle = handle.replace(/https?:\/\/(www\.)?(twitter|x)\.com\//, '').split('?')[0].split('/')[0];
    console.log(`Cleaned handle: ${cleanHandle}`);
    
    // Use a proxy to avoid CORS issues in development
    const baseUrl = CORS_PROXY ? `${CORS_PROXY}https://api.twitter.com` : 'https://api.twitter.com';
    
    // Twitter API v2 endpoint for user lookup
    const response = await fetch(`${baseUrl}/2/users/by/username/${cleanHandle}?user.fields=profile_image_url,description,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Origin': window.location.origin
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Twitter API error (${response.status}): ${errorText}`);
      throw new Error(`Twitter API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Twitter profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
    // Don't show a toast here, let the caller handle it
    return null;
  }
};

/**
 * Fetch Twitter user timeline
 */
export const fetchTwitterTimeline = async (userId: string, maxResults = 10) => {
  try {
    console.log(`Fetching Twitter timeline for user ID: ${userId}`);
    const bearerToken = getTwitterBearerToken();
    
    if (!bearerToken) {
      console.error('Twitter bearer token is missing');
      return null;
    }
    
    // Use a proxy to avoid CORS issues in development
    const baseUrl = CORS_PROXY ? `${CORS_PROXY}https://api.twitter.com` : 'https://api.twitter.com';
    
    // Twitter API v2 endpoint for user tweets
    const response = await fetch(`${baseUrl}/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Origin': window.location.origin
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Twitter API error (${response.status}): ${errorText}`);
      throw new Error(`Twitter API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Twitter timeline data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Twitter timeline:', error);
    // Don't show a toast here, let the caller handle it
    return null;
  }
};

/**
 * Analyze Twitter engagement
 */
export const analyzeTwitterEngagement = async (handle: string) => {
  try {
    console.log(`Analyzing Twitter engagement for: ${handle}`);
    
    // First get the user profile to get the user ID
    const profileData = await fetchTwitterProfile(handle);
    
    if (!profileData || !profileData.data) {
      console.log('No profile data received, using synthetic data');
      return null;
    }
    
    const userId = profileData.data.id;
    console.log(`User ID for ${handle}: ${userId}`);
    
    // Then get the user's tweets
    const timelineData = await fetchTwitterTimeline(userId, 50);
    
    if (!timelineData || !timelineData.data) {
      console.log('No timeline data received, using synthetic data');
      return null;
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
    
    const result = {
      profile: profileData.data,
      engagement: {
        averageEngagement,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
      }
    };
    
    console.log('Twitter engagement analysis complete:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing Twitter engagement:', error);
    return null;
  }
};
