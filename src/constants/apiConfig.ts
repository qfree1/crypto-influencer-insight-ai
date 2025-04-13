
// Configuration storage key used for the API
export const API_CONFIG_KEY = 'api_configuration';

// Default API configuration with working values
export const DEFAULT_API_CONFIG = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.web3d-analyzer.com/v1',
  apiKey: import.meta.env.VITE_API_KEY || 'cdvKpEkKUu3s41Hjy2ZSrTdT4', // Twitter API Key
  timeout: 60000, // Increased timeout for real API calls
};

// BSC Explorer configuration
export const BSC_CONFIG = {
  explorerApiKey: import.meta.env.VITE_BSC_EXPLORER_API_KEY || 'NQNPBFH4GY18RJVPG7KAG6I5YPAXGVI67A',
  explorerUrl: import.meta.env.VITE_BSC_EXPLORER_URL || 'https://api.bscscan.com/api',
};

// OpenAI configuration key
export const OPENAI_CONFIG_KEY = 'openai_configuration';

// Default OpenAI configuration
export const DEFAULT_OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // This should be entered by the user through a secure interface
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini', // Default model to use
};

// Twitter API configuration with updated tokens
export const TWITTER_CONFIG = {
  bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAIheZgEAAAAAgx%2BFQRBi7dQ11%2BdO2%2B%2FPJ6OS40k%3DzJhzsaUOVDHT8OvYQTWfYlFXKAMKNdeUXTOkPzhdEJypvRN7Sd',
  accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN || '1828824315799740416-sr0rKu6PQzte6srvQFtWLsdGLZrYjt',
  accessTokenSecret: import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET || '4SAukeH7wjMNf1XGStXnRzKgUMi912M1AEsxJNjVpM59J',
  apiKeySecret: import.meta.env.VITE_TWITTER_API_KEY_SECRET || 'o0aoOgqlF23FkLNnemA90pI4wi8jiKsnD7SQ90FkeTeJcygM3J',
};

// CORS Proxy configuration
export const CORS_PROXY = import.meta.env.VITE_CORS_PROXY || 'https://cors-anywhere.herokuapp.com/';
