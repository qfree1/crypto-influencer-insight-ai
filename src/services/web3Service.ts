
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

// Token contract details
const WEB3D_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual token address
const WEB3D_TOKEN_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    type: 'function',
  },
];
const WEB3D_TREASURY = '0x0987654321098765432109876543210987654321'; // Example treasury address
const REQUIRED_TOKENS = 1000; // 1000 WEB3D tokens required
const REPORT_COST = 100; // 100 WEB3D tokens per additional report

// Initial web3 state
export const initialWeb3State: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  hasTokens: false,
  tokenBalance: '0',
  freeReportUsed: false,
};

// Get token balance from contract
export const getTokenBalance = async (address: string): Promise<string> => {
  if (!window.ethereum) return '0';
  
  try {
    // Create a web3 provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Create contract instance
    const tokenContract = new ethers.Contract(
      WEB3D_TOKEN_ADDRESS,
      WEB3D_TOKEN_ABI,
      provider
    );
    
    // Call balanceOf function
    const balance = await tokenContract.balanceOf(address);
    
    // Convert balance from wei to token units (assuming 18 decimals)
    const formattedBalance = ethers.utils.formatUnits(balance, 18);
    
    return formattedBalance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    
    // Fallback to simulated balance for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using simulated balance for development');
      return (Math.floor(Math.random() * 2000) + 1).toString();
    }
    
    return '0';
  }
};

// Pay for a report
export const payForReport = async (address: string): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Create a web3 provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Create contract instance with signer
    const tokenContract = new ethers.Contract(
      WEB3D_TOKEN_ADDRESS,
      WEB3D_TOKEN_ABI,
      signer
    );
    
    // Convert token amount to wei (assuming 18 decimals)
    const amount = ethers.utils.parseUnits(REPORT_COST.toString(), 18);
    
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

// Mark free report as used
export const markFreeReportUsed = (address: string): void => {
  localStorage.setItem(`freeReport_${address}`, 'true');
};

// Check if user has used free report
export const hasFreeReportBeenUsed = (address: string): boolean => {
  return localStorage.getItem(`freeReport_${address}`) === 'true';
};

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
      const freeReportUsed = localStorage.getItem(`freeReport_${address}`) === 'true';
      
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
