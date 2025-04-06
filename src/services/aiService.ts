import { InfluencerData, RiskReport, TwitterMetrics, BlockchainData } from '@/types';
import { toast } from '@/hooks/use-toast';

// This is a mock service that would normally call your backend API
// which would then interact with Twitter API, blockchain explorers, and OpenAI

// Mock data for demonstration
const MOCK_INFLUENCERS = {
  'cryptoxking': {
    handle: 'CryptoXKing',
    name: 'Crypto King',
    profileImage: 'https://placehold.co/100x100/6D28D9/FFFFFF/?text=CK',
    metrics: {
      followers: 85000,
      realFollowerPercentage: 72,
      engagementRate: 1.8,
      promotedTokens: [
        { name: 'MOON', status: 'rugpull', performancePercentage: -100 },
        { name: 'ROCKET', status: 'rugpull', performancePercentage: -98 },
        { name: 'STAR', status: 'rugpull', performancePercentage: -100 },
        { name: 'ASTRO', status: 'rugpull', performancePercentage: -95 },
        { name: 'MARS', status: 'rugpull', performancePercentage: -97 },
        { name: 'JUPITER', status: 'rugpull', performancePercentage: -89 },
        { name: 'ETHEREUM', status: 'active', performancePercentage: 15 },
        { name: 'POLYGON', status: 'active', performancePercentage: 8 },
        { name: 'DOGE', status: 'declined', performancePercentage: -92 },
        { name: 'SHIBA', status: 'declined', performancePercentage: -88 },
      ],
    },
    blockchain: {
      address: '0xabcd1234abcd1234abcd1234abcd1234abcd1234',
      rugPullCount: 6,
      dumpingBehavior: 'high',
      mevActivity: true,
    },
    riskScore: 67,
    summary: 'This influencer shows mid-tier trustworthiness. They have promoted several tokens that later suffered major price drops or turned out to be scams. Their engagement metrics suggest some audience manipulation. Proceed with caution when considering their recommendations.',
    detailedAnalysis: 'Analysis of the last 10 promotions shows a concerning pattern: 6 of the projects ended as complete failures with investors losing all funds. The influencer typically sells their tokens within 24-72 hours of promotion, often before significant price drops. Their wallet has received tokens from known scam projects shortly before promotion. Their follower count appears partially inflated, with approximately 28% being bot accounts based on engagement patterns.'
  },
  'cryptogem': {
    handle: 'CryptoGem',
    name: 'Crypto Gem Finder',
    profileImage: 'https://placehold.co/100x100/06B6D4/FFFFFF/?text=CG',
    metrics: {
      followers: 125000,
      realFollowerPercentage: 88,
      engagementRate: 3.2,
      promotedTokens: [
        { name: 'BTC', status: 'active', performancePercentage: 28 },
        { name: 'ETH', status: 'active', performancePercentage: 15 },
        { name: 'SOL', status: 'active', performancePercentage: 45 },
        { name: 'AVAX', status: 'active', performancePercentage: 22 },
        { name: 'MATIC', status: 'active', performancePercentage: 18 },
        { name: 'LINK', status: 'active', performancePercentage: 12 },
        { name: 'DOT', status: 'active', performancePercentage: -15 },
        { name: 'NEAR', status: 'active', performancePercentage: -8 },
        { name: 'ADA', status: 'declined', performancePercentage: -22 },
        { name: 'FTM', status: 'declined', performancePercentage: -35 },
      ],
    },
    blockchain: {
      address: '0xefgh5678efgh5678efgh5678efgh5678efgh5678',
      rugPullCount: 0,
      dumpingBehavior: 'low',
      mevActivity: false,
    },
    riskScore: 18,
    summary: 'This influencer demonstrates high trustworthiness with genuine engagement and a track record of promoting legitimate projects. Their blockchain activity shows alignment with their public recommendations, with no evidence of dump-and-run behavior.',
    detailedAnalysis: 'Analysis of their promotion history shows consistent support for established cryptocurrencies with some smaller but legitimate altcoin projects. Their wallet activity indicates they maintain positions in promoted tokens for extended periods, suggesting genuine belief in these projects. Their social media following consists primarily of real accounts with authentic engagement. No evidence of artificial pumping or coordinated dump schemes was found.'
  },
  'tokenpump': {
    handle: 'TokenPump',
    name: 'Pump Master',
    profileImage: 'https://placehold.co/100x100/DB2777/FFFFFF/?text=TP',
    metrics: {
      followers: 45000,
      realFollowerPercentage: 41,
      engagementRate: 0.8,
      promotedTokens: [
        { name: 'PUMP1', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP2', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP3', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP4', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP5', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP6', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP7', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP8', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP9', status: 'rugpull', performancePercentage: -100 },
        { name: 'PUMP10', status: 'active', performancePercentage: 150 },
      ],
    },
    blockchain: {
      address: '0xijkl9012ijkl9012ijkl9012ijkl9012ijkl9012',
      rugPullCount: 9,
      dumpingBehavior: 'high',
      mevActivity: true,
    },
    riskScore: 95,
    summary: 'EXTREME RISK. This influencer has been involved in multiple confirmed scam projects and shows clear patterns of pump-and-dump schemes. Their follower base is largely artificial, and on-chain analysis shows consistent dumping immediately after promotions.',
    detailedAnalysis: 'This account exhibits classic scam-promoting behavior with 9 of 10 recent promotions ending as complete rug pulls or scams. Blockchain analysis confirms they typically receive tokens before promotion and sell immediately after price pumps. Most followers appear to be bots or inactive accounts. The wallet associated with this influencer has participated in multiple coordinated dump events and shows sophisticated MEV activity to front-run both buys and sells.'
  }
};

/**
 * Generate a mock report for an influencer
 * In a real application, this would call your backend API
 */
export const generateReport = async (handle: string): Promise<RiskReport> => {
  try {
    // Log the request
    console.log(`Generating report for ${handle}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Show a loading toast
    toast({
      title: "Analyzing influencer data",
      description: "Fetching social media and blockchain data...",
    });

    // Check if we have mock data for this handle
    const normalizedHandle = handle.toLowerCase().replace('@', '');
    
    let reportData;
    if (MOCK_INFLUENCERS[normalizedHandle]) {
      const mockData = MOCK_INFLUENCERS[normalizedHandle];
      reportData = {
        influencerData: {
          handle: mockData.handle,
          name: mockData.name,
          profileImage: mockData.profileImage,
        },
        twitterMetrics: mockData.metrics,
        blockchainData: mockData.blockchain,
        riskScore: mockData.riskScore,
        summary: mockData.summary,
        detailedAnalysis: mockData.detailedAnalysis,
        timestamp: Date.now(),
      };
    } else {
      // Generate random data for any other handle
      const riskScore = Math.floor(Math.random() * 100);
      
      // Show another progress toast
      toast({
        title: "AI Analysis in Progress",
        description: "Generating risk report based on data...",
      });
      
      const influencerData: InfluencerData = {
        handle: handle.replace('@', ''),
        name: `${handle.replace('@', '')} (AI Generated)`,
        profileImage: `https://placehold.co/100x100/1E40AF/FFFFFF/?text=${handle.substring(0, 2).toUpperCase()}`,
      };
      
      const twitterMetrics: TwitterMetrics = {
        followers: Math.floor(Math.random() * 200000) + 5000,
        realFollowerPercentage: Math.floor(Math.random() * 100),
        engagementRate: parseFloat((Math.random() * 5).toFixed(1)),
        promotedTokens: Array(10).fill(null).map(() => {
          const statuses = ['rugpull', 'active', 'declined'] as const;
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            name: `TOKEN${Math.floor(Math.random() * 100)}`,
            status,
            performancePercentage: status === 'rugpull' 
              ? -1 * (Math.floor(Math.random() * 50) + 50)
              : status === 'active'
                ? Math.floor(Math.random() * 100) - 20
                : -1 * (Math.floor(Math.random() * 80) + 10),
          };
        }),
      };
      
      const blockchainData: BlockchainData = {
        address: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        rugPullCount: Math.floor(Math.random() * 10),
        dumpingBehavior: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        mevActivity: Math.random() > 0.5,
      };
      
      let summary = '';
      let detailedAnalysis = '';
      
      if (riskScore < 30) {
        summary = 'This influencer demonstrates high trustworthiness with genuine engagement and a strong track record.';
        detailedAnalysis = 'Analysis shows consistent support for legitimate projects with minimal evidence of promotional misconduct. Their wallet activity indicates long-term holding of promoted tokens.';
      } else if (riskScore < 70) {
        summary = 'This influencer shows mixed reliability. Exercise caution when following their recommendations.';
        detailedAnalysis = 'Analysis of their promotion history shows a mix of successful projects and failures. Some evidence of selling after promotion, but not consistently.';
      } else {
        summary = 'HIGH RISK. This influencer shows patterns consistent with pump-and-dump schemes.';
        detailedAnalysis = 'Blockchain analysis reveals consistent selling shortly after promotions. Many promoted projects have failed completely.';
      }
      
      reportData = {
        influencerData,
        twitterMetrics,
        blockchainData,
        riskScore,
        summary,
        detailedAnalysis,
        timestamp: Date.now(),
      };
    }
    
    console.log('Report generated:', reportData);
    
    toast({
      title: "Analysis Complete",
      description: "Risk report generated successfully",
    });
    
    return reportData;
  } catch (error) {
    console.error('Error generating report:', error);
    
    toast({
      title: "Analysis Failed",
      description: "Unable to generate influencer risk report",
      variant: "destructive",
    });
    
    throw error;
  }
};

/**
 * Save a report to history (localStorage)
 * In a real application, this might save to a database
 */
export const saveReportToHistory = (report: RiskReport): void => {
  try {
    const historyKey = 'influencer_reports_history';
    const existingHistory = localStorage.getItem(historyKey);
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add the new report to the beginning of the history array
    history.unshift(report);
    
    // Keep only the 10 most recent reports
    const trimmedHistory = history.slice(0, 10);
    
    localStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving report to history:', error);
  }
};

/**
 * Get report history from localStorage
 * In a real application, this might fetch from a database
 */
export const getReportHistory = (): RiskReport[] => {
  try {
    const historyKey = 'influencer_reports_history';
    const existingHistory = localStorage.getItem(historyKey);
    return existingHistory ? JSON.parse(existingHistory) : [];
  } catch (error) {
    console.error('Error getting report history:', error);
    return [];
  }
};
