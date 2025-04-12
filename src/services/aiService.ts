
import { RiskReport } from '@/types';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG_KEY, DEFAULT_API_CONFIG } from '@/constants/apiConfig';
import { analyzeInfluencer } from './analysisService';

/**
 * Generate a report for an influencer
 * Uses local analysis service instead of external API
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Use internal analysis service instead of external API
    const report = await analyzeInfluencer(handle);
    
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
