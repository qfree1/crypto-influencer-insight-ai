
import { InfluencerData, RiskReport } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getInfluencerByHandle, saveInfluencer, saveReport } from './databaseService';
import { analyzeBlockchainActivity } from './analysis/blockchainAnalysisService';
import { analyzeSocialMediaMetrics } from './analysis/socialMediaAnalysisService';
import { calculateRiskScore, generateAnalysisSummary } from './analysis/reportGenerationService';

/**
 * Main analysis function to analyze an influencer
 */
export const analyzeInfluencer = async (handle: string, platform: string = 'x'): Promise<RiskReport> => {
  try {
    console.log(`Analyzing influencer: ${handle} on ${platform}`);
    toast({
      title: "Analysis Started",
      description: "Gathering blockchain and social media data...",
    });
    
    // Normalize handle
    const normalizedHandle = handle.toLowerCase().replace('@', '');
    
    // Check if we already have data for this influencer
    let influencerData = getInfluencerByHandle(normalizedHandle);
    
    // If not found, create new influencer data
    if (!influencerData) {
      influencerData = {
        handle: normalizedHandle,
        name: `${normalizedHandle.charAt(0).toUpperCase() + normalizedHandle.slice(1)}`,
        profileImage: `https://placehold.co/100x100/6D28D9/FFFFFF/?text=${normalizedHandle.substring(0, 2).toUpperCase()}`,
        platform: platform
      };
      saveInfluencer(influencerData);
    }
    
    // Generate synthetic blockchain address from the handle (if needed this could be real data)
    const blockchainAddress = `0x${Array.from(normalizedHandle).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').substring(0, 40)}`;
    
    // Perform analysis
    toast({
      title: `Analyzing ${getPlatformName(platform)}`,
      description: `Evaluating ${getPlatformName(platform)} metrics and history...`,
    });
    const twitterMetrics = await analyzeSocialMediaMetrics(normalizedHandle, platform);
    
    toast({
      title: "Analyzing Blockchain",
      description: "Examining on-chain transactions and patterns...",
    });
    const blockchainData = await analyzeBlockchainActivity(blockchainAddress);
    
    // Calculate risk score
    const riskScore = calculateRiskScore(blockchainData, twitterMetrics);
    
    // Generate analysis text
    toast({
      title: "Generating Report",
      description: "Creating comprehensive analysis...",
    });
    const { summary, detailedAnalysis } = await generateAnalysisSummary(
      riskScore, 
      normalizedHandle, 
      blockchainData, 
      twitterMetrics,
      platform
    );
    
    // Create the report
    const report: RiskReport = {
      id: `${normalizedHandle}-${platform}-${Date.now()}`,
      influencerData: {
        ...influencerData,
        platform
      },
      twitterMetrics,
      blockchainData,
      riskScore,
      summary,
      detailedAnalysis,
      timestamp: Date.now(),
      platform
    };
    
    // Save the report
    saveReport(report);
    
    toast({
      title: "Analysis Complete",
      description: "Risk report generated successfully",
    });
    
    return report;
  } catch (error) {
    console.error('Error analyzing influencer:', error);
    
    toast({
      title: "Analysis Failed",
      description: "Unable to complete the analysis",
      variant: "destructive",
    });
    
    throw error;
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
