
/**
 * Utility functions for working with different wallet providers
 */

import { WalletProvider } from './types';

// Get provider icon
export const getProviderIcon = (provider: WalletProvider): string => {
  switch (provider) {
    case WalletProvider.METAMASK:
      return '/lovable-uploads/e4a27e02-846f-4189-896c-f5965a7beb2b.png';
    case WalletProvider.TRUST:
      return '/lovable-uploads/f32836e4-15db-4576-ac88-fabc3c8a4955.png';
    case WalletProvider.BINANCE:
      return '/lovable-uploads/86070191-68a4-4e80-a3b7-95c4098d7c09.png';
    case WalletProvider.WALLETCONNECT:
      return '/lovable-uploads/6c48c1df-59c1-4df0-9868-5642f153ff6a.png';
    default:
      return '';
  }
};

// Check if provider is supported on mobile
export const isProviderMobileSupported = (provider: WalletProvider): boolean => {
  // All providers are currently supported on mobile
  return true;
};

// Get list of all available wallet providers
export const getAvailableWalletProviders = (): { 
  name: string;
  icon: string;
  provider: WalletProvider;
  isMobileSupported: boolean;
}[] => {
  return [
    {
      name: 'MetaMask',
      icon: getProviderIcon(WalletProvider.METAMASK),
      provider: WalletProvider.METAMASK,
      isMobileSupported: isProviderMobileSupported(WalletProvider.METAMASK)
    },
    {
      name: 'Trust Wallet',
      icon: getProviderIcon(WalletProvider.TRUST),
      provider: WalletProvider.TRUST,
      isMobileSupported: isProviderMobileSupported(WalletProvider.TRUST)
    },
    {
      name: 'Binance Wallet',
      icon: getProviderIcon(WalletProvider.BINANCE),
      provider: WalletProvider.BINANCE,
      isMobileSupported: isProviderMobileSupported(WalletProvider.BINANCE)
    },
    {
      name: 'WalletConnect',
      icon: getProviderIcon(WalletProvider.WALLETCONNECT),
      provider: WalletProvider.WALLETCONNECT,
      isMobileSupported: isProviderMobileSupported(WalletProvider.WALLETCONNECT)
    }
  ];
};

