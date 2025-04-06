
/**
 * Storage service for saving user wallet and preferences
 */

// Key constants
const WALLET_STORAGE_KEY = 'web3d_connected_wallet';
const WALLET_PROVIDER_KEY = 'web3d_wallet_provider';

// Save connected wallet address
export const saveWalletConnection = (address: string, provider: string): void => {
  if (address) {
    localStorage.setItem(WALLET_STORAGE_KEY, address);
    localStorage.setItem(WALLET_PROVIDER_KEY, provider);
  }
};

// Get saved wallet connection
export const getSavedWalletConnection = (): { address: string | null, provider: string | null } => {
  const address = localStorage.getItem(WALLET_STORAGE_KEY);
  const provider = localStorage.getItem(WALLET_PROVIDER_KEY);
  return { address, provider };
};

// Clear wallet connection
export const clearWalletConnection = (): void => {
  localStorage.removeItem(WALLET_STORAGE_KEY);
  localStorage.removeItem(WALLET_PROVIDER_KEY);
};

// Mark free report as used (moved from reportService for consistency)
export const markFreeReportUsed = (address: string): void => {
  if (address) {
    localStorage.setItem(`freeReport_${address}`, 'true');
  }
};

// Check if user has used free report (moved from reportService for consistency)
export const hasFreeReportUsed = (address: string): boolean => {
  return localStorage.getItem(`freeReport_${address}`) === 'true';
};

// Key for storing analysis history
export const ANALYSIS_HISTORY_KEY = 'web3d_analysis_history';

// Save analysis data structure
export interface SavedAnalysis {
  influencer: string;
  date: string;
  reportId: string;
}

// Get saved analysis history
export const getSavedAnalysisHistory = (): SavedAnalysis[] => {
  const historyData = localStorage.getItem(ANALYSIS_HISTORY_KEY);
  return historyData ? JSON.parse(historyData) : [];
};

// Save analysis to history
export const saveAnalysisToHistory = (analysis: SavedAnalysis): void => {
  const history = getSavedAnalysisHistory();
  const updated = [analysis, ...history].slice(0, 10); // Keep only last 10 analyses
  localStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(updated));
};
