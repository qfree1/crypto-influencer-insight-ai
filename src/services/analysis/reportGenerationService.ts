
import { BlockchainData, TwitterMetrics } from '@/types';
import { analyzeWithOpenAI } from '../aiService';

/**
 * Calculate a risk score based on blockchain and social media data
 */
export const calculateRiskScore = (
  blockchainData: BlockchainData, 
  twitterMetrics: TwitterMetrics
): number => {
  // Starting with a neutral score
  let score = 50;
  
  // Blockchain factors (increases risk)
  // More rug pulls = higher risk, up to +30 points
  score += Math.min(30, blockchainData.rugPullCount * 10);
  
  // Dumping behavior affects risk
  if (blockchainData.dumpingBehavior === 'high') score += 15;
  else if (blockchainData.dumpingBehavior === 'medium') score += 7;
  
  // MEV activity is a red flag
  if (blockchainData.mevActivity) score += 10;
  
  // Social media factors (can decrease risk)
  // Higher real follower % = lower risk, up to -20 points
  score -= Math.min(20, twitterMetrics.realFollowerPercentage / 5);
  
  // Higher engagement = lower risk, up to -20 points
  score -= Math.min(20, twitterMetrics.engagementRate * 4);
  
  // Promoted token performance affects risk
  const rugPullTokens = twitterMetrics.promotedTokens.filter(token => token.status === 'rugpull');
  const rugPullPercentage = (rugPullTokens.length / twitterMetrics.promotedTokens.length) * 100;
  
  // More rug pulls = higher risk, up to +30 points
  score += Math.min(30, rugPullPercentage / 3);
  
  // Ensure score stays in 1-99 range
  return Math.min(99, Math.max(1, Math.round(score)));
};

/**
 * Generate analysis summary and detailed report
 */
export const generateAnalysisSummary = async (
  riskScore: number,
  handle: string,
  blockchainData: BlockchainData,
  twitterMetrics: TwitterMetrics,
  platform: string = 'x'
): Promise<{ summary: string, detailedAnalysis: string }> => {
  // Get platform display name
  const platformName = getPlatformName(platform);
  
  try {
    // Try to use OpenAI for generating the analysis
    const prompt = `
      Analyze this crypto influencer based on the following data:
      
      Influencer: ${handle} (${platformName})
      Risk Score: ${riskScore} (1-99 scale, higher is riskier)
      
      Blockchain Data:
      - Rug Pull Projects: ${blockchainData.rugPullCount}
      - Dumping Behavior: ${blockchainData.dumpingBehavior}
      - MEV Activity Detected: ${blockchainData.mevActivity ? 'Yes' : 'No'}
      
      Social Media Metrics:
      - Followers: ${twitterMetrics.followers.toLocaleString()}
      - Estimated Real Followers: ${twitterMetrics.realFollowerPercentage}%
      - Engagement Rate: ${twitterMetrics.engagementRate.toFixed(2)}%
      - Promoted Tokens Performance: ${twitterMetrics.promotedTokens.map(t => `${t.name} (${t.status}, ${t.performancePercentage > 0 ? '+' : ''}${t.performancePercentage}%)`).join(', ')}
      
      Generate two sections:
      1. SUMMARY: A brief 2-3 sentence overview of the influencer's credibility and risk level.
      2. DETAILED ANALYSIS: A deeper analysis (about 200-250 words) that explains the risk factors, discusses their behavior patterns, and provides actionable advice for investors considering their recommendations.
      
      Make your analysis specific to crypto influencers and their typical behaviors. Include references to pump and dump schemes, token recommendations, and community engagement if relevant.
    `;
    
    const response = await analyzeWithOpenAI(prompt);
    
    if (response) {
      // Parse OpenAI response
      const summaryMatch = response.match(/SUMMARY:(.*?)(?=DETAILED ANALYSIS:|$)/s);
      const detailsMatch = response.match(/DETAILED ANALYSIS:(.*?)$/s);
      
      return {
        summary: summaryMatch ? summaryMatch[1].trim() : generateDefaultSummary(riskScore, handle, platformName),
        detailedAnalysis: detailsMatch ? detailsMatch[1].trim() : generateDefaultAnalysis(riskScore, handle, blockchainData, twitterMetrics, platformName)
      };
    }
  } catch (error) {
    console.error('Error generating AI analysis:', error);
  }
  
  // Fallback to default generated analysis
  return {
    summary: generateDefaultSummary(riskScore, handle, platformName),
    detailedAnalysis: generateDefaultAnalysis(riskScore, handle, blockchainData, twitterMetrics, platformName)
  };
};

/**
 * Generate a default summary when AI is unavailable
 */
const generateDefaultSummary = (riskScore: number, handle: string, platformName: string): string => {
  if (riskScore < 30) {
    return `@${handle} appears to be a reliable ${platformName} crypto influencer with a low risk score of ${riskScore}/99. Their on-chain activity and social media metrics indicate consistent and trustworthy behavior.`;
  } else if (riskScore < 70) {
    return `@${handle} shows moderate risk with a score of ${riskScore}/99 on our ${platformName} analysis. While not alarming, there are some considerations investors should be aware of before following their recommendations.`;
  } else {
    return `@${handle} presents significant risk with a high score of ${riskScore}/99 in our ${platformName} analysis. Their blockchain activity and promotion history show concerning patterns that investors should carefully evaluate.`;
  }
};

/**
 * Generate a default detailed analysis when AI is unavailable
 */
const generateDefaultAnalysis = (
  riskScore: number, 
  handle: string, 
  blockchainData: BlockchainData, 
  twitterMetrics: TwitterMetrics,
  platformName: string
): string => {
  // Base analysis on risk score ranges
  let analysis = '';
  
  if (riskScore < 30) {
    analysis = `
      Our analysis of @${handle}'s ${platformName} activity and blockchain behavior shows consistently positive patterns. With ${twitterMetrics.followers.toLocaleString()} followers (approximately ${twitterMetrics.realFollowerPercentage}% real accounts) and an engagement rate of ${twitterMetrics.engagementRate.toFixed(2)}%, they maintain an authentic community.
      
      Their blockchain history shows minimal concerning activity, with only ${blockchainData.rugPullCount} potential rug pull associations and ${blockchainData.dumpingBehavior.toLowerCase()} evidence of token dumping after promotions. No suspicious MEV activity was detected, suggesting they don't engage in front-running or sandwich attacks.
      
      Of the ${twitterMetrics.promotedTokens.length} tokens they've promoted, ${twitterMetrics.promotedTokens.filter(t => t.status === 'active').length} remain active with positive performance, indicating thoughtful project selection.
      
      INVESTOR ADVICE: This influencer demonstrates integrity in their recommendations. While always conducting your own research, their advice can be considered generally reliable compared to many others in the space.
    `;
  } else if (riskScore < 70) {
    analysis = `
      @${handle}'s ${platformName} profile (${twitterMetrics.followers.toLocaleString()} followers) shows mixed signals with approximately ${twitterMetrics.realFollowerPercentage}% authentic followers and ${twitterMetrics.engagementRate.toFixed(2)}% engagement rate.
      
      Their blockchain behavior raises moderate concerns: ${blockchainData.rugPullCount} rug pull associations and ${blockchainData.dumpingBehavior.toLowerCase()} token selling patterns after promotions. ${blockchainData.mevActivity ? 'There is evidence of potential MEV activity, which suggests possible market manipulation tactics.' : 'No significant MEV activity was detected.'}
      
      Of their promoted tokens, ${twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length} ended as rug pulls, ${twitterMetrics.promotedTokens.filter(t => t.status === 'declined').length} declined significantly, and ${twitterMetrics.promotedTokens.filter(t => t.status === 'active').length} maintain active status.
      
      INVESTOR ADVICE: Exercise caution with this influencer's recommendations. Their track record shows inconsistency. When they promote projects, wait for market stabilization rather than buying immediately, and always limit your exposure.
    `;
  } else {
    analysis = `
      Our high-risk assessment of @${handle} on ${platformName} is based on several concerning patterns. While they have ${twitterMetrics.followers.toLocaleString()} followers, only about ${twitterMetrics.realFollowerPercentage}% appear to be authentic accounts. Their engagement rate of ${twitterMetrics.engagementRate.toFixed(2)}% suggests possible manipulation of metrics.
      
      Their blockchain history reveals ${blockchainData.rugPullCount} associations with rug pull projects and ${blockchainData.dumpingBehavior.toLowerCase()} evidence of token dumping after promotions. ${blockchainData.mevActivity ? 'There is clear evidence of MEV activity, indicating sophisticated market manipulation tactics.' : 'No significant MEV activity was detected, although other risk factors remain high.'}
      
      A troubling ${twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length} of ${twitterMetrics.promotedTokens.length} promoted tokens ended as rug pulls or failed projects, suggesting a pattern of promoting questionable projects.
      
      INVESTOR ADVICE: This influencer demonstrates multiple high-risk indicators. We strongly recommend avoiding their token recommendations and treating their market analysis with significant skepticism. Their promotion patterns align with typical pump-and-dump operation profiles.
    `;
  }
  
  // Clean up whitespace in the template literal
  return analysis.replace(/\n\s+/g, '\n').trim();
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
