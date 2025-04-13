import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Save, Twitter, Database, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG_KEY, DEFAULT_API_CONFIG, TWITTER_CONFIG, BSC_CONFIG, OPENAI_CONFIG_KEY, DEFAULT_OPENAI_CONFIG } from '@/constants/apiConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveApiConfig, saveOpenAiConfig, getOpenAiConfig } from '@/services/keyManagementService';

interface ApiConfigPanelProps {
  onLogout: () => void;
}

const ApiConfigPanel = ({ onLogout }: ApiConfigPanelProps) => {
  const [apiConfig, setApiConfig] = useState(DEFAULT_API_CONFIG);
  const [twitterConfig, setTwitterConfig] = useState(TWITTER_CONFIG);
  const [bscConfig, setBscConfig] = useState(BSC_CONFIG);
  const [openAiConfig, setOpenAiConfig] = useState(DEFAULT_OPENAI_CONFIG);
  
  useEffect(() => {
    try {
      const savedApiConfig = localStorage.getItem(API_CONFIG_KEY);
      if (savedApiConfig) {
        setApiConfig(JSON.parse(savedApiConfig));
      }
      
      const savedOpenAiConfig = getOpenAiConfig();
      if (savedOpenAiConfig) {
        setOpenAiConfig(savedOpenAiConfig);
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  }, []);

  const saveConfigurations = () => {
    try {
      saveApiConfig(apiConfig);
      
      saveOpenAiConfig(openAiConfig);
      
      localStorage.setItem('twitter_config', JSON.stringify(twitterConfig));
      localStorage.setItem('bsc_config', JSON.stringify(bscConfig));
      
      toast({
        title: "Configurations Saved",
        description: "All API settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configurations",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
            alt="Web3D Logo" 
            className="w-6 h-6 mr-2" 
          />
          <h1 className="text-2xl font-bold text-gradient">API Configuration</h1>
        </div>
        
        <Button onClick={onLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <Card className="p-6 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">External API Settings</h2>
          </div>
          <Button onClick={saveConfigurations} className="bg-crypto-gradient">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
        
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main API</TabsTrigger>
            <TabsTrigger value="twitter">Twitter/X API</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">API Endpoint</label>
              <Input 
                value={apiConfig.apiEndpoint} 
                onChange={(e) => setApiConfig({...apiConfig, apiEndpoint: e.target.value})}
                placeholder="https://api.example.com/endpoint"
              />
              <p className="text-sm text-muted-foreground mt-1">
                The URL of the influencer analysis API
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">API Key</label>
              <Input 
                type="password"
                value={apiConfig.apiKey} 
                onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                placeholder="Enter your API key"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Authentication key for accessing the API
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Timeout (ms)</label>
              <Input 
                type="number"
                value={apiConfig.timeout.toString()} 
                onChange={(e) => setApiConfig({...apiConfig, timeout: parseInt(e.target.value) || 30000})}
              />
              <p className="text-sm text-muted-foreground mt-1">
                How long to wait for API response before timing out
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">BSC Explorer API Key</label>
              <Input 
                type="password"
                value={bscConfig.explorerApiKey} 
                onChange={(e) => setBscConfig({...bscConfig, explorerApiKey: e.target.value})}
                placeholder="Enter BSC Explorer API key"
              />
              <p className="text-sm text-muted-foreground mt-1">
                API key for BSCScan blockchain explorer
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Twitter className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Twitter/X API Configuration</h3>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Bearer Token</label>
              <Input 
                type="password"
                value={twitterConfig.bearerToken} 
                onChange={(e) => setTwitterConfig({...twitterConfig, bearerToken: e.target.value})}
                placeholder="Bearer token for Twitter API"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Access Token</label>
              <Input 
                type="password"
                value={twitterConfig.accessToken} 
                onChange={(e) => setTwitterConfig({...twitterConfig, accessToken: e.target.value})}
                placeholder="Access token"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Access Token Secret</label>
              <Input 
                type="password"
                value={twitterConfig.accessTokenSecret} 
                onChange={(e) => setTwitterConfig({...twitterConfig, accessTokenSecret: e.target.value})}
                placeholder="Access token secret"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">API Key Secret</label>
              <Input 
                type="password"
                value={twitterConfig.apiKeySecret} 
                onChange={(e) => setTwitterConfig({...twitterConfig, apiKeySecret: e.target.value})}
                placeholder="API key secret"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-medium">OpenAI Configuration</h3>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">OpenAI API Key</label>
              <Input 
                type="password"
                value={openAiConfig.apiKey} 
                onChange={(e) => setOpenAiConfig({...openAiConfig, apiKey: e.target.value})}
                placeholder="Enter OpenAI API key"
              />
              <p className="text-sm text-muted-foreground mt-1">
                API key for accessing OpenAI services
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Model</label>
              <Input 
                value={openAiConfig.model} 
                onChange={(e) => setOpenAiConfig({...openAiConfig, model: e.target.value})}
                placeholder="OpenAI model name (e.g. gpt-4o-mini)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                The OpenAI model to use for analysis
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/30 p-4 rounded-md mt-6">
          <h3 className="font-medium mb-2 flex items-center">
            <img 
              src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
              alt="Web3D Logo" 
              className="w-5 h-5 mr-2" 
            />
            API Integration Guide
          </h3>
          <p className="text-sm text-muted-foreground">
            To use real data for influencer analysis, you need to connect to external APIs that provide:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
            <li>Social media metrics (followers, engagement rates)</li>
            <li>Blockchain transaction data (wallet addresses, token movements)</li>
            <li>Risk assessment algorithms</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Recommended API providers: Moralis, Alchemy, Etherscan, Twitter API, or specialized crypto influencer
            analysis platforms.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ApiConfigPanel;
