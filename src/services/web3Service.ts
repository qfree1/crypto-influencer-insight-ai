
import { ethers } from 'ethers';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

// Token contract details for BSC
const WEB3D_TOKEN_ADDRESS = '0x7ed9054c48088bb8cfc5c5fbc32775b9455a13f7'; // Actual BSC token address
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
const WEB3D_TREASURY = '0xcaE2D679961bd3e7501E9a48a9f820521bE6d1eE'; // Updated treasury address
const REQUIRED_TOKENS = 1000; // 1000 WEB3D tokens required
const REPORT_COST = 100; // 100 WEB3D tokens per additional report

// BSC network configuration
const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org/';
const BSC_CHAIN_ID = 56;
const BSC_EXPLORER_API_KEY = 'HQTVUMCYHQRY11C7J38BADKXUF9SQC89EU';
const BSC_EXPLORER_URL = 'https://api.bscscan.com/api';

// Initial web3 state
export const initialWeb3State: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  hasTokens: false,
  tokenBalance: '0',
  freeReportUsed: false,
};

// Fetch token balance using BSCScan API when Web3 provider is not available
const fetchTokenBalanceFromAPI = async (address: string): Promise<string> => {
  try {
    const url = `${BSC_EXPLORER_URL}?module=account&action=tokenbalance&contractaddress=${WEB3D_TOKEN_ADDRESS}&address=${address}&tag=latest&apikey=${BSC_EXPLORER_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1') {
      // Convert balance from wei to token units (assuming 18 decimals)
      const formattedBalance = ethers.formatUnits(data.result, 18);
      return formattedBalance;
    }
    
    console.error('Error from BSCScan API:', data.message);
    return '0';
  } catch (error) {
    console.error('Error fetching token balance from BSCScan API:', error);
    return '0';
  }
};

// Get token balance from contract
export const getTokenBalance = async (address: string): Promise<string> => {
  if (!address) return '0';
  
  try {
    // Try to use Web3 provider if available
    if (window.ethereum) {
      // Create a web3 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if we're connected to BSC
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      // Create contract instance
      const tokenContract = new ethers.Contract(
        WEB3D_TOKEN_ADDRESS,
        WEB3D_TOKEN_ABI,
        provider
      );
      
      // Call balanceOf function
      const balance = await tokenContract.balanceOf(address);
      
      // Convert balance from wei to token units (assuming 18 decimals)
      const formattedBalance = ethers.formatUnits(balance, 18);
      
      return formattedBalance;
    } else {
      // Fallback to BSCScan API if no Web3 provider is available
      return await fetchTokenBalanceFromAPI(address);
    }
  } catch (error) {
    console.error('Error getting token balance:', error);
    
    // Fallback to BSCScan API on error
    try {
      return await fetchTokenBalanceFromAPI(address);
    } catch (apiError) {
      console.error('BSCScan API fallback failed:', apiError);
      
      // Fallback to simulated balance for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using simulated balance for development');
        return (Math.floor(Math.random() * 2000) + 1).toString();
      }
      
      return '0';
    }
  }
};

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

// Mark free report as used
export const markFreeReportUsed = (address: string): void => {
  localStorage.setItem(`freeReport_${address}`, 'true');
};

// Check if user has used free report
export const hasFreeReportUsed = (address: string): boolean => {
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
      const freeReportUsed = hasFreeReportUsed(address);
      
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
