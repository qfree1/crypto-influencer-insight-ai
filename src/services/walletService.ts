
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';
import { 
  initialWeb3State,
  getTokenBalance,
  setupWeb3Listeners, 
  hasFreeReportUsed
} from '@/services/web3Service';
import { REQUIRED_TOKENS } from '@/services/web3/tokenUtils';
import { saveWalletConnection, getSavedWalletConnection } from '@/services/storageService';

export enum WalletProvider {
  METAMASK = 'metamask',
  TRUST = 'trust',
  BINANCE = 'binance',
  WALLETCONNECT = 'walletconnect'
}

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

    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    if (accounts.length === 0) {
      return initialWeb3State;
    }

    const address = accounts[0];

    // Save wallet connection to local storage
    saveWalletConnection(address, provider);

    // Get token balance
    const tokenBalance = await getTokenBalance(address);
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
    
    // Check if the address is still in connected accounts without prompting user
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.includes(address)) {
        // Get chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Get token balance
        const tokenBalance = await getTokenBalance(address);
        const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;
        
        // Check free report usage
        const freeReportUsed = hasFreeReportUsed(address);
        
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

// Setup listeners for wallet events
export const setupWalletListeners = setupWeb3Listeners;

// Disconnect wallet
export const disconnectWallet = (): Web3State => {
  // Clear local storage
  localStorage.removeItem('web3d_connected_wallet');
  localStorage.removeItem('web3d_wallet_provider');
  
  toast({
    title: "Wallet Disconnected",
    description: "Your wallet has been disconnected",
  });
  
  return initialWeb3State;
};
