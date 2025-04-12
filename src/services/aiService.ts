
import { RiskReport } from '@/types';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG_KEY, DEFAULT_API_CONFIG } from '@/constants/apiConfig';

/**
 * Generate a report for an influencer
 * Uses real backend API for analysis
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Get API configuration from localStorage or use defaults
    const storedConfig = localStorage.getItem(API_CONFIG_KEY);
    const apiConfig = storedConfig ? JSON.parse(storedConfig) : DEFAULT_API_CONFIG;
    
    // Make request to backend API
    const response = await fetch(`${apiConfig.apiEndpoint}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({ handle })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const report = await response.json();
    
    // Save the report to history
    saveReport(report);
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    
    // Fallback to local analysis for development purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using fallback local analysis for development');
      const { analyzeInfluencer } = await import('./analysisService');
      const report = await analyzeInfluencer(handle);
      saveReport(report);
      return report;
    }
    
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
