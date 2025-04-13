
import { RiskReport } from '@/types';
import { getReportsByInfluencer, getAllReports, saveReport } from './databaseService';
import { toast } from '@/hooks/use-toast';
import { getApiConfig, getOpenAiConfig } from './keyManagementService';

/**
 * Generate a report for an influencer
 * Uses real backend API for analysis, with fallback to local analysis
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Get API configuration securely
    const apiConfig = getApiConfig();
    
    // For development or missing API endpoint, use local analysis
    if (!apiConfig.apiEndpoint) {
      console.log('Using local analysis due to missing API endpoint');
      const { analyzeInfluencer } = await import('./analysisService');
      const report = await analyzeInfluencer(handle);
      saveReport(report);
      return report;
    }
    
    // Make request to backend API
    console.log(`Making request to ${apiConfig.apiEndpoint}/analyze with handle: ${handle}`);
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), apiConfig.timeout);
      });
      
      // Create the fetch promise
      const fetchPromise = fetch(`${apiConfig.apiEndpoint}/analyze`, {
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
      
      // Race the two promises
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('API error:', errorData);
        throw new Error(`API error: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
      // Parse the response
      const report = await response.json();
      console.log('Report generated successfully from remote API:', report);
      
      // Save the report to history
      saveReport(report);
      
      return report;
    } catch (error) {
      console.error('Error making API request:', error);
      throw error; // Rethrow to try local analysis
    }
  } catch (error) {
    console.error('Error generating report from remote API:', error);
    
    // Fallback to local analysis
    console.warn('Using fallback local analysis due to API error');
    toast({
      title: "Using Local Analysis",
      description: "API connection failed, using local processing instead",
    });
    
    const { analyzeInfluencer } = await import('./analysisService');
    
    try {
      const report = await analyzeInfluencer(handle);
      saveReport(report);
      return report;
    } catch (innerError) {
      console.error('Error in fallback analysis:', innerError);
      
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the report. Please try again later.",
        variant: "destructive",
      });
      
      throw new Error('Failed to generate report, even with fallback');
    }
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
      console.warn('OpenAI API key not configured');
      return '';
    }
    
    console.log('Analyzing with OpenAI...');
    
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
      
      // Fallback to generic analysis if OpenAI fails
      if (prompt.includes('Analyze this crypto influencer')) {
        // If this was a report analysis, return fallback text
        const riskScore = parseInt(prompt.match(/Risk Score: (\d+)/)?.[1] || '50');
        const handle = prompt.match(/Influencer: ([^\n]+)/)?.[1] || 'unknown';
        
        return `SUMMARY: ${handle} appears to be a ${riskScore < 30 ? 'reliable' : riskScore > 70 ? 'high-risk' : 'moderate-risk'} influencer with a risk score of ${riskScore}.
        
        DETAILED ANALYSIS: ${
          riskScore < 30 
            ? 'This influencer has a track record of promoting legitimate projects and maintaining long-term positions. Their follower base appears authentic, and engagement patterns suggest real interest in their content.' 
            : riskScore > 70 
              ? 'Analysis reveals concerning patterns including promotion of failed projects and possible manipulation of engagement metrics. The blockchain data suggests a history of selling shortly after promotions.' 
              : 'This influencer shows mixed results with both successful and unsuccessful projects. Some metrics suggest potential issues, but overall they maintain moderate credibility in the space.'
        }`;
      }
      
      return '';
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error analyzing with OpenAI:', error);
    return '';
  }
};
