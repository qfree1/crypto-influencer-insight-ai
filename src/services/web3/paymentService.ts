
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';
import { 
  WEB3D_TOKEN_ADDRESS, 
  WEB3D_TOKEN_ABI, 
  WEB3D_TREASURY, 
  REPORT_COST,
  BSC_CHAIN_ID,
  BSC_RPC_URL
} from './tokenUtils';

// Pay for a report
export const payForReport = async (address: string): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Create a web3 provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Check if we're connected to BSC
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    if (chainId !== BSC_CHAIN_ID) {
      // Prompt user to switch to BSC
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + BSC_CHAIN_ID.toString(16) }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x' + BSC_CHAIN_ID.toString(16),
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: [BSC_RPC_URL],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
    
    // Create contract instance with signer
    const tokenContract = new ethers.Contract(
      WEB3D_TOKEN_ADDRESS,
      WEB3D_TOKEN_ABI,
      signer
    );
    
    // Convert token amount to wei (assuming 18 decimals)
    const amount = ethers.parseUnits(REPORT_COST.toString(), 18);
    
    // Send transaction
    const tx = await tokenContract.transfer(WEB3D_TREASURY, amount);
    
    // Wait for transaction confirmation
    await tx.wait();
    
    toast({
      title: "Payment Successful",
      description: `Paid ${REPORT_COST} WEB3D tokens for analysis`,
    });
    
    return true;
  } catch (error) {
    console.error('Error paying for report:', error);
    
    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using simulated payment for development');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Payment Successful",
        description: `Paid ${REPORT_COST} WEB3D tokens for analysis`,
      });
      
      return true;
    }
    
    toast({
      title: "Payment Failed",
      description: "Failed to process your payment",
      variant: "destructive",
    });
    
    return false;
  }
};
