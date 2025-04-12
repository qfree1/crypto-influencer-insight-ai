
import { getBscApiKey, getBscExplorerUrl } from '../keyManagementService';

/**
 * Utility functions for token handling and formatting
 */

// Format token balance to 2 decimal places
export const formatTokenBalance = (balance: string): string => {
  const numericBalance = parseFloat(balance);
  return numericBalance.toFixed(2);
};

// Constants for token requirements and costs
export const WEB3D_TOKEN_ADDRESS = '0x7ed9054c48088bb8cfc5c5fbc32775b9455a13f7';
export const WEB3D_TREASURY = '0xcaE2D679961bd3e7501E9a48a9f820521bE6d1eE';
export const REQUIRED_TOKENS = 1; // 1 WEB3D token required
export const REPORT_COST = 1; // 1 WEB3D token per additional report

// Token contract ABI (minimal)
export const WEB3D_TOKEN_ABI = [
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

// BSC network configuration
export const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org/';
export const BSC_CHAIN_ID = 56;
export const BSC_EXPLORER_API_KEY = getBscApiKey();
export const BSC_EXPLORER_URL = getBscExplorerUrl();
