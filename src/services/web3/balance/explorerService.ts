
/**
 * Explorer balance service
 * Handles fetching token balances from BSCScan API
 */

import { ethers } from 'ethers';
import { 
  formatTokenBalance, 
  WEB3D_TOKEN_ADDRESS,
  BSC_EXPLORER_URL,
  BSC_EXPLORER_API_KEY
} from '../tokenUtils';
import { updateBalanceCache } from './cacheService';

/**
 * Fetch token balance using BSCScan API
 * @param address Wallet address
 * @returns Formatted token balance
 */
export const fetchTokenBalanceFromExplorer = async (address: string): Promise<string> => {
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
      updateBalanceCache(address, result);
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
