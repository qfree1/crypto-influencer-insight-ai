
import { BlockchainData } from '@/types';
import { getBscApiKey, getBscExplorerUrl } from '../keyManagementService';
import { generateSyntheticBlockchainData } from './syntheticDataService';

/**
 * Analyze blockchain activity for a given address
 */
export const analyzeBlockchainActivity = async (address: string): Promise<BlockchainData> => {
  try {
    // Use BSC Explorer API to get real data
    const apiKey = getBscApiKey();
    const explorerUrl = getBscExplorerUrl();
    
    // Get transaction list for the address
    const response = await fetch(`${explorerUrl}?module=account&action=txlist&address=${address}&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`BSC Explorer API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== '1') {
      console.warn('BSC Explorer API warning:', data.message);
      // Fallback to synthetic data if API fails
      return generateSyntheticBlockchainData(address);
    }
    
    const transactions = data.result || [];
    
    // Analyze transactions for rug pull patterns
    // This is a simplified analysis for demo purposes
    const outgoingTxs = transactions.filter(tx => 
      tx.from.toLowerCase() === address.toLowerCase() && tx.value > 0
    );
    
    const incomingTxs = transactions.filter(tx => 
      tx.to.toLowerCase() === address.toLowerCase() && tx.value > 0
    );
    
    // Check for dump patterns - large outflows after inflows
    let dumpingScore = 'low';
    let rugPullCount = 0;
    
    // Quick dump = selling within 3 blocks of receiving
    if (outgoingTxs.length > 0 && incomingTxs.length > 0) {
      // Map block numbers to transaction types
      const blockMap = new Map();
      
      incomingTxs.forEach(tx => {
        blockMap.set(parseInt(tx.blockNumber), 'in');
      });
      
      outgoingTxs.forEach(tx => {
        const blockNum = parseInt(tx.blockNumber);
        // Check if there was an incoming tx within 3 blocks before this outgoing tx
        for (let i = 1; i <= 3; i++) {
          if (blockMap.get(blockNum - i) === 'in') {
            rugPullCount++;
            break;
          }
        }
      });
      
      // Determine dumping behavior score
      if (rugPullCount > 5) {
        dumpingScore = 'high';
      } else if (rugPullCount > 2) {
        dumpingScore = 'medium';
      }
    }
    
    // Check for MEV activity
    const mevActivity = transactions.some(tx => 
      tx.gasPrice > 100000000000 // Extremely high gas price is a potential MEV indicator
    );
    
    return {
      address,
      rugPullCount,
      dumpingBehavior: dumpingScore as 'high' | 'medium' | 'low',
      mevActivity,
    };
  } catch (error) {
    console.error('Error analyzing blockchain activity:', error);
    // Fallback to synthetic data
    return generateSyntheticBlockchainData(address);
  }
};
