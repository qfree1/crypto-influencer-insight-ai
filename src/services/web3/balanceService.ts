
import { ethers } from 'ethers';
import { 
  formatTokenBalance, 
  WEB3D_TOKEN_ADDRESS, 
  WEB3D_TOKEN_ABI,
  BSC_EXPLORER_URL,
  BSC_EXPLORER_API_KEY
} from './tokenUtils';

// Fetch token balance using BSCScan API when Web3 provider is not available
export const fetchTokenBalanceFromAPI = async (address: string): Promise<string> => {
  try {
    const url = `${BSC_EXPLORER_URL}?module=account&action=tokenbalance&contractaddress=${WEB3D_TOKEN_ADDRESS}&address=${address}&tag=latest&apikey=${BSC_EXPLORER_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1') {
      // Convert balance from wei to token units (assuming 18 decimals)
      const formattedBalance = ethers.formatUnits(data.result, 18);
      return formatTokenBalance(formattedBalance);
    }
    
    console.error('Error from BSCScan API:', data.message);
    return '0.00';
  } catch (error) {
    console.error('Error fetching token balance from BSCScan API:', error);
    return '0.00';
  }
};

// Get token balance from contract
export const getTokenBalance = async (address: string): Promise<string> => {
  if (!address) return '0.00';
  
  try {
    // Try to use Web3 provider if available
    if (window.ethereum) {
      // Create a web3 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
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
      
      return formatTokenBalance(formattedBalance);
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
        return formatTokenBalance((Math.floor(Math.random() * 2000) + 1).toString());
      }
      
      return '0.00';
    }
  }
};
