
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
    // Generate analysis using OpenAI with an improved detailed prompt
    const prompt = `
      Analyze this crypto influencer and provide a detailed risk assessment. Be thorough but concise.
      
      Influencer: ${handle}
      Risk Score: ${riskScore}/100
      
      Blockchain data:
      - Rug pull count: ${blockchainData.rugPullCount}
      - Dumping behavior: ${blockchainData.dumpingBehavior}
      - MEV activity detected: ${blockchainData.mevActivity ? 'Yes' : 'No'}
      - Wallet address: ${blockchainData.address || 'Unknown'}
      
      Twitter metrics:
      - Followers: ${twitterMetrics.followers.toLocaleString()}
      - Real follower percentage: ${twitterMetrics.realFollowerPercentage}%
      - Engagement rate: ${twitterMetrics.engagementRate}%
      - Promoted tokens that failed (rugpulls): ${twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length}
      - Promoted tokens that succeeded: ${twitterMetrics.promotedTokens.filter(t => t.status === 'active').length}
      
      Provide analysis in two distinct sections. 
      
      SUMMARY: A one-paragraph professional assessment of the influencer's trustworthiness, focusing on real data patterns and red flags if any. Include specific numbers where relevant.
      
      DETAILED ANALYSIS: A more comprehensive 4-6 sentence analysis that examines:
      1. Their blockchain transaction patterns
      2. Their promotion history and what it indicates
      3. Their follower authenticity and engagement metrics
      4. Your final assessment of whether investors should trust this influencer
    `;
    
    console.log('Sending prompt to OpenAI for influencer analysis');
    const aiAnalysis = await analyzeWithOpenAI(prompt);
    
    if (aiAnalysis) {
      console.log('Received AI analysis, extracting summary and detailed sections');
      const summaryMatch = aiAnalysis.match(/SUMMARY:(.*?)(?=DETAILED ANALYSIS:|$)/s);
      const detailedMatch = aiAnalysis.match(/DETAILED ANALYSIS:(.*?)$/s);
      
      const summary = summaryMatch?.[1]?.trim();
      const detailedAnalysis = detailedMatch?.[1]?.trim();
      
      if (summary && detailedAnalysis) {
        console.log('Successfully extracted AI analysis sections');
        return { summary, detailedAnalysis };
      } else {
        console.warn('Could not parse OpenAI response properly, using partial data');
        // If we can't parse properly but have some content, try to use what we have
        if (aiAnalysis.length > 50) {
          const parts = aiAnalysis.split('\n\n');
          if (parts.length >= 2) {
            return { 
              summary: parts[0].replace(/^SUMMARY:\s*/i, ''), 
              detailedAnalysis: parts.slice(1).join('\n\n').replace(/^DETAILED ANALYSIS:\s*/i, '')
            };
          }
        }
      }
    }
    
    console.warn('Falling back to predefined summaries due to AI analysis issues');
    return { 
      summary: fallbackSummary(riskScore), 
      detailedAnalysis: fallbackDetailedAnalysis(riskScore) 
    };
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return { 
      summary: fallbackSummary(riskScore), 
      detailedAnalysis: fallbackDetailedAnalysis(riskScore) 
    };
  }
};
