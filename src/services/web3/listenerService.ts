
import { Web3State } from '@/types';
import { getTokenBalance } from './balanceService';
import { hasFreeReportUsed } from './reportService';
import { REQUIRED_TOKENS } from './tokenUtils';
import { initialWeb3State } from '../web3Service';
import { toast } from '@/hooks/use-toast';

// Listen for account changes
export const setupWeb3Listeners = (callback: (newState: Partial<Web3State>) => void): void => {
  if (!window.ethereum) return;

  // Account changed handler
  window.ethereum.on('accountsChanged', async (accounts: string[]) => {
    if (accounts.length === 0) {
      callback(initialWeb3State);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
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
      
      toast({
        title: "Account Changed",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      });
    }
  });

  // Chain changed handler
  window.ethereum.on('chainChanged', (chainId: string) => {
    const numericChainId = parseInt(chainId, 16);
    callback({ chainId: numericChainId });
    
    toast({
      title: "Network Changed",
      description: `Connected to chain ID: ${numericChainId}`,
    });
  });

  // Disconnect handler
  window.ethereum.on('disconnect', () => {
    callback(initialWeb3State);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
      variant: "destructive",
    });
  });
};
