
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

// Mock token contract details
const WEB3D_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890'; // Example address
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

// Connect to wallet
export const connectWallet = async (): Promise<Web3State> => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return initialWeb3State;
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (accounts.length === 0) {
      return initialWeb3State;
    }

    const address = accounts[0];

    // Get token balance (using simulated data for demo)
    // In production, you would use ethers.js or web3.js to call the actual token contract
    const tokenBalance = await getTokenBalance(address);
    const hasTokens = parseFloat(tokenBalance) >= REQUIRED_TOKENS;

    // Check if the user has used their free report (would normally check from backend/local storage)
    const freeReportUsed = localStorage.getItem(`freeReport_${address}`) === 'true';

    toast({
      title: "Wallet Connected",
      description: `Connected to address ${address.substring(0, 6)}...${address.substring(38)}`,
    });

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

// Get token balance from contract
export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    // For demo purposes, return a random balance 
    // In production, this would call the actual token contract using ethers.js:
    /*
    const provider = new ethers.BrowserProvider(window.ethereum);
    const tokenContract = new ethers.Contract(
      WEB3D_TOKEN_ADDRESS,
      WEB3D_TOKEN_ABI,
      provider
    );
    
    const balance = await tokenContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
    */
    
    return (Math.floor(Math.random() * 2000) + 1).toString();
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

// Pay for a report
export const payForReport = async (address: string): Promise<boolean> => {
  try {
    // For demo purposes, just simulate a successful payment
    // In production, this would call the transfer method on the token contract:
    /*
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(
      WEB3D_TOKEN_ADDRESS,
      WEB3D_TOKEN_ABI,
      signer
    );
    
    const tx = await tokenContract.transfer(
      WEB3D_TREASURY, 
      ethers.parseUnits(REPORT_COST.toString(), 18)
    );
    
    await tx.wait();
    */
    
    // Simulate transaction processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Payment Successful",
      description: `Paid ${REPORT_COST} WEB3D tokens for analysis`,
    });
    
    return true;
  } catch (error) {
    console.error('Error paying for report:', error);
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
