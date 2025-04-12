
import { RiskReport } from '@/types';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';
import { toast } from '@/hooks/use-toast';
import { getApiConfig, getOpenAiConfig } from './keyManagementService';

/**
 * Generate a report for an influencer
 * Uses real backend API for analysis
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Get API configuration securely
    const apiConfig = getApiConfig();
    
    // Make request to backend API
    const response = await fetch(`${apiConfig.apiEndpoint}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`
      },
      body: JSON.stringify({ 
        handle,
        includeBlockchainData: true,
        includeSocialData: true
      })
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
    
    toast({
      title: "Analysis Failed",
      description: "There was an error generating the report. Please try again later.",
      variant: "destructive",
    });
    
    throw error;
  }
};

/**
 * Save a report to history
 */
export const saveReportToHistory = (report: RiskReport): void => {
  try {
    saveReport(report);
    toast({
      title: "Report Saved",
      description: "The report has been saved to your history",
    });
  } catch (error) {
    console.error('Error saving report to history:', error);
    toast({
      title: "Save Failed",
      description: "Could not save the report to history",
      variant: "destructive",
    });
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

/**
 * Analyze with OpenAI
 * This is a helper function that can be used to analyze text with OpenAI
 */
export const analyzeWithOpenAI = async (prompt: string): Promise<string> => {
  try {
    const openAiConfig = getOpenAiConfig();
    
    if (!openAiConfig.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: openAiConfig.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error analyzing with OpenAI:', error);
    toast({
      title: "Analysis Failed",
      description: "Could not complete the OpenAI analysis",
      variant: "destructive",
    });
    throw error;
  }
};
