
// Web3 Types
export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  hasTokens: boolean;
  tokenBalance: string;
  freeReportUsed: boolean;
}

// Analysis Types
export interface InfluencerData {
  handle: string;
  name?: string;
  profileImage?: string;
}

export interface TwitterMetrics {
  followers: number;
  realFollowerPercentage: number;
  engagementRate: number;
  promotedTokens: PromotedToken[];
}

export interface PromotedToken {
  name: string;
  status: 'rugpull' | 'active' | 'declined';
  performancePercentage: number;
}

export interface BlockchainData {
  address?: string;
  rugPullCount: number;
  dumpingBehavior: 'high' | 'medium' | 'low';
  mevActivity: boolean;
}

export interface RiskReport {
  influencerData: InfluencerData;
  twitterMetrics: TwitterMetrics;
  blockchainData: BlockchainData;
  riskScore: number;
  summary: string;
  detailedAnalysis: string;
  timestamp: number;
}

// UI States
export enum AppState {
  CONNECT_WALLET = 'connect_wallet',
  VERIFY_TOKENS = 'verify_tokens',
  INPUT_HANDLE = 'input_handle',
  LOADING_REPORT = 'loading_report',
  SHOW_REPORT = 'show_report',
}

// Transaction Types
export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

// API Response Types
export interface VerifyWalletResponse {
  walletAddress: string;
  balance: string;
  eligible: boolean;
  freeReportUsed: boolean;
}

export interface ProcessPaymentResponse {
  walletAddress: string;
  amount: string;
  tx_hash: string;
  success: boolean;
}
