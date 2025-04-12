
import { BlockchainData, RiskReport, TwitterMetrics, InfluencerData } from '@/types';
import { analyzeWithOpenAI } from '../aiService';

/**
 * Calculate risk score based on metrics
 */
export const calculateRiskScore = (blockchainData: BlockchainData, twitterMetrics: TwitterMetrics): number => {
  let score = 0;
  
  // Blockchain factors (50% of score)
  score += blockchainData.rugPullCount * 5; // 0-50 points
  score += blockchainData.dumpingBehavior === 'high' ? 15 : blockchainData.dumpingBehavior === 'medium' ? 7 : 0;
  score += blockchainData.mevActivity ? 10 : 0;
  
  // Twitter metrics factors (50% of score)
  const rugPullCount = twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length;
  score += rugPullCount * 3; // 0-30 points
  score += (100 - twitterMetrics.realFollowerPercentage) / 5; // 0-20 points from fake followers
  
  // Cap the score at 0-100
  return Math.min(100, Math.max(0, score));
};

/**
 * Fallback summary for when AI analysis fails
 */
export const fallbackSummary = (riskScore: number): string => {
  if (riskScore < 30) {
    return 'This influencer demonstrates high trustworthiness with genuine engagement and a track record of promoting legitimate projects.';
  } else if (riskScore < 70) {
    return 'This influencer shows mixed reliability. Exercise caution when following their recommendations.';
  } else {
    return `HIGH RISK. This influencer shows patterns consistent with pump-and-dump schemes. The risk score of ${riskScore} indicates concerning behavior.`;
  }
};

/**
 * Fallback detailed analysis for when AI analysis fails
 */
export const fallbackDetailedAnalysis = (riskScore: number): string => {
  if (riskScore < 30) {
    return 'Analysis of their promotion history shows consistent support for established cryptocurrencies with some smaller but legitimate altcoin projects. Their wallet activity indicates they maintain positions in promoted tokens for extended periods, suggesting genuine belief in these projects. Their social media following consists primarily of real accounts with authentic engagement.';
  } else if (riskScore < 70) {
    return 'Analysis of their promotion history shows a mix of successful projects and failures. Some evidence of selling after promotion, but not consistently. Their follower base appears to include some inauthentic accounts, and engagement metrics suggest potential manipulation in some cases. Consider additional research before following their investment advice.';
  } else {
    return 'Blockchain analysis reveals consistent selling shortly after promotions. Many promoted projects have failed completely. Their follower base appears to be significantly artificial, and engagement patterns suggest coordinated activities. The wallet associated with this account has participated in multiple known rug pulls, showing a pattern of behavior that puts follower investments at significant risk.';
  }
};

/**
 * Generate analysis summary based on risk score and data
 */
export const generateAnalysisSummary = async (
  riskScore: number, 
  handle: string, 
  blockchainData: BlockchainData, 
  twitterMetrics: TwitterMetrics
): Promise<{summary: string, detailedAnalysis: string}> => {
  try {
    // Try to generate analysis using OpenAI
    const prompt = `
      Analyze this crypto influencer and provide a summary and detailed analysis. Be concise.
      
      Influencer: ${handle}
      Risk Score: ${riskScore}/100
      
      Blockchain data:
      - Rug pull count: ${blockchainData.rugPullCount}
      - Dumping behavior: ${blockchainData.dumpingBehavior}
      - MEV activity detected: ${blockchainData.mevActivity ? 'Yes' : 'No'}
      
      Twitter metrics:
      - Followers: ${twitterMetrics.followers}
      - Real follower percentage: ${twitterMetrics.realFollowerPercentage}%
      - Engagement rate: ${twitterMetrics.engagementRate}%
      - Promoted tokens that failed (rugpulls): ${twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length}
      - Promoted tokens that succeeded: ${twitterMetrics.promotedTokens.filter(t => t.status === 'active').length}
      
      Format your response as:
      SUMMARY: A one-paragraph summary of the influencer's trustworthiness.
      
      DETAILED ANALYSIS: A 3-5 sentence detailed analysis of the influencer's behavior patterns and risk factors.
    `;
    
    const aiAnalysis = await analyzeWithOpenAI(prompt);
    
    if (aiAnalysis) {
      const summaryMatch = aiAnalysis.match(/SUMMARY:(.*?)(?=DETAILED ANALYSIS:|$)/s);
      const detailedMatch = aiAnalysis.match(/DETAILED ANALYSIS:(.*?)$/s);
      
      const summary = summaryMatch?.[1]?.trim() || fallbackSummary(riskScore);
      const detailedAnalysis = detailedMatch?.[1]?.trim() || fallbackDetailedAnalysis(riskScore);
      
      return { summary, detailedAnalysis };
    }
  } catch (error) {
    console.error('Error generating AI analysis:', error);
  }
  
  // Fallback to predefined summaries
  return { 
    summary: fallbackSummary(riskScore), 
    detailedAnalysis: fallbackDetailedAnalysis(riskScore) 
  };
};
