
import { Web3State } from '@/types';
import { getTokenBalance } from './balanceService';
import { hasFreeReportUsed } from './reportService';
import { REQUIRED_TOKENS } from './tokenUtils';
import { initialWeb3State } from '../web3Service';
import { toast } from '@/hooks/use-toast';

// Listen for account changes
export const setupWeb3Listeners = (callback: (newState: Partial<Web3State>) => void): void => {
  if (!window.ethereum) {
    console.log('No Ethereum provider found for listeners');
    return;
  }

  // Remove any existing listeners to prevent duplicates
  window.ethereum.removeListener('accountsChanged', () => {});
  window.ethereum.removeListener('chainChanged', () => {});
  window.ethereum.removeListener('disconnect', () => {});

  // Account changed handler
  window.ethereum.on('accountsChanged', async (accounts: string[]) => {
    console.log('Account changed event:', accounts);
    if (accounts.length === 0) {
      callback(initialWeb3State);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } else {
      const address = accounts[0];
      try {
        // Get token balance with retry mechanism
        let attempts = 0;
        let tokenBalance = '0';
        
        while (attempts < 3) {
          tokenBalance = await getTokenBalance(address);
          console.log(`Balance attempt ${attempts + 1}:`, tokenBalance);
          if (parseFloat(tokenBalance) > 0 || attempts === 2) break;
          attempts++;
          // Small delay between retries
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
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
      } catch (error) {
        console.error('Error updating state after account change:', error);
        toast({
          title: "Error Getting Balance",
          description: "Could not retrieve your token balance",
          variant: "destructive",
        });
      }
    }
  });

  // Chain changed handler
  window.ethereum.on('chainChanged', (chainId: string) => {
    console.log('Chain changed event:', chainId);
    const numericChainId = parseInt(chainId, 16);
    callback({ chainId: numericChainId });
    
    toast({
      title: "Network Changed",
      description: `Connected to chain ID: ${numericChainId}`,
    });
    
    // Refresh token balance when chain changes
    window.ethereum.request({ method: 'eth_accounts' })
      .then(async (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          try {
            // Clear cache to force fresh balance
            const tokenBalance = await getTokenBalance(address);
            const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;
            
            callback({
              tokenBalance,
              hasTokens
            });
          } catch (error) {
            console.error('Error getting balance after chain change:', error);
          }
        }
      })
      .catch(console.error);
  });

  // Disconnect handler
  window.ethereum.on('disconnect', (error: any) => {
    console.log('Disconnect event:', error);
    callback(initialWeb3State);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
      variant: "destructive",
    });
  });
  
  // Ensure we have the latest balance on init
  window.ethereum.request({ method: 'eth_accounts' })
    .then(async (accounts: string[]) => {
      if (accounts.length > 0) {
        const address = accounts[0];
        try {
          // Clear cache to force fresh balance
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
        } catch (error) {
          console.error('Error getting initial balance:', error);
        }
      }
    })
    .catch(console.error);
};
