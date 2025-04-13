
import { toast } from '@/hooks/use-toast';
import { 
  API_CONFIG_KEY, 
  DEFAULT_API_CONFIG,
  OPENAI_CONFIG_KEY,
  DEFAULT_OPENAI_CONFIG,
  BSC_CONFIG,
  TWITTER_CONFIG
} from '@/constants/apiConfig';

/**
 * Securely get the Web3D API configuration
 */
export const getApiConfig = () => {
  try {
    const storedConfig = localStorage.getItem(API_CONFIG_KEY);
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_API_CONFIG;
  } catch (error) {
    console.error('Error retrieving API config:', error);
    return DEFAULT_API_CONFIG;
  }
};

/**
 * Securely save Web3D API configuration
 */
export const saveApiConfig = (config: typeof DEFAULT_API_CONFIG) => {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving API config:', error);
    toast({
      title: "Error Saving Configuration",
      description: "Failed to save API configuration",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Get BSC Explorer API key
 */
export const getBscApiKey = () => {
  return BSC_CONFIG.explorerApiKey;
};

/**
 * Get BSC Explorer URL
 */
export const getBscExplorerUrl = () => {
  return BSC_CONFIG.explorerUrl;
};

/**
 * Get Twitter API Bearer Token
 */
export const getTwitterBearerToken = () => {
  return TWITTER_CONFIG.bearerToken;
};

/**
 * Get Twitter API Key
 */
export const getTwitterApiKey = () => {
  return DEFAULT_API_CONFIG.apiKey;
};

/**
 * Securely get OpenAI configuration
 */
export const getOpenAiConfig = () => {
  try {
    const storedConfig = localStorage.getItem(OPENAI_CONFIG_KEY);
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_OPENAI_CONFIG;
  } catch (error) {
    console.error('Error retrieving OpenAI config:', error);
    return DEFAULT_OPENAI_CONFIG;
  }
};

/**
 * Securely save OpenAI configuration
 */
export const saveOpenAiConfig = (config: typeof DEFAULT_OPENAI_CONFIG) => {
  try {
    localStorage.setItem(OPENAI_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving OpenAI config:', error);
    toast({
      title: "Error Saving Configuration",
      description: "Failed to save OpenAI configuration",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Initialize OpenAI with valid API key
 */
export const initializeOpenAiConfig = () => {
  try {
    // Only set if not already configured
    const current = getOpenAiConfig();
    if (!current.apiKey) {
      saveOpenAiConfig({
        ...DEFAULT_OPENAI_CONFIG,
        // Using a client-side usable API key for demo purposes
        apiKey: 'sk-proj-N1VJRmVXemlqWVZvZWRTbjAxZTAxMDM0YTZlMDBmYzdlYzEzMDpub3QtcmVhbC1hcGkta2V5'
      });
      console.log('OpenAI API key initialized');
    }
    return true;
  } catch (error) {
    console.error('Error initializing OpenAI config:', error);
    return false;
  }
};
