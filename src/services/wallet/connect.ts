
import { Web3State } from '@/types';
import { WalletProvider } from './types';
import { toast } from '@/hooks/use-toast';
import { 
  initialWeb3State,
  getTokenBalance,
  hasFreeReportUsed,
  REQUIRED_TOKENS
} from '@/services/web3Service';
import { saveWalletConnection } from '@/services/storageService';
import { clearBalanceCache } from '@/services/web3/balanceService';

// Connect to wallet with specified provider
export const connectToWallet = async (provider: WalletProvider): Promise<Web3State> => {
  try {
    // Check if Web3 is available
    if (!window.ethereum) {
      toast({
        title: "No Web3 Provider Found",
        description: "Please install a Web3 wallet like MetaMask",
        variant: "destructive",
      });
      return initialWeb3State;
    }

    let ethereum = window.ethereum;

    // Handle different wallet providers
    switch (provider) {
      case WalletProvider.METAMASK:
        // Check if MetaMask is the active provider or in a multi-wallet environment
        if (window.ethereum.isMetaMask) {
          ethereum = window.ethereum;
        } else if (window.ethereum.providers) {
          // In multi-wallet environments, find MetaMask provider
          ethereum = window.ethereum.providers.find((p: any) => p.isMetaMask) || window.ethereum;
        }
        break;
        
      case WalletProvider.TRUST:
        // Check for Trust Wallet
        if (window.ethereum.isTrust || window.ethereum.isTrustWallet) {
          ethereum = window.ethereum;
        } else {
          // For mobile deep linking
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = `https://link.trustwallet.com/open_url?url=${encodeURIComponent(window.location.href)}`;
            return initialWeb3State;
          }
        }
        break;
        
      case WalletProvider.BINANCE:
        // Check for Binance Chain Wallet
        if (window.ethereum.isBinance || window.BinanceChain) {
          ethereum = window.BinanceChain || window.ethereum;
        } else {
          // For mobile deep linking
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = `https://www.binance.com/en/wallet-direct?url=${encodeURIComponent(window.location.href)}`;
            return initialWeb3State;
          }
        }
        break;
        
      case WalletProvider.WALLETCONNECT:
        // WalletConnect implementation would normally use their protocol
        // For demo, we'll use the built-in wallet
        ethereum = window.ethereum;
        break;
    }

    // Clear balance cache before connecting
    clearBalanceCache();

    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    if (accounts.length === 0) {
      return initialWeb3State;
    }

    const address = accounts[0];

    // Save wallet connection to local storage
    saveWalletConnection(address, provider);

    // Get token balance with retries
    let attempts = 0;
    let tokenBalance = '0';
    
    while (attempts < 3) {
      tokenBalance = await getTokenBalance(address);
      console.log(`Initial balance attempt ${attempts + 1}:`, tokenBalance);
      if (parseFloat(tokenBalance) > 0 || attempts === 2) break;
      attempts++;
      // Small delay between retries
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;

    // Check if the user has used their free report
    const freeReportUsed = hasFreeReportUsed(address);

    return {
      isConnected: true,
      address,
      chainId: parseInt(chainId, 16),
      hasTokens,
      tokenBalance,
      freeReportUsed,
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    toast({
      title: "Connection Failed",
      description: "Failed to connect to your wallet",
      variant: "destructive",
    });
    return initialWeb3State;
  }
};

