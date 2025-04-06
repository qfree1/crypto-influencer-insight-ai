
/**
 * Contract balance service
 * Handles fetching token balances directly from the contract
 */

import { ethers } from 'ethers';
import { WEB3D_TOKEN_ADDRESS, WEB3D_TOKEN_ABI } from '../tokenUtils';
import { formatTokenBalance } from '../tokenUtils';
import { updateBalanceCache } from './cacheService';
import { fetchTokenBalanceFromExplorer } from './explorerService';

/**
 * Get token balance from contract
 * @param address Wallet address
 * @returns Formatted token balance or fallback to explorer API
 */
export const getTokenBalanceFromContract = async (address: string): Promise<string> => {
  console.log(`Fetching balance from contract for ${address}`);
  
  if (!window.ethereum) {
    console.log('No Ethereum provider available for contract call');
    return await fetchTokenBalanceFromExplorer(address);
  }
  
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
    updateBalanceCache(address, result);
    
    return result;
  } catch (contractError) {
    console.error('Error getting token balance from contract:', contractError);
    
    // Fallback to explorer API if contract call fails
    return await fetchTokenBalanceFromExplorer(address);
  }
};
