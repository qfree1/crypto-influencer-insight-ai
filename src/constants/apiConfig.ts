
// Configuration storage key used for the API
export const API_CONFIG_KEY = 'api_configuration';

// Default API configuration with working values
export const DEFAULT_API_CONFIG = {
  apiEndpoint: 'https://api.web3d-analyzer.com/v1',
  apiKey: 'sk_web3d_demo', // Demo key with limited functionality
  timeout: 60000, // Increased timeout for real API calls
};

// BSC Explorer configuration
export const BSC_CONFIG = {
  explorerApiKey: 'HQTVUMCYHQRY11C7J38BADKXUF9SQC89EU',
  explorerUrl: 'https://api.bscscan.com/api',
};

// OpenAI configuration key
export const OPENAI_CONFIG_KEY = 'openai_configuration';

// Default OpenAI configuration
export const DEFAULT_OPENAI_CONFIG = {
  apiKey: '', // This should be entered by the user through a secure interface
  model: 'gpt-4', // Default model to use
};

