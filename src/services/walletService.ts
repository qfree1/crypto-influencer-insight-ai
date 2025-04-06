
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';
import { initialWeb3State } from '@/services/web3Service';

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

    // Get token balance (using simulated data for demo)
    const tokenBalance = await getTokenBalance(address);
    const hasTokens = parseFloat(tokenBalance) >= 1000; // Require 1000 tokens

    // Check if the user has used their free report
    const freeReportUsed = localStorage.getItem(`freeReport_${address}`) === 'true';

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

// Get token balance from contract (simulated)
const getTokenBalance = async (address: string): Promise<string> => {
  // For demo purposes, return a random balance between 0 and 2000
  return (Math.floor(Math.random() * 2000) + 1).toString();
};

// Setup listeners for wallet events
export const setupWalletListeners = (callback: (newState: Partial<Web3State>) => void): void => {
  if (!window.ethereum) return;

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
      const hasTokens = parseFloat(tokenBalance) >= 1000;
      const freeReportUsed = localStorage.getItem(`freeReport_${address}`) === 'true';
      
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

  window.ethereum.on('chainChanged', (chainId: string) => {
    const numericChainId = parseInt(chainId, 16);
    callback({ chainId: numericChainId });
    
    toast({
      title: "Network Changed",
      description: `Connected to chain ID: ${numericChainId}`,
    });
  });

  window.ethereum.on('disconnect', () => {
    callback(initialWeb3State);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
      variant: "destructive",
    });
  });
};
