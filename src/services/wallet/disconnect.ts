
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';
import { initialWeb3State } from '@/services/web3Service';
import { clearBalanceCache } from '@/services/web3/balanceService';

// Disconnect wallet
export const disconnectWallet = (): Web3State => {
  // Clear local storage
  localStorage.removeItem('web3d_connected_wallet');
  localStorage.removeItem('web3d_wallet_provider');
  
  // Clear balance cache
  clearBalanceCache();
  
  toast({
    title: "Wallet Disconnected",
    description: "Your wallet has been disconnected",
  });
  
  return initialWeb3State;
};

