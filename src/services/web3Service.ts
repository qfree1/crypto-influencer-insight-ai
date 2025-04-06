
import { Web3State } from '@/types';
import { getTokenBalance } from './web3/balanceService';
import { payForReport } from './web3/paymentService';
import { markFreeReportUsed, hasFreeReportUsed } from './web3/reportService';
import { setupWeb3Listeners } from './web3/listenerService';
import { formatTokenBalance, REQUIRED_TOKENS } from './web3/tokenUtils';
import { autoReconnectWallet } from './wallet/reconnect';

// Initial web3 state
export const initialWeb3State: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  hasTokens: false,
  tokenBalance: '0',
  freeReportUsed: false,
};

// Export all functions to maintain the same API
export {
  formatTokenBalance,
  getTokenBalance,
  payForReport,
  markFreeReportUsed,
  hasFreeReportUsed,
  setupWeb3Listeners,
  autoReconnectWallet,
  REQUIRED_TOKENS
};
