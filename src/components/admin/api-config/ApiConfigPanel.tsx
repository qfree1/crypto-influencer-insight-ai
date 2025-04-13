
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LogOut, Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  API_CONFIG_KEY, 
  DEFAULT_API_CONFIG, 
  TWITTER_CONFIG, 
  BSC_CONFIG, 
  OPENAI_CONFIG_KEY, 
  DEFAULT_OPENAI_CONFIG 
} from '@/constants/apiConfig';
import { saveApiConfig, saveOpenAiConfig, getOpenAiConfig } from '@/services/keyManagementService';

// Import our new component files
import MainApiTab from './MainApiTab';
import TwitterApiTab from './TwitterApiTab';
import OpenAiTab from './OpenAiTab';
import ApiIntegrationGuide from './ApiIntegrationGuide';

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
        
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main API</TabsTrigger>
            <TabsTrigger value="twitter">Twitter/X API</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="space-y-4 mt-4">
            <MainApiTab 
              apiConfig={apiConfig} 
              setApiConfig={setApiConfig}
              bscConfig={bscConfig}
              setBscConfig={setBscConfig}
            />
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-4 mt-4">
            <TwitterApiTab 
              twitterConfig={twitterConfig}
              setTwitterConfig={setTwitterConfig}
            />
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <OpenAiTab 
              openAiConfig={openAiConfig}
              setOpenAiConfig={setOpenAiConfig}
            />
          </TabsContent>
        </Tabs>
        
        <ApiIntegrationGuide />
      </Card>
    </div>
  );
};

export default ApiConfigPanel;
