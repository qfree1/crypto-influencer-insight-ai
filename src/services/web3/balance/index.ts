
/**
 * Balance service entry point
 * Provides the main functions for retrieving token balances
 */

import { getCachedBalance, clearBalanceCache } from './cacheService';
import { getTokenBalanceFromContract } from './contractService';
import { fetchTokenBalanceFromExplorer } from './explorerService';
import { formatTokenBalance } from '../tokenUtils';

/**
 * Get token balance with caching and fallbacks
 * @param address Wallet address
 * @returns Formatted token balance
 */
export const getTokenBalance = async (address: string): Promise<string> => {
  if (!address) return '0.00';
  
  // Check cache first
  const cachedBalance = getCachedBalance(address);
  if (cachedBalance) return cachedBalance;
  
  console.log(`Fetching fresh balance for ${address}`);
  
  try {
    // Try to use Web3 provider if available
    if (window.ethereum) {
      return await getTokenBalanceFromContract(address);
    } else {
      // Fallback to BSCScan API if no Web3 provider is available
      return await fetchTokenBalanceFromExplorer(address);
    }
  } catch (error) {
    console.error('Error getting token balance:', error);
    
    // Fallback to simulated balance for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using simulated balance for development');
      const simulatedBalance = formatTokenBalance((Math.random() * 10000).toString());
      
      // Update cache via importing from cacheService
      const { updateBalanceCache } = require('./cacheService');
      updateBalanceCache(address, simulatedBalance);
      
      return simulatedBalance;
    }
    
    return '0.00';
  }
};

// Re-export all balance-related functionality
export { clearBalanceCache } from './cacheService';
