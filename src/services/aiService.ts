
import { RiskReport } from '@/types';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';
import { toast } from '@/hooks/use-toast';

// Configuration storage key
const API_CONFIG_KEY = 'api_configuration';

// Get API configuration from localStorage
const getApiConfig = () => {
  try {
    const config = localStorage.getItem(API_CONFIG_KEY);
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    console.error('Error loading API configuration:', error);
  }
  
  // Default configuration if none is found
  return {
    apiEndpoint: 'https://api.example.com/influencer-analysis',
    apiKey: '',
    timeout: 30000,
  };
};

/**
 * Make a call to an external API for influencer analysis
 */
const callExternalApi = async (handle: string): Promise<RiskReport> => {
  const apiConfig = getApiConfig();
  
  if (!apiConfig.apiKey) {
    throw new Error('API key is not configured. Please set up your API key in the admin panel.');
  }
  
  try {
    // Log API request
    console.log(`Calling external API at ${apiConfig.apiEndpoint} for handle: ${handle}`);
    
    // Respect timeouts from configuration
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
    
    // Make the API request
    const response = await fetch(`${apiConfig.apiEndpoint}?handle=${encodeURIComponent(handle)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Map the external API response to our internal RiskReport format
    return {
      id: `report-${Date.now()}`,
      influencerData: {
        handle: data.handle || handle,
        name: data.name || handle,
        profileImage: data.profileImage || `https://placehold.co/100x100/6D28D9/FFFFFF/?text=${handle.substring(0, 2).toUpperCase()}`,
      },
      twitterMetrics: {
        followers: data.social?.followers || 0,
        realFollowerPercentage: data.social?.realFollowerPercentage || 0,
        engagementRate: data.social?.engagementRate || 0,
        promotedTokens: data.social?.promotedTokens || [],
      },
      blockchainData: {
        address: data.blockchain?.address || '',
        rugPullCount: data.blockchain?.rugPullCount || 0,
        dumpingBehavior: data.blockchain?.dumpingBehavior || 'low',
        mevActivity: data.blockchain?.mevActivity || false,
      },
      riskScore: data.riskScore || 50,
      summary: data.summary || 'No summary available from external API',
      detailedAnalysis: data.detailedAnalysis || 'No detailed analysis available from external API',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error calling external API:', error);
    
    if (error.name === 'AbortError') {
      toast({
        title: "API Timeout",
        description: `The request to the external API timed out after ${apiConfig.timeout / 1000} seconds`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "API Error",
        description: error.message || "Failed to fetch data from external API",
        variant: "destructive",
      });
    }
    
    throw error;
  }
};

/**
 * Generate a report for an influencer
 * Uses real API to fetch influencer data
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Get API configuration
    const apiConfig = getApiConfig();
    
    if (!apiConfig.apiKey) {
      toast({
        title: "API Not Configured",
        description: "Please set up your API key in the Admin Panel",
        variant: "destructive",
      });
      throw new Error("API key not configured. Please visit the Admin Panel to set up your API key.");
    }
    
    // Call the external API
    console.log(`Using API endpoint: ${apiConfig.apiEndpoint}`);
    const report = await callExternalApi(handle);
    
    // Save the report to history
    saveReport(report);
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

/**
 * Save a report to history
 */
export const saveReportToHistory = (report: RiskReport): void => {
  try {
    saveReport(report);
  } catch (error) {
    console.error('Error saving report to history:', error);
  }
};

/**
 * Get report history
 */
export const getReportHistory = (): RiskReport[] => {
  try {
    return getAllReports().slice(0, 10); // Only return the 10 most recent
  } catch (error) {
    console.error('Error getting report history:', error);
    return [];
  }
};
