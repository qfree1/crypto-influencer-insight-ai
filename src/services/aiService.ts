
import { RiskReport } from '@/types';
import { analyzeInfluencer } from './analysisService';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';

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
    useRealApi: false,
    rateLimit: 10,
    timeout: 30000,
  };
};

/**
 * Generate a report for an influencer
 * Uses real analysis service or configured external API based on settings
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Get API configuration
    const apiConfig = getApiConfig();
    
    if (apiConfig.useRealApi && apiConfig.apiKey) {
      console.log(`Using real API endpoint: ${apiConfig.apiEndpoint}`);
      // This would be implemented to call an external API
      // For now, we'll still use our analysis service but log that we would use the API
      const report = await analyzeInfluencer(handle);
      return report;
    } else {
      // Call our local analysis service
      console.log('Using local analysis service');
      const report = await analyzeInfluencer(handle);
      return report;
    }
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
