
import { Input } from '@/components/ui/input';
import { Database } from 'lucide-react';

interface MainApiTabProps {
  apiConfig: {
    apiEndpoint: string;
    apiKey: string;
    timeout: number;
  };
  setApiConfig: React.Dispatch<React.SetStateAction<{
    apiEndpoint: string;
    apiKey: string;
    timeout: number;
  }>>;
  bscConfig: {
    explorerApiKey: string;
    explorerUrl: string;
  };
  setBscConfig: React.Dispatch<React.SetStateAction<{
    explorerApiKey: string;
    explorerUrl: string;
  }>>;
}

const MainApiTab = ({ apiConfig, setApiConfig, bscConfig, setBscConfig }: MainApiTabProps) => {
  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Main API Configuration</h3>
      </div>
      
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
    </>
  );
};

export default MainApiTab;
