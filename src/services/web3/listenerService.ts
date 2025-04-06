
import { Web3State } from '@/types';
import { getTokenBalance } from './balanceService';
import { hasFreeReportUsed } from './reportService';
import { REQUIRED_TOKENS } from './tokenUtils';
import { initialWeb3State } from '../web3Service';

// Listen for account changes
export const setupWeb3Listeners = (callback: (newState: Partial<Web3State>) => void): void => {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', async (accounts: string[]) => {
    if (accounts.length === 0) {
      callback(initialWeb3State);
    } else {
      const address = accounts[0];
      const tokenBalance = await getTokenBalance(address);
      const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;
      const freeReportUsed = hasFreeReportUsed(address);
      
      callback({
        isConnected: true,
        address,
        hasTokens,
        tokenBalance,
        freeReportUsed,
      });
    }
  });

  window.ethereum.on('chainChanged', () => {
    // Reload the page when chain changes
    window.location.reload();
  });
};
