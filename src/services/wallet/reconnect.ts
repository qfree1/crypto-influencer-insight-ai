
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';
import { 
  initialWeb3State,
  getTokenBalance,
  hasFreeReportUsed,
  REQUIRED_TOKENS
} from '@/services/web3Service';
import { getSavedWalletConnection } from '@/services/storageService';
import { clearBalanceCache } from '@/services/web3/balanceService';

// Auto-reconnect wallet from saved connection
export const autoReconnectWallet = async (): Promise<Web3State> => {
  try {
    if (!window.ethereum) {
      console.log('No Ethereum provider found for auto-reconnect');
      return initialWeb3State;
    }
    
    const { address, provider } = getSavedWalletConnection();
    
    if (!address || !provider) {
      console.log('No saved wallet connection found');
      return initialWeb3State;
    }
    
    console.log(`Attempting to reconnect wallet: ${address} (${provider})`);
    
    // Clear balance cache before reconnecting
    clearBalanceCache();
    
    // Check if the address is still in connected accounts without prompting user
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.includes(address)) {
        // Get chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Get token balance with retries
        let attempts = 0;
        let tokenBalance = '0';
        
        while (attempts < 3) {
          tokenBalance = await getTokenBalance(address);
          console.log(`Reconnect balance attempt ${attempts + 1}:`, tokenBalance);
          if (parseFloat(tokenBalance) > 0 || attempts === 2) break;
          attempts++;
          // Small delay between retries
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;
        
        // Check free report usage
        const freeReportUsed = hasFreeReportUsed(address);
        
        console.log('Successfully reconnected wallet with balance:', tokenBalance);
        
        toast({
          title: "Wallet Reconnected",
          description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
        });
        
        return {
          isConnected: true,
          address,
          chainId: parseInt(chainId, 16),
          hasTokens,
          tokenBalance,
          freeReportUsed,
        };
      } else {
        console.log('Address not in connected accounts', accounts);
        return initialWeb3State;
      }
    } catch (error) {
      console.error('Error checking accounts during auto-reconnect:', error);
      return initialWeb3State;
    }
  } catch (error) {
    console.error('Auto-reconnect error:', error);
    return initialWeb3State;
  }
};

