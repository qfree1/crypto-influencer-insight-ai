
// Configuration storage key used for the API
export const API_CONFIG_KEY = 'api_configuration';

// Default API configuration with working values
export const DEFAULT_API_CONFIG = {
  apiEndpoint: 'https://api.web3d-analyzer.com/v1',
  apiKey: 'cdvKpEkKUu3s41Hjy2ZSrTdT4', // Twitter API Key
  timeout: 60000, // Increased timeout for real API calls
};

// BSC Explorer configuration
export const BSC_CONFIG = {
  explorerApiKey: 'NQNPBFH4GY18RJVPG7KAG6I5YPAXGVI67A', // Updated API key
  explorerUrl: 'https://api.bscscan.com/api',
};

// OpenAI configuration key
export const OPENAI_CONFIG_KEY = 'openai_configuration';

// Default OpenAI configuration
export const DEFAULT_OPENAI_CONFIG = {
  apiKey: '', // This should be entered by the user through a secure interface
  model: 'gpt-4o-mini', // Default model to use
};

// Twitter API configuration with updated tokens
export const TWITTER_CONFIG = {
  bearerToken: 'AAAAAAAAAAAAAAAAAAAAAIheZgEAAAAAgx%2BFQRBi7dQ11%2BdO2%2B%2FPJ6OS40k%3DzJhzsaUOVDHT8OvYQTWfYlFXKAMKNdeUXTOkPzhdEJypvRN7Sd',
  accessToken: '1828824315799740416-sr0rKu6PQzte6srvQFtWLsdGLZrYjt',
  accessTokenSecret: '4SAukeH7wjMNf1XGStXnRzKgUMi912M1AEsxJNjVpM59J',
  apiKeySecret: 'o0aoOgqlF23FkLNnemA90pI4wi8jiKsnD7SQ90FkeTeJcygM3J',
};
