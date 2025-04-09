
import { RiskReport } from '@/types';
import { analyzeInfluencer } from './analysisService';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';

/**
 * Generate a report for an influencer
 * This now uses our real analysis service instead of mocks
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Call our real analysis service
    const report = await analyzeInfluencer(handle);
    
    // Return the analysis report
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
