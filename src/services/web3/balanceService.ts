
import { ethers } from 'ethers';
import { 
  formatTokenBalance, 
  WEB3D_TOKEN_ADDRESS, 
  WEB3D_TOKEN_ABI,
  BSC_EXPLORER_URL,
  BSC_EXPLORER_API_KEY
} from './tokenUtils';

// Improved cache mechanism for token balances
const balanceCache = new Map<string, { balance: string, timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds cache lifetime (reduced from 30s)

// Fetch token balance using BSCScan API when Web3 provider is not available
export const fetchTokenBalanceFromAPI = async (address: string): Promise<string> => {
  try {
    console.log(`Fetching balance from BSCScan API for ${address}`);
    const url = `${BSC_EXPLORER_URL}?module=account&action=tokenbalance&contractaddress=${WEB3D_TOKEN_ADDRESS}&address=${address}&tag=latest&apikey=${BSC_EXPLORER_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1') {
      // Convert balance from wei to token units (assuming 18 decimals)
      const formattedBalance = ethers.formatUnits(data.result, 18);
      const result = formatTokenBalance(formattedBalance);
      
      // Update cache
      balanceCache.set(address, { balance: result, timestamp: Date.now() });
      console.log(`Updated cache with BSCScan balance: ${result}`);
      
      return result;
    }
    
    console.error('Error from BSCScan API:', data.message);
    return '0.00';
  } catch (error) {
    console.error('Error fetching token balance from BSCScan API:', error);
    return '0.00';
  }
};

// Get token balance from contract with improved caching and retries
export const getTokenBalance = async (address: string): Promise<string> => {
  if (!address) return '0.00';
  
  // Check cache first
  const cachedData = balanceCache.get(address);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached balance for ${address}: ${cachedData.balance}`);
    return cachedData.balance;
  }
  
  console.log(`Fetching fresh balance for ${address}`);
  
  try {
    // Try to use Web3 provider if available
    if (window.ethereum) {
      try {
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
        const result = formatTokenBalance(formattedBalance);
        
        console.log(`Fetched contract balance: ${result}`);
        
        // Update cache
        balanceCache.set(address, { balance: result, timestamp: Date.now() });
        
        return result;
      } catch (contractError) {
        console.error('Error getting token balance from contract:', contractError);
        
        // Fallback to BSCScan API if contract call fails
        return await fetchTokenBalanceFromAPI(address);
      }
    } else {
      // Fallback to BSCScan API if no Web3 provider is available
      return await fetchTokenBalanceFromAPI(address);
    }
  } catch (error) {
    console.error('Error getting token balance:', error);
    
    // Fallback to simulated balance for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using simulated balance for development');
      const simulatedBalance = formatTokenBalance((Math.floor(Math.random() * 2000) + 1).toString());
      
      // Update cache
      balanceCache.set(address, { balance: simulatedBalance, timestamp: Date.now() });
      
      return simulatedBalance;
    }
    
    return '0.00';
  }
};

// Clear balance cache for an address or all addresses
export const clearBalanceCache = (address?: string) => {
  if (address) {
    console.log(`Clearing balance cache for ${address}`);
    balanceCache.delete(address);
  } else {
    console.log('Clearing all balance cache');
    balanceCache.clear();
  }
};
