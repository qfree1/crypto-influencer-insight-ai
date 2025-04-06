
/**
 * Balance caching service
 * Handles caching of token balances
 */

// Cache mechanism for token balances
const balanceCache = new Map<string, { balance: string, timestamp: number }>();
const CACHE_TTL = 10000; // 10 seconds cache lifetime

/**
 * Get cached balance if available and not expired
 * @param address Wallet address to check
 * @returns The cached balance if available, null otherwise
 */
export const getCachedBalance = (address: string): string | null => {
  const cachedData = balanceCache.get(address);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    console.log(`Using cached balance for ${address}: ${cachedData.balance}`);
    return cachedData.balance;
  }
  return null;
};

/**
 * Update the balance cache
 * @param address Wallet address
 * @param balance Token balance
 */
export const updateBalanceCache = (address: string, balance: string): void => {
  balanceCache.set(address, { balance, timestamp: Date.now() });
  console.log(`Updated cache with balance for ${address}: ${balance}`);
};

/**
 * Clear balance cache for an address or all addresses
 * @param address Optional wallet address. If not provided, clears all cached balances
 */
export const clearBalanceCache = (address?: string): void => {
  if (address) {
    console.log(`Clearing balance cache for ${address}`);
    balanceCache.delete(address);
  } else {
    console.log('Clearing all balance cache');
    balanceCache.clear();
  }
};
